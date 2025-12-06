import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Report } from "@/src/pdf/Report";
import { calculateScores } from "@/src/lib/scoring";
import { buildProfile } from "@/src/lib/buildProfile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Answers array is required" },
        { status: 400 }
      );
    }

    // Calculate scores from answers
    const scores = calculateScores(answers);
    
    // Build profile with feedback content
    const profile = buildProfile(scores);

    const pdfElement = React.createElement(Report, {
      name: name || "Guest",
      profile,
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
        "Content-Disposition": 'attachment; filename="lifephoria-report.pdf"',
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

