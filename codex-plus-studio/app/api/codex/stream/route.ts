import { NextResponse } from 'next/server';

const SYSTEM = `You are DOLOR3V Codex, an expert autonomous frontend engineer. Return production-ready code for the requested change. Start with a concise file path line in the form FILE: path, then output complete file contents in fenced code blocks. Prefer Next.js App Router, TypeScript, Tailwind, accessibility, responsive behavior, and secure server boundaries. Do not claim deployment has happened.`;

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) return NextResponse.json({ error: 'A coding prompt is required.' }, { status: 400 });

  const upstream = await fetch(`https://text.pollinations.ai/${encodeURIComponent(`${SYSTEM}\n\n${prompt}`)}?model=openai&json=false`, { cache: 'no-store' });
  if (!upstream.ok || !upstream.body) return NextResponse.json({ error: `Pollinations returned ${upstream.status}.` }, { status: 502 });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', text })}\n\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Stream failed' })}\n\n`));
        controller.close();
      }
    }
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' } });
}
