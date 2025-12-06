import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { RunMvmtReport } from "@/src/pdf/RunMvmtReport";
import { classifyPersona } from "@/src/lib/runmvmtPersonas";
import { generateTrainingPlan } from "@/src/lib/runmvmtPlanGenerator";
import { buildPdfContent } from "@/src/lib/runmvmtPdfContent";
import type { QuizAnswers } from "@/src/lib/runmvmtTypes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: "Answers object is required" },
        { status: 400 }
      );
    }

    // Classify persona
    const persona = classifyPersona(answers as QuizAnswers);

    // Generate training plan
    const plan = generateTrainingPlan(answers as QuizAnswers, persona);

    // Build PDF content
    const pdfData = buildPdfContent(plan, answers as QuizAnswers, persona);

    const pdfElement = React.createElement(RunMvmtReport, {
      name: name || "Runner",
      data: pdfData,
    });

    const stream = await renderToStream(pdfElement as any);

    // Convert stream to buffer for Next.js App Router
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk, 'utf-8'));
      } else {
        chunks.push(Buffer.from(chunk));
      }
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="runmvmt-training-plan.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

