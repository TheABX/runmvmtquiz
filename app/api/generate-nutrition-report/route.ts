import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { NutritionReport } from "@/src/pdf/NutritionReport";
import { generateNutritionPlan, type NutritionData, type TrainingLoadData } from "@/src/lib/nutritionPlanGenerator";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for server-side operations
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(req: NextRequest) {
  try {
    console.log('📄 Nutrition PDF generation started');
    
    const body = await req.json();
    const { userId, name } = body;

    console.log('📄 Request body:', { userId, hasName: !!name });

    if (!userId) {
      console.error('❌ Missing userId');
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!supabase) {
      console.error('❌ Supabase not configured');
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    // Fetch nutrition data from Supabase
    const { data: nutritionRow, error: nutritionError } = await supabase
      .from('nutrition_screening')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (nutritionError || !nutritionRow) {
      return NextResponse.json(
        { error: "Nutrition screening data not found. Please complete the nutrition screening first." },
        { status: 404 }
      );
    }

    // Fetch training plan data to calculate training load
    const { data: trainingPlanRow, error: planError } = await supabase
      .from('training_plans')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (planError || !trainingPlanRow) {
      return NextResponse.json(
        { error: "Training plan not found. Please complete the training quiz first." },
        { status: 404 }
      );
    }

    // Fetch training weeks to calculate average weekly km
    const { data: trainingWeeks, error: weeksError } = await supabase
      .from('training_weeks')
      .select('target_km')
      .eq('plan_id', trainingPlanRow.id)
      .order('week_number', { ascending: true });

    if (weeksError || !trainingWeeks || trainingWeeks.length === 0) {
      return NextResponse.json(
        { error: "Training weeks data not found." },
        { status: 404 }
      );
    }

    // Calculate training load
    const weeklyKmValues = trainingWeeks.map(w => w.target_km || 0);
    const averageWeeklyKm = weeklyKmValues.reduce((a, b) => a + b, 0) / weeklyKmValues.length;
    const peakWeeklyKm = Math.max(...weeklyKmValues);

    // Fetch training sessions to count training days per week
    const { data: trainingSessions, error: sessionsError } = await supabase
      .from('training_sessions')
      .select('week_number')
      .eq('plan_id', trainingPlanRow.id);

    // Estimate training days per week (assuming sessions are distributed across weeks)
    const uniqueWeeks = new Set(trainingSessions?.map(s => s.week_number) || []);
    const estimatedTrainingDaysPerWeek = uniqueWeeks.size > 0 
      ? Math.round((trainingSessions?.length || 0) / uniqueWeeks.size)
      : 4; // Default estimate

    const trainingLoad: TrainingLoadData = {
      averageWeeklyKm: Math.round(averageWeeklyKm),
      peakWeeklyKm: Math.round(peakWeeklyKm),
      trainingDaysPerWeek: estimatedTrainingDaysPerWeek,
    };

    // Map Supabase row to NutritionData
    const nutritionData: NutritionData = {
      biological_sex: nutritionRow.biological_sex,
      age: nutritionRow.age,
      weight_kg: nutritionRow.weight_kg,
      height_cm: nutritionRow.height_cm,
      body_fat_percent: nutritionRow.body_fat_percent,
      nutrition_goal: nutritionRow.nutrition_goal,
      dietary_preference: nutritionRow.dietary_preference,
      allergies_intolerances: nutritionRow.allergies_intolerances,
      disliked_foods: nutritionRow.disliked_foods,
      fueling_preference: nutritionRow.fueling_preference,
      training_time: nutritionRow.training_time,
      meals_per_day: nutritionRow.meals_per_day,
      tracking_habits: nutritionRow.tracking_habits,
      alcohol_consumption: nutritionRow.alcohol_consumption,
      caffeine_tolerance: nutritionRow.caffeine_tolerance,
      current_fueling_products: Array.isArray(nutritionRow.current_fueling_products)
        ? nutritionRow.current_fueling_products
        : null,
    };

    console.log('📄 Generating nutrition plan...');
    console.log('📄 Nutrition data:', {
      hasWeight: !!nutritionData.weight_kg,
      hasHeight: !!nutritionData.height_cm,
      hasAge: !!nutritionData.age,
      hasSex: !!nutritionData.biological_sex,
    });
    console.log('📄 Training load:', trainingLoad);
    
    // Generate nutrition plan
    let plan;
    try {
      plan = generateNutritionPlan(nutritionData, trainingLoad);
      console.log('✅ Nutrition plan generated:', {
        dailyCalories: plan.dailyCalories,
        protein: plan.protein,
        carbs: plan.carbs,
        fats: plan.fats,
      });
    } catch (planError: any) {
      console.error('❌ Error generating nutrition plan:', planError);
      const errorMessage = planError?.message || 'Unknown error';
      throw new Error(`Failed to generate nutrition plan: ${errorMessage}`);
    }

    console.log('📄 Creating PDF...');
    // Create PDF
    const pdfElement = React.createElement(NutritionReport, {
      name: name || undefined,
      plan,
    });

    console.log('📄 Rendering PDF stream...');
    const stream = await renderToStream(pdfElement as any);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk, 'utf-8'));
      } else {
        chunks.push(Buffer.from(chunk));
      }
    }
    const buffer = Buffer.concat(chunks);
    console.log('✅ PDF buffer created, size:', buffer.length, 'bytes');

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="nutrition-plan.pdf"',
      },
    });
  } catch (error) {
    console.error("❌ Error generating nutrition PDF:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error message:", error.message);
    }
    return NextResponse.json(
      { 
        error: "Failed to generate PDF", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

