import { redirect } from "next/navigation";
import getAuthenticatedUser from "@/helpers/cookieVerify";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    let user;

    try {
        user = await getAuthenticatedUser();
    } catch (error) {
        redirect("/login");
    }

    return <DashboardClient user={user} />;
}