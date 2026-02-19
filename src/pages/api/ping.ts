import type { APIContext } from 'astro';

export const prerender = false;

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ pong: true, time: Date.now() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(context: APIContext): Promise<Response> {
  const body = await context.request.json().catch(() => ({}));
  return new Response(JSON.stringify({ echo: body, method: 'POST' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
