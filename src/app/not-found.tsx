import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="text-slate-600 mb-4">The page you are looking for does not exist.</p>
      <Link 
        href="/login" 
        className="text-blue-600 hover:underline"
      >
        Return to Login
      </Link>
    </div>
  );
}