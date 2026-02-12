import { redirect } from "next/navigation";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <BuilderClient />;
}
