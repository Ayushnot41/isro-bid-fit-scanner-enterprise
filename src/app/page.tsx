import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const cookieStore = cookies();
    const isDemo = cookieStore.get("demo_session")?.value === "true";
    if (isDemo) {
      redirect("/dashboard");
    }

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      redirect("/dashboard");
    }
  } catch {
    // If not authenticated or error, redirect to login
  }

  redirect("/login");
}
