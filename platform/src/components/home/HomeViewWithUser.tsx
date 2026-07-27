"use client";

import { useUser } from "@clerk/nextjs";
import { HomeView } from "./HomeView";

/* Supplies the signed-in first name to the greeting. Only mounted when Clerk
 * is configured (the route checks), so useUser always has a provider above it.
 * Signed out, or before Clerk loads, the greeting simply carries no name. */
export function HomeViewWithUser() {
  const { user } = useUser();
  return <HomeView name={user?.firstName ?? undefined} />;
}
