import { type NextRequest, NextResponse } from "next/server";
import { type Environment, getEnvConfig } from "@/lib/env";

const COOKIE_KEY = "artemis-env";

function resolveBackendUrl(req: NextRequest): string {
	const envCookie = req.cookies.get(COOKIE_KEY)?.value;
	const env: Environment = envCookie === "prod" ? "prod" : "dev";
	return getEnvConfig(env).backendUrl;
}

async function handler(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }): Promise<NextResponse> {
	const { path } = await params;
	const backendBase = resolveBackendUrl(req);

	// Build target URL: /api/prompts/foo/bar → <backend>/prompts/foo/bar
	const suffix = path?.length ? `/${path.join("/")}` : "";
	const targetUrl = `${backendBase}/prompts${suffix}`;

	// Forward query string if present.
	const qs = req.nextUrl.search;
	const fullUrl = qs ? `${targetUrl}${qs}` : targetUrl;

	// Forward headers (strip host so the backend sees its own host).
	const headers = new Headers(req.headers);
	headers.delete("host");

	const init: RequestInit = {
		method: req.method,
		headers,
	};

	// Forward body for non-GET/HEAD requests.
	if (req.method !== "GET" && req.method !== "HEAD") {
		init.body = await req.text();
	}

	const upstream = await fetch(fullUrl, init);

	// Stream the response back.
	return new NextResponse(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers: Object.fromEntries(upstream.headers.entries()),
	});
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
