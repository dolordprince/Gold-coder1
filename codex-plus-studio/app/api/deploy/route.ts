import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { files, projectName } = await request.json();
  const token = process.env.VERCEL_TOKEN;
  if (!token) return NextResponse.json({ error: 'VERCEL_TOKEN is not configured in Vercel.' }, { status: 503 });
  if (!Array.isArray(files) || files.length === 0) return NextResponse.json({ error: 'No project files to deploy.' }, { status: 400 });

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: projectName || 'dolor3v-project', target: 'preview', files: files.map((file: { path: string; content: string }) => ({ file: file.path, data: file.content })) })
  });
  const data = await response.json();
  if (!response.ok) return NextResponse.json({ error: data?.error?.message || 'Vercel deployment failed.' }, { status: response.status });
  return NextResponse.json({ url: data.url ? `https://${data.url}` : data.alias?.[0] || null, deploymentId: data.id, state: data.readyState || 'QUEUED' });
}
