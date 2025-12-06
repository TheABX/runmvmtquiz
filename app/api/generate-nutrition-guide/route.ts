import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { NutritionGuide } from "@/src/pdf/NutritionGuide";

export async function POST(req: NextRequest) {
  try {
    console.log('📄 Nutrition Guide PDF generation started');
    
    // Create PDF
    const pdfElement = React.createElement(NutritionGuide);

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
        "Content-Disposition": 'attachment; filename="nutrition-guide.pdf"',
      },
    });
  } catch (error) {
    console.error("❌ Error generating nutrition guide PDF:", error);
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


