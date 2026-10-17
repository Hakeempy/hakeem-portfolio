import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link href="/" className="underline">
        Back home
      </Link>
    </main>
  );
}
