import { fetchAllServices, fetchAllLocations } from "@/lib/contentful";
import { slugify } from "@/lib/utils";
import { Navbar } from "@/components/shared/navbar";

export async function NavbarServer() {
  let services: { name: string; href: string }[] = [];
  let locations: { name: string; href: string }[] = [];

  try {
    const [servicesItems, locs] = await Promise.all([
      fetchAllServices(),
      fetchAllLocations(),
    ]);

    services = servicesItems
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => {
        const title = (item.fields as any).title as string;
        const displayName = title === "Commercial Flat & Low Slope Roofing Restoration" ? "Commercial" : title;
        return { name: displayName, href: `/services/${slugify(title)}` };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const STATE_ORDER: Record<string, number> = {
      "Maryland": 0,
      "MD": 0,
      "Northern Virginia": 1,
      "Virginia": 1,
      "VA": 1,
      "Pennsylvania": 2,
      "PA": 2,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locations = locs
      .map((loc: any) => ({
        name: loc.fields.fullLocationName || loc.fields.cityName,
        href: `/service-areas/${loc.fields.slug}`,
        state: loc.fields.state as string,
      }))
      .sort((a: { name: string; state: string }, b: { name: string; state: string }) => {
        const orderA = STATE_ORDER[a.state] ?? 99;
        const orderB = STATE_ORDER[b.state] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      })
      .map(({ name, href }: { name: string; href: string }) => ({ name, href }));
  } catch (e) {
    console.error("Contentful navbar fetch error:", e);
  }

  return <Navbar services={services} locations={locations} />;
}
