import { client, fetchAllLocations } from "@/lib/contentful";
import { slugify } from "@/lib/utils";
import { Navbar } from "@/components/shared/navbar";

export async function NavbarServer() {
  let services: { name: string; href: string }[] = [];
  let locations: { name: string; href: string }[] = [];

  try {
    const [servicesRes, locs] = await Promise.all([
      client.getEntries({
        content_type: "services",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        select: ["fields.title"] as any,
        order: ["fields.title"],
      }),
      fetchAllLocations(),
    ]);

    services = servicesRes.items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const title = (item.fields as any).title as string;
      return { name: title, href: `/services/${slugify(title)}` };
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
