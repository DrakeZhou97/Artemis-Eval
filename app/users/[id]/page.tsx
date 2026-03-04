import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/users";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { id } = await params;
	const user = getUserById(Number(id));

	return {
		title: user ? user.name : "User Not Found",
		description: user ? `Profile of ${user.name}` : "The requested user does not exist",
	};
}

export default async function UserDetailPage({ params }: Params) {
	const { id } = await params;
	const user = getUserById(Number(id));

	if (!user) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-base-200 p-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-base-content">{user.name}</h1>
					<p className="mt-2 text-base-content/70">User profile details</p>
				</div>

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<div className="space-y-4">
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">ID</span>
								<span>{user.id}</span>
							</div>
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">Name</span>
								<span>{user.name}</span>
							</div>
							<div className="flex items-center justify-between border-b border-base-300 pb-2">
								<span className="font-medium text-base-content/70">Email</span>
								<span>{user.email}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-medium text-base-content/70">Role</span>
								<span className="badge badge-primary">{user.role}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-center gap-4">
					<a href="/users" className="btn btn-ghost">
						Back to Users
					</a>
					<a href="/" className="btn btn-ghost">
						Back to Home
					</a>
				</div>
			</div>
		</main>
	);
}
