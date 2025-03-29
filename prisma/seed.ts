import { Challenge, PrismaClient, Submission, Testcase, User } from "@prisma/client";
import * as dotenv from "dotenv";

const prisma = new PrismaClient();

dotenv.config({ path: ".env" });
const users: User[] = [
  {
    id: 1,
    name: "user1",
    email: "user1@gmail.com",
  },
  {
    id: 2,
    name: "user2",
    email: "user2@gmail.com",
  }
];

const challenges: Challenge[] = [
  {
    id: 1,
    name: "challenges 1",
    description: "description 1",
    difficulty: 1
  },
  {
    id: 2,
    name: "challenges 2",
    description: "description 2",
    difficulty: 2
  },
]

const testcases: Testcase[] = [
  {
    id: 1,
    challengeId: 1,
    input: "1-???",
    output: "1-???",
  },
  {
    id: 2,
    challengeId: 2,
    input: "2-???",
    output: "2-???",
  }
]

const submissions: Submission[] = [
  {
    id: 1,
    userId: 1,
    blockNumber: 1,
    challengeId: 1,
    score: 100
  },
  {
    id: 2,
    userId: 2,
    blockNumber: 2,
    challengeId: 2,
    score: 200
  }
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
    data: users
  })
  // create mock challenges
  await prisma.challenge.deleteMany();
  await prisma.challenge.createMany({
    data: challenges
  })
  // create mock testcases
  await prisma.testcase.deleteMany();
  await prisma.testcase.createMany({
    data: testcases
  })
  // create mock
  await prisma.submission.deleteMany();
  await prisma.submission.createMany({
    data: submissions
  })
}
