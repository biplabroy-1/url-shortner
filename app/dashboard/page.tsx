import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboardShell";
import { getDashboardData } from "../action/actions";

export default async function DashboardPage() {
	const user = await currentUser();

	if (!user?.id) {
		return;
	}
	const data = await getDashboardData(user.id);
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DashboardShell data={data} />
		</Suspense>
	);
}
