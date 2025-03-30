export enum Difficulty {
  VERY_EASY = "very easy",
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  VERY_HARD = "very hard",
}

export function difficultyToString(difficulty: number): Difficulty {
  if (difficulty < 0) {
    return Difficulty.VERY_EASY;
  } else if (difficulty == 1) {
    return Difficulty.EASY;
  } else if (difficulty == 2) {
    return Difficulty.MEDIUM;
  } else if (difficulty == 3) {
    return Difficulty.HARD;
  } else {
    return Difficulty.VERY_HARD;
  }
}
