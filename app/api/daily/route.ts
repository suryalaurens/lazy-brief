import { getDailySummary } from "@/lib/summarize";

export async function GET() {
  const summary = await getDailySummary();

  return new Response(JSON.stringify({ summary }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
