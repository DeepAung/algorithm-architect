"use client";

import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch(`/api/auth/signout`, {
        method: "POST",
      });
      if (!response.ok) {
        alert("error not ok");
      } else {
        router.push("/sign-in");
      }
    } catch (error) {
      alert("error: " + error);
    }
  };

  return (
    <button onClick={() => handleSignOut()} className="btn btn-ghost">
      Sign Out
    </button>
  );
}
