import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <p>page not found</p>
      <Link href="/">go to home page</Link>
    </div>
  );
}
