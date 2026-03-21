"use client";

import Link from "next/link";
import { UserButton, SignInButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-300/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group transition">
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-500 to-blue-500 shadow-md flex items-center justify-center text-white font-bold">
            <Image src="/logo.png" height={40} width={40} alt="logo" />
          </div>

          <span className="font-semibold text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition">
            Speech Flow
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/transcribe">
              <Button
                size="lg"
                className="p-5 text-md bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-sm"
              >
                Sign In
              </Button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  );
}
