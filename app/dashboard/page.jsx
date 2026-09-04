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

    const plainUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
    };

    return <DashboardClient user={plainUser} />;
}