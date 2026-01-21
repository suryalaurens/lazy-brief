export default async function Home() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/daily`, {
    cache: "no-store"
  });

  const data = await res.json();

  return (
    <main className="wallpaper">
      {data.summary}
    </main>
  );
}
