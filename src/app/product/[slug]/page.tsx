import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import ProductDetailsClient from "./ProductDetailsClient";


export default async function ProductDetailsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return <ProductDetailsClient />;
}