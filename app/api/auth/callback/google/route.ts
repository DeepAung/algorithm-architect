import { setJwtToken } from "@/lib/cookie";
import { generateToken } from "@/lib/jwt";
import { handleCallback } from "@/lib/oauth";
import { prisma } from "@/lib/prisma";
import { HTTPError } from "@/lib/types/httpError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
): Promise<never | NextResponse<HTTPError>> {
  const cookieStore = await cookies();

  let email: string;
  let name: string;
  let redirectUrl: string;
  try {
    const result = await handleCallback(request.url);
    email = result.email;
    name = result.name;
    redirectUrl = result.redirectUrl;
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

  let result = await prisma.user.findFirst({
    where: { email: email },
    select: { id: true, name: true },
  });
  if (!result) {
    // create user. default to visitor
    try {
      result = await prisma.user.create({
        data: {
          email: email,
          name: name,
        },
        select: { id: true, name: true },
      });
    } catch (_) {
      return NextResponse.json(
        { error: ReasonPhrases.INTERNAL_SERVER_ERROR },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      );
    }
  }

  const { accessToken, refreshToken } = generateToken({
    email: email,
    name: result.name!,
  });

  let tokenId;
  try {
    const { id } = await prisma.token.create({
      data: {
        userId: result.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      select: { id: true },
    });
    tokenId = id;
  } catch (_) {
    return NextResponse.json(
      { error: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }

  setJwtToken(cookieStore, accessToken, refreshToken, tokenId);

  // redirect back to appropriate url. default to "/"
  return redirect(redirectUrl || "/");
}
