import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { PsychologicalProfile } from "@/src/pdf/PsychologicalProfile";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for server-side operations
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(req: NextRequest) {
  try {
    console.log('🧠 Psychological Profile PDF generation started');
    
    const body = await req.json();
    const { userId, name } = body;

    if (!userId) {
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

    // Fetch psychological profile data
    const { data: profileData, error: profileError } = await supabase
      .from('psychological_profile')
      .select('main_section, personalized_intro, strength')
      .eq('user_id', userId)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching psychological profile:', profileError);
      return NextResponse.json(
        { error: "Failed to fetch psychological profile data" },
        { status: 404 }
      );
    }

    console.log('📄 Rendering PDF stream...');
    
    // Create PDF
    const pdfElement = React.createElement(PsychologicalProfile, {
      name: name,
      personalizedIntro: profileData.personalized_intro || '',
      mainSection: profileData.main_section || 'performance_anxiety',
      strength: profileData.strength || 'determination',
    });

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
        "Content-Disposition": 'attachment; filename="psychological-performance-profile.pdf"',
      },
    });
  } catch (error) {
    console.error("❌ Error generating psychological profile PDF:", error);
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

