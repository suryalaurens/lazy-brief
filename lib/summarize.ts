import OpenAI from "openai";
import Parser from "rss-parser";
import { GLOBAL_FEEDS, INDONESIA_FEEDS } from "./feeds";

const parser = new Parser();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are a calm, neutral news editor.

Summarize news for busy people who avoid politics.
No jargon. No fear language. No bias.

FORMAT EXACTLY AS:

<Day, Date>

🌍 WORLD
• headline → why it matters
• headline → why it matters

🇮🇩 INDONESIA
• headline → why it matters
• headline → why it matters

💡 WHY THIS MATTERS
Two short calm sentences.

RULES:
- Max 3 bullets per section
- Avoid politician names unless unavoidable
- Focus on money, daily life, travel, prices, stability
- Calm, factual, non-alarmist tone
- Must fit on a phone wallpaper
`;

async function fetchFeeds(urls: string[]) {
  const items: string[] = [];

  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      feed.items.slice(0, 3).forEach(item => {
        if (item.title) items.push(item.title);
      });
    } catch {
      // ignore feed errors
    }
  }

  return items.join("\n");
}

export async function getDailySummary() {
  const globalNews = await fetchFeeds(GLOBAL_FEEDS);
  const indonesiaNews = await fetchFeeds(INDONESIA_FEEDS);

  const userPrompt = `
GLOBAL NEWS:
${globalNews}

INDONESIA NEWS:
${indonesiaNews}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.4
  });

  return completion.choices[0].message.content;
}
