import { client } from "@/lib/contentful";
import { Navbar } from "@/components/shared/navbar";

export async function NavbarServer() {
  let services: { name: string; href: string }[] = [];

  try {
    const response = await client.getEntries({ content_type: "services" });
    services = response.items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = item.fields as any;
      const slug = fields.url || item.sys.id;
      return {
        name: fields.title as string,
        href: `/services/${slug}`,
      };
    });
  } catch (e) {
    console.error("Contentful fetch error:", e);
  }

  return <Navbar services={services} />;
}
