import {
  Challenge,
  PrismaClient,
  Submission,
  Testcase,
  User,
} from "@prisma/client";
import * as dotenv from "dotenv";

const prisma = new PrismaClient();

dotenv.config({ path: ".env" });
const users: User[] = [
  // {
  //   id: 1,
  //   name: "user1",
  //   email: "user1@gmail.com",
  // },
  // {
  //   id: 2,
  //   name: "user2",
  //   email: "user2@gmail.com",
  // },
];

const challenges: Challenge[] = [
  {
    id: 1,
    name: "Min Min",
    description: "Find the minimum number.",
    difficulty: 1,
  },
  {
    id: 2,
    name: "Max Max",
    description: "Find the maximum number.",
    difficulty: 1,
  },
  {
    id: 3,
    name: "Sum Sum",
    description: "Find the sum of numbers.",
    difficulty: 1,
  },
];

const testcases: Testcase[] = [
  { id: 1, challengeId: 1, input: "[1, 2, 3]", output: "1" },
  { id: 2, challengeId: 1, input: "[4, 5, 6]", output: "4" },
  { id: 3, challengeId: 2, input: "[1, 2, 3]", output: "3" },
  { id: 4, challengeId: 2, input: "[4, 5, 6]", output: "6" },
  { id: 5, challengeId: 3, input: "[1, 2, 3]", output: "6" },
  { id: 6, challengeId: 3, input: "[4, 5, 6]", output: "15" },
];

const submissions: Submission[] = [
  // {
  //   id: 1,
  //   userId: 1,
  //   blockNumber: 1,
  //   challengeId: 1,
  //   score: 100,
  // },
  // {
  //   id: 2,
  //   userId: 2,
  //   blockNumber: 2,
  //   challengeId: 2,
  //   score: 100,
  // },
];

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function main() {
  // create mock users
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: users,
  });
  // create mock challenges
  await prisma.challenge.deleteMany();
  await prisma.challenge.createMany({
    data: challenges,
  });
  // create mock testcases
  await prisma.testcase.deleteMany();
  await prisma.testcase.createMany({
    data: testcases,
  });
  // create mock
  await prisma.submission.deleteMany();
  await prisma.submission.createMany({
    data: submissions,
  });
}
