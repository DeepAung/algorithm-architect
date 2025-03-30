import GameComponent from "@/app/game/[id]/components/game";
import { APP_URL } from "@/lib/config";
import { ChallengeDetail } from "@/lib/types/challenge";
import { difficultyToString } from "@/lib/types/difficulty";
import { redirect } from "next/navigation";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let challenge: ChallengeDetail;
  try {
    const response = await fetch(`${APP_URL}/api/challenges/${id}`);
    if (!response.ok) {
      alert("error");
      redirect("/");
    } else {
      const data = await response.json();
      challenge = data;
    }
  } catch (_) {
    alert("error");
    redirect("/");
  }

  challenge.difficultyString = difficultyToString(challenge.difficulty);

  return <GameComponent challenge={challenge} />;
}
