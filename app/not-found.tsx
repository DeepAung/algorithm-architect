import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-8xl font-extrabold text-gray-900 drop-shadow-lg">
        404
      </h1>
      <p className="mt-4 text-2xl text-gray-700">
        Oops! The page you&apos;re looking for doesn&apos;t exist. 😢
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-lg drop-shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-800"
      >
        Go to Home Page
      </Link>
    </div>
  );
}
