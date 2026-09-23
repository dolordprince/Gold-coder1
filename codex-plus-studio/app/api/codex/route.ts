import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Codex+, a senior product architect and coding agent. Return actionable markdown with these sections: Intent, Blueprint, Build Plan, Pollinations Visual Prompt, and Validation. Be precise, production-minded, accessible, and security-conscious. Never claim deployment has happened.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    if (!prompt) return NextResponse.json({ error: 'A prompt is required.' }, { status: 400 });

    const context = history
      .filter((item: unknown) => item && typeof item === 'object' && 'role' in item && 'content' in item)
      .map((item: { role: string; content: string }) => `${item.role}: ${item.content}`)
      .join('\n\n');
    const requestText = `${SYSTEM_PROMPT}\n\nPrevious context:\n${context || 'None'}\n\nUser request:\n${prompt}`;
    const endpoint = `https://text.pollinations.ai/${encodeURIComponent(requestText)}?model=openai&json=false`;
    const response = await fetch(endpoint, { headers: { Accept: 'text/plain' }, cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ error: `Pollinations returned ${response.status}.` }, { status: 502 });

    const content = await response.text();
    if (!content.trim()) return NextResponse.json({ error: 'Pollinations returned an empty response.' }, { status: 502 });
    return NextResponse.json({ content, provider: 'pollinations-free' });
  } catch {
    return NextResponse.json({ error: 'Unable to reach the Pollinations Codex brain.' }, { status: 502 });
  }
}
