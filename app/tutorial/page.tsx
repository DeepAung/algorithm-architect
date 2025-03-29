export default function Tutorial() {
  return (
    <div>
      <header className="flex flex-col items-center justify-center relative">
        <h1 className="mt-4 text-5xl text-gray-700 drop-shadow-lg bg-black text-white p-4 rounded-lg backdrop-blur-sm">
          Welcome to Our Game Tutorial!
        </h1>
        <a
          href="/"
          className="absolute top-4 right-4 rounded-md bg-black px-6 py-2 text-lg font-medium text-white shadow-lg drop-shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-gray-800"
        >
          Back to Home
        </a>
      </header>
      <div className="mt-8 px-4 shadow-2xl rounded-md bg-white">
        <section className="p-6">
          <h2 className="flex items-center text-3xl text-gray-600">
            <span className="mr-2">🎮</span> How This Game Works
          </h2>
          <ul className="mt-4 text-lg text-gray-500 list-disc pl-6">
            <li>You'll be given a programming problem classified by difficulty.</li>
            <li>
              There's a block consisting of programming commands that can be
              drag and drop, used to combine and produce the result.
            </li>
            <li>Your goal is to solve the problems using these blocks.</li>
            <li>Submit and see how you perform. Good luck!</li>
          </ul>
        </section>
      </div>
      <div className="mt-8 px-4 shadow-2xl rounded-md bg-white">
        <section className="p-6">
          <h2 className="flex items-center text-3xl text-gray-600">
            <span className="mr-2">🖼️</span> Game Page
          </h2>
          <div className="mt-6 flex justify-center">
            <img
              src="/default-avatar.png" // Change this to game page screenshot
              alt="Game Page"
              className="rounded shadow-lg"
            />
          </div>
          <ul className="mt-4 text-lg text-gray-500 list-disc pl-6">
            <li>
              The Top panel displays the problem description and requirements
              (e.g. find the median of three inputs).
            </li>
            <li>
              The left panel, there is a block library to drag-and-drop into the
              center panel.
            </li>
            <li>
              The center area contains the workspace where you can drag and
              drop blocks to create your solution.
            </li>
            <li>
              The right panel, there is a run button on the top that can be
              clicked to evaluate the challenge (using testcases) and show
              results..
            </li>
            <li>
              The bottom right, there is a submit button to submit your
              solution.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
