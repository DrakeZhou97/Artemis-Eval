import type { Metadata } from "next";
import { getUsers } from "@/lib/users";

export const metadata: Metadata = {
	title: "Users",
	description: "User management list",
};

export default function UsersPage() {
	const users = getUsers();

	return (
		<main className="min-h-screen bg-base-200 p-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-base-content">Users</h1>
					<p className="mt-2 text-base-content/70">Manage and view all registered users.</p>
				</div>

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<div className="overflow-x-auto">
							<table className="table">
								<thead>
									<tr>
										<th>ID</th>
										<th>Name</th>
										<th>Email</th>
										<th>Role</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.id} className="hover:bg-base-200">
											<td>{user.id}</td>
											<td>
												<a href={`/users/${user.id}`} className="link link-primary">
													{user.name}
												</a>
											</td>
											<td>{user.email}</td>
											<td>
												<span className="badge badge-outline">{user.role}</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<a href="/" className="btn btn-ghost">
						Back to Home
					</a>
				</div>
			</div>
		</main>
	);
}
