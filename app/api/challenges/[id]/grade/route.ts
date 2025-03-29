import { prisma } from "@/lib/prisma";
import { Block, Literal } from "@/lib/types/block";
import { HTTPError } from "@/lib/types/httpError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<{ result: number } | HTTPError>> {
  let challengeId;
  try {
    challengeId = parseInt((await params).id);
  } catch (_) {
    return NextResponse.json({ error: "invalid challenge id" });
  }

  const body = await request.text();
  let block;
  try {
    block = Block.parse(body);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: StatusCodes.BAD_REQUEST },
      );
    }
    return NextResponse.json(
      { error: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }

  const testcases = await prisma.testcase.findMany({
    where: { challengeId: challengeId },
  });
  if (!testcases || testcases.length <= 0) {
    return NextResponse.json(
      { error: "testcase not found" },
      { status: StatusCodes.NOT_FOUND },
    );
  }

  let passCount = 0;
  let totalCount = testcases.length;
  for (const testcase of testcases) {
    const result = Block.evaluate(block, testcase);
    const output = JSON.parse(testcase.output);
    if (!result) {
      if (!output) passCount++;
    } else if (Array.isArray(result)) {
      // TODO: check if this is correct
      if (testcase.output == JSON.stringify(result)) passCount++;
    } else {
      if ((result as Literal).value == output) passCount++;
    }
  }

  return NextResponse.json(
    { result: passCount / totalCount },
    { status: StatusCodes.OK },
  );
}
