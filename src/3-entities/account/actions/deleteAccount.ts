"use server";
import { deleteAccountAdmin } from "@/3-entities/account/api/deleteAccountAdmin";

export async function deleteAccountAction(userId: string) {
  // Optionally, add authentication/authorization checks here
  const result = await deleteAccountAdmin(userId);
  return result;
}
