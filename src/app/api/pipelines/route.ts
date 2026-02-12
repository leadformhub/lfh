import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getPipelinesByUserId, createPipeline, createDefaultStagesForPipeline } from "@/services/pipelines.service";

export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const formId = req.nextUrl.searchParams.get("formId")?.trim() || undefined;
  const pipelines = await getPipelinesByUserId(session.userId, formId ?? null);
  return NextResponse.json({ pipelines });
}

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  let body: { formId?: string | null; name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const pipeline = await createPipeline(session.userId, {
    formId: body.formId ?? null,
    name: body.name,
  });
  const stages = await createDefaultStagesForPipeline(pipeline.id);
  return NextResponse.json({
    pipeline: { ...pipeline, stages },
  });
}
