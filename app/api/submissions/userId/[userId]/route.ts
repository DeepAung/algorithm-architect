import { prisma } from "@/lib/prisma";
import { HTTPError } from "@/lib/types/httpError";
import { Submission } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// Get submissions By userId
export async function GET(
  _: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse<Submission[] | HTTPError>> {
  const { userId } = await params;
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        userId: parseInt(userId)
      }
    });
    if (submissions && submissions.length > 0) {
      return NextResponse.json(submissions, { status: StatusCodes.OK });
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
