import { HomeClient } from "@/app/home-client";
// import { getBetterAuthSession } from "@/proxy";

export default async function HomePage() {
  // const session = await getBetterAuthSession();

  return <HomeClient />;
}
