import { deleteJwtToken } from "@/lib/cookie";
import { onlyAuthorized } from "@/lib/middleware";
import { prisma, returnPrismaError } from "@/lib/prisma";
import { HTTPError } from "@/lib/types/httpError";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse<object | HTTPError>> {
  const cookieStore = await cookies();

  const middlewareRes = await onlyAuthorized(cookieStore);
  if (!middlewareRes.pass) {
    return middlewareRes.response!;
  }

  const { accessToken, tokenId } = middlewareRes.data!;

  try {
    await prisma.token.delete({
      where: { id: tokenId, accessToken: accessToken },
    });
  } catch (error) {
    return returnPrismaError(error, [
      {
        code: "P2025",
        msg: "token not found",
        status: StatusCodes.NOT_FOUND,
      },
    ]);
  }

  deleteJwtToken(cookieStore);

  return NextResponse.json({}, { status: StatusCodes.OK });
}
