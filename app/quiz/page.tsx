import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = {
  title: "Which AI Tool Is Right For You?",
  description: "Answer two quick questions to get personalized AI tool recommendations.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Which AI Tool Is Right For You?</h1>
      <p className="mb-10 text-black/60 dark:text-white/60">Two quick questions, then a personalized shortlist — no signup required.</p>
      <Quiz />
    </div>
  );
}
