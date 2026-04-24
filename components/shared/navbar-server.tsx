import { client } from "@/lib/contentful";
import { fetchAllLocations } from "@/lib/contentful";
import { Navbar } from "@/components/shared/navbar";

export async function NavbarServer() {
  let services: { name: string; href: string }[] = [];
  let locations: { name: string; href: string }[] = [];

  try {
    const response = await client.getEntries({ content_type: "services" });
    services = response.items
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = item.fields as any;
        const slug = fields.url || item.sys.id;
        return {
          name: fields.title as string,
          href: `/services/${slug}`,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error("Contentful services fetch error:", e);
  }

  try {
    const locs = await fetchAllLocations();
    locations = locs.map((loc) => ({
      name: loc.fields.fullLocationName || loc.fields.cityName,
      href: `/service-areas/${loc.fields.slug}`,
    }));
  } catch (e) {
    console.error("Contentful locations fetch error:", e);
  }

  return <Navbar services={services} locations={locations} />;
}
