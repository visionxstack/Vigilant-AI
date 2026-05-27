import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { SYSTEM_PROMPT, buildUserPrompt, detectInputType, type AnalysisType } from "@/lib/prompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, type } = body as { input: string; type?: AnalysisType };

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Input is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const analysisType: AnalysisType = type || detectInputType(input);
    const userPrompt = buildUserPrompt(analysisType, input.trim());

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";

    // Parse the JSON response from the AI
    let parsed: Record<string, unknown>;
    try {
      // Extract JSON from the response (handles cases where AI adds extra text)
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "AI returned malformed response. Please try again.", raw: rawContent },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      type: analysisType,
      input: input.trim(),
      analysis: parsed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[/api/analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
