"use client";

// import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaQuestion } from "react-icons/fa";

export default function Home() {
  // const { data: session } = useSession();
  const router = useRouter();
  const user = {
    name: "John Doe",
    image: undefined,
  };

  // if (!session) {
  //   router.push("/signin");
  //   return null;
  // }

  const challenges = [
    { id: 1, title: "Find the Median", difficulty: "Easy" },
    { id: 2, title: "Count Even Numbers", difficulty: "Easy" },
    { id: 3, title: "Sort Names", difficulty: "Medium" },
    { id: 4, title: "Find Prime Numbers", difficulty: "Medium" },
    { id: 5, title: "Calculate Factorial", difficulty: "Hard" },
    { id: 6, title: "Reverse a String", difficulty: "Hard" },
  ];

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
                src={user.image || "/default-avatar.png"}
                alt="User Avatar"
                className="h-6 w-6 rounded-full"
              />
              <p className="text-sm font-semibold">{user.name}</p>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 shadow-sm"
            >
              <Link className="btn btn-ghost" href="/api/auth/signout">
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-3">
        {challenges.map((challenge) => (
          <Link key={challenge.id} href={`/game/${challenge.id}`}>
            <div className="card flex cursor-pointer flex-col items-center bg-white p-6 text-center shadow-md hover:shadow-lg">
              <h2 className="mt-2 text-lg font-semibold">{challenge.title}</h2>
              <p className="text-5xl font-bold text-gray-700">
                {String(challenge.id).padStart(2, "0")}
              </p>
              <span
                className={`mt-2 rounded-full px-3 py-1 text-sm font-bold ${
                  challenge.difficulty === "Easy"
                    ? "bg-green-200 text-green-800"
                    : challenge.difficulty === "Medium"
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
