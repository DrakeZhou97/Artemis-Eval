import { type NextRequest, NextResponse } from "next/server";
import { createUser, getUsers } from "@/lib/users";

export function GET() {
	return NextResponse.json(getUsers());
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { name, email, role } = body;

	if (!name || !email || !role) {
		return NextResponse.json({ error: "Missing required fields: name, email, role" }, { status: 400 });
	}

	const user = createUser({ name, email, role });
	return NextResponse.json(user, { status: 201 });
}
