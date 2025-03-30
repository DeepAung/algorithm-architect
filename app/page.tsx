import { APP_URL } from "@/lib/config";
import { parseToken } from "@/lib/jwt";
import { Difficulty, difficultyToString } from "@/lib/types/difficulty";
import { cookies } from "next/headers";
// import { useSession, signOut } from "next-auth/react";
import { ChallengeDetail } from "@/lib/types/challenge";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaQuestion } from "react-icons/fa";
import SignOut from "./components/sign-out";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    redirect("/sign-in");
  }
  const { payload, error } = parseToken(accessToken.value);
  if (error) {
    alert("error");
    redirect("/sign-in");
  }

  const user = {
    name: payload.name,
    image: payload.email,
  };

  let challenges: ChallengeDetail[] = [];
  try {
    const response = await fetch(`${APP_URL}/api/challenges`);
    if (!response.ok) {
      alert("error");
    } else {
      const data = await response.json();
      challenges = data;
    }
  } catch (_) {
    alert("error");
  }

  for (let i = 0; i < challenges.length; i++) {
    challenges[i].difficultyString = difficultyToString(
      challenges[i].difficulty,
    );
  }

  return (
    <div className="bg-base-200 flex min-h-screen flex-col items-center p-6">
      <div className="mb-6 flex w-full max-w-4xl items-center justify-between">
        <h1 className="text-3xl font-bold">Algorithm Architect</h1>
        <div className="flex items-center space-x-4">
          <Link href="/tutorial">
            <FaQuestion
              size={28}
              className="text-neutral cursor-pointer hover:text-yellow-500"
            />
          </Link>

          <div className="dropdown dropdown-center">
            <div
              tabIndex={0}
              role="button"
              className="btn flex flex-row items-center justify-center gap-4 border border-gray-300 bg-white p-6 hover:bg-gray-100"
            >
              <img
                width={24}
                height={24}
                src="/default-avatar.png"
                alt="User Avatar"
                className="h-6 w-6 rounded-full"
              />
              <p className="text-sm font-semibold">{user.name}</p>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 shadow-sm"
            >
              <SignOut />
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-3">
        {challenges.map((challenge) => (
          <Link key={challenge.id} href={`/game/${challenge.id}`}>
            <div className="card flex cursor-pointer flex-col items-center bg-white p-6 text-center shadow-md hover:shadow-lg">
              <h2 className="mt-2 text-lg font-semibold">{challenge.name}</h2>
              <p className="text-5xl font-bold text-gray-700">
                {String(challenge.id).padStart(2, "0")}
              </p>
              <span
                className={`mt-2 rounded-full px-3 py-1 text-sm font-bold ${
                  challenge.difficultyString === Difficulty.VERY_EASY ||
                  challenge.difficultyString === Difficulty.EASY
                    ? "bg-green-200 text-green-800"
                    : challenge.difficultyString === Difficulty.MEDIUM
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                }`}
              >
                {challenge.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
