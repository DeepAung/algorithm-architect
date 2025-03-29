import { prisma } from "@/lib/prisma";
import { HTTPError } from "@/lib/types/httpError";
import { Testcase } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// Get testcases By challengeId
export async function GET(
  _: Request,
  { params }: { params: Promise<{ challengeId: string }> }
): Promise<NextResponse<Testcase[] | HTTPError>> {
  const { challengeId } = await params;
  try {
    const testcases = await prisma.testcase.findMany({
      where: {
        challengeId: parseInt(challengeId)
      }
    });
    if (testcases && testcases.length > 0) {
      return NextResponse.json(testcases, { status: StatusCodes.OK });
    }
    return NextResponse.json(
      { error: "No challenges found in the database." },
      { status: StatusCodes.NOT_FOUND }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
