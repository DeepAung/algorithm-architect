import { prisma } from "@/lib/prisma";
import { HTTPError } from "@/lib/types/httpError";
import { Challenge } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

// Get Challenges By Id
export async function GET(): Promise<NextResponse<Challenge[] | HTTPError>> {
  const challenges = await prisma.challenge.findMany();
  if (challenges && challenges.length > 0) {
    return NextResponse.json(challenges, { status: StatusCodes.OK });
  } else {
    return NextResponse.json(
      { error: "No challenges found in the database." },
      { status: StatusCodes.NOT_FOUND },
    );
  }
}
