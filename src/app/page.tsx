import { SignInButton } from "@/src/components/sign-in-button";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl"><b>Home</b></p>
        <SignInButton className="mt-2 flex items-center px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:outline-none">
          Join Us
        </SignInButton>
      </div>
    </main>
  );
}
