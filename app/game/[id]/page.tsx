import GameComponent from "@/app/game/[id]/components/game";
import { Challenge } from "@/lib/types/challenge";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge: Challenge = {
    id: 1,
    title: "Min Number",
    difficulty: "Easy",
    description: "Find the minimum number in a list",
    exampleInput: "[1, 2, 3]",
    exampleOutput: "1",
  };

  return <GameComponent challenge={challenge} />;
}
