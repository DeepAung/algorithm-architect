import { Challenge } from "@prisma/client";

export type ChallengeDetail = Challenge & { difficultyString: string };
