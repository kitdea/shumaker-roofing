import { fetchServiceMenuItems, fetchAllLocations } from "@/lib/sanity";
import { Navbar } from "@/components/shared/navbar";

export async function NavbarServer() {
  let services: { name: string; href: string }[] = [];
  let locations: { name: string; href: string }[] = [];

  try {
    const [menuItems, locs] = await Promise.all([
      fetchServiceMenuItems(),
      fetchAllLocations(),
    ]);

    services = menuItems.map(({ label, href }) => ({ name: label, href }));

    const STATE_ORDER: Record<string, number> = {
      "Maryland": 0,
      "MD": 0,
      "Northern Virginia": 1,
      "Virginia": 1,
      "VA": 1,
      "Pennsylvania": 2,
      "PA": 2,
    };

    locations = locs
      .map((loc) => ({
        name: loc.fullLocationName || loc.cityName || "",
        href: `/service-areas/${loc.slug}`,
        state: loc.state ?? "",
      }))
      .sort((a, b) => {
        const orderA = STATE_ORDER[a.state] ?? 99;
        const orderB = STATE_ORDER[b.state] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      })
      .map(({ name, href }) => ({ name, href }));
  } catch (e) {
    console.error("Sanity navbar fetch error:", e);
  }

  return <Navbar services={services} locations={locations} />;
}
