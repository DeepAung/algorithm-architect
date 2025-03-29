"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  return (
    <div className="bg-base-200 flex h-screen items-center justify-center">
      <div className="card w-96 bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign In</h2>
        <Link
          href="/api/auth/signin/google"
          className="btn flex w-full items-center justify-center space-x-2 border border-gray-300 bg-white text-black hover:bg-gray-100"
        >
          <FcGoogle size={20} /> <span>Sign in with Google</span>
        </Link>
      </div>
    </div>
  );
}
