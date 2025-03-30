import Image from "next/image";
import Link from "next/link";

export default function Tutorial() {
  return (
    <div>
      <header className="relative flex flex-col items-center justify-center">
        <h1 className="mt-4 rounded-lg bg-black p-4 text-5xl text-white drop-shadow-2xl backdrop-blur-sm">
          Tutorial
        </h1>
        <Link
          href="/"
          className="absolute top-4 right-4 rounded-md bg-black px-6 py-2 text-lg font-medium text-white shadow-lg drop-shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </header>
      <div className="mt-8 rounded-md bg-white px-4 shadow-2xl">
        <section className="p-6">
          <h2 className="flex items-center text-3xl text-gray-600">
            <span className="mr-2">🎮</span> How This Game Works
          </h2>
          <ul className="mt-4 list-disc pl-6 text-lg text-gray-500">
            <li>
              You&apos;ll be given a programming problem classified by
              difficulty.
            </li>
            <li>
              There&apos;s a block consisting of programming commands that can
              be drag and drop, used to combine and produce the result.
            </li>
            <li>Your goal is to solve the problems using these blocks.</li>
            <li>
              Submit and see how you perform. <b>Good luck!</b>
            </li>
          </ul>
        </section>
      </div>
      <div className="mt-8 rounded-md bg-white px-4 shadow-2xl">
        <section className="p-6">
          <h2 className="flex items-center text-3xl text-gray-600">
            <span className="mr-2">🧩</span> Game Page
          </h2>
          <div className="mt-6 flex justify-center">
            <Image
              width={1920}
              height={1080}
              src="/GamePage(beta).png" // Change this to game page screenshot
              alt="Game Page"
              className="h-full w-full rounded shadow-lg"
            />
          </div>
          <ul className="mt-4 list-disc pl-6 text-lg text-gray-500">
            <li>
              <b>The Top rigt panel</b>, displays the problem description and
              requirements <i>(e.g. find the median of three inputs)</i>.
            </li>
            <li>
              <b>The left panel</b>, there is a block library to drag-and-drop
              into the center panel.
            </li>
            <li>
              <b>The center area</b> contains the workspace where you can drag
              and drop blocks to create your solution.
            </li>
            <li>
              <b>The right panel</b>, there is a run button that can be clicked
              to evaluate the challenge <i>(using testcases)</i> and show
              results..
            </li>
            <li>
              <b>The bottom right</b>, there is a submit button to submit your
              solution.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
