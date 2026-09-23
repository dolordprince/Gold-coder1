import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Codex+ Luxe, an expert product architect, visual director, and frontend engineer. You design premium multi-page websites and apps. Return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "summary": "string",
  "brand": { "mood": "string", "palette": [{"name":"string","hex":"#000000","usage":"string"}], "fonts": {"display":"string","body":"string"} },
  "routes": [{"path":"/","name":"string","purpose":"string","sections":["string"]}],
  "components": ["string"],
  "dataModel": [{"name":"string","fields":["string"]}],
  "visualPrompt": "a detailed Pollinations image prompt",
  "threeDEffect": {"scene":"string","objects":["string"],"motion":"string"},
  "buildPlan": ["string"],
  "qualityChecks": ["string"]
}
Create a coherent luxury visual system with accessible contrast, responsive behavior, elegant typography, and a real multi-page information architecture. Never include markdown fences or commentary.`;

function cleanJson(value: string) {
  const fenced = value.match(/```(?:json)?\\s*([\\s\\S]*?)\\s*```/i);
  const candidate = fenced?.[1] || value;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('Pollinations did not return JSON.');
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const history = Array.isArray(body.history) ? body.history.slice(-4) : [];
    if (!prompt) return NextResponse.json({ error: 'A product brief is required.' }, { status: 400 });

    const context = history.map((item: { role?: string; content?: string }) => `${item.role}: ${item.content}`).join('\\n');
    const requestText = `${SYSTEM_PROMPT}\\n\\nPrevious brief context:\\n${context || 'None'}\\n\\nNew product brief:\\n${prompt}`;
    const endpoint = `https://text.pollinations.ai/${encodeURIComponent(requestText)}?model=openai&json=true`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ error: `Pollinations returned ${response.status}.` }, { status: 502 });

    const raw = await response.text();
    let blueprint;
    try { blueprint = cleanJson(raw); } catch { return NextResponse.json({ error: 'Pollinations returned an invalid JSON blueprint.' }, { status: 502 }); }
    return NextResponse.json({ blueprint, provider: 'pollinations-free' });
  } catch {
    return NextResponse.json({ error: 'Unable to reach the Pollinations Codex brain.' }, { status: 502 });
  }
}
