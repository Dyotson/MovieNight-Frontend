"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Movie-Night
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Plan the perfect movie night with friends! Propose movies, vote for
          your favorites, and let everyone contribute to deciding what to watch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/create">
            <Button size="lg" className="w-full sm:w-auto">
              Create a Movie Night
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/join">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Join a Movie Night
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
