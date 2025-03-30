import { prisma } from "@/lib/prisma";
import { HTTPError } from "@/lib/types/httpError";
import { Challenge } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// Get Challenges By Id (challenge's id)
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<Challenge | HTTPError>> {
  const { id } = await params;
  try {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    return NextResponse.json(challenge, { status: StatusCodes.OK });
  } catch (_) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
