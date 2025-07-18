import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://tetapux.pages.dev",
    "https://tetapux.tiagorangel.com",
    "https://tetapux.glitch.me",
  ];

  const origin = req.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers });
  }

  const { title, alt, link, logo, turnstile_token } = await req.json();

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");

  const cfOutcome = await (
    await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: JSON.stringify({
        secret: Deno.env.get("TURNSTILE_SECRET"),
        response: turnstile_token,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  if (!cfOutcome.success) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: `Invalid turnstile key. ${JSON.stringify(cfOutcome)}`,
      }),
      { headers }
    );
  }

  const created_by = (await supabaseClient.auth.getUser(token)).data.user?.id;

  if (!title || !alt || !link || !logo || !created_by) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing required fields" }),
      { headers }
    );
  }

  if (
    title.length > 100 ||
    alt.length > 100 ||
    link.length > 1000 ||
    logo.length > 1000
  ) {
    return new Response(
      JSON.stringify({ ok: false, error: "Fields too long" }),
      { headers }
    );
  }

  try {
    new URL(link);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid URL" }), {
      headers,
    });
  }

  try {
    new URL(logo);
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid logo URL" }),
      { headers }
    );
  }

  if (!link.startsWith("https://") && !link.startsWith("http://")) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "URL must start with http:// or https://",
      }),
      { headers }
    );
  }

  if (!logo.startsWith("https://") && !logo.startsWith("http://")) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Logo URL must start with http:// or https://",
      }),
      { headers }
    );
  }

  const { error } = await supabaseClient
    .from("ads")
    .insert({ title, alt, link, logo, created_by, published: false });
  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      headers,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { headers });
});
