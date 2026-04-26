import { client, fetchAllLocations } from "@/lib/contentful";
import { Navbar } from "@/components/shared/navbar";

export async function NavbarServer() {
  let services: { name: string; href: string }[] = [];
  let locations: { name: string; href: string }[] = [];

  try {
    const [servicesRes, locs] = await Promise.all([
      client.getEntries({
        content_type: "services",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        select: ["fields.title", "fields.url"] as any,
        order: ["fields.title"],
      }),
      fetchAllLocations(),
    ]);

    services = servicesRes.items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = item.fields as any;
      const slug = fields.url || item.sys.id;
      return { name: fields.title as string, href: `/services/${slug}` };
    });

    locations = locs.map((loc) => ({
      name: loc.fields.fullLocationName || loc.fields.cityName,
      href: `/service-areas/${loc.fields.slug}`,
    }));
  } catch (e) {
    console.error("Contentful navbar fetch error:", e);
  }

  return <Navbar services={services} locations={locations} />;
}
