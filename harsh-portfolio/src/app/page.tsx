import Site from "@/components/Site";
import { getContent } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const c = await getContent();
  return { title: c.settings.seoTitle, description: c.settings.seoDescription };
}
export default async function Page() { return <Site c={await getContent()} />; }
