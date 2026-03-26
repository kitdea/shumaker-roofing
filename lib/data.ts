export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "benefits-of-upgrading-to-energy-efficient-roof",
    title: "The Benefits of Upgrading to an Energy-Efficient Roof",
    excerpt: "Energy-efficient roofs do more than just protect your home; they also help reduce your energy bills.",
    content: "Energy efficiency is becoming increasingly important for homeowners. An energy-efficient roof is designed to reflect more sunlight and absorb less heat than a standard roof. This means your home stays cooler during the hot summer months, reducing your reliance on air conditioning and lowering your energy bills.\n\nAt Shumaker Roofing, we offer a variety of energy-efficient roofing materials, including cool roofs, metal roofing, and specialized shingles that meet ENERGY STAR® requirements. These materials not only save you money but also have a longer lifespan, as they undergo less thermal stress.\n\nInvesting in an energy-efficient roof is an investment in your home's future and the environment. Contact us today to learn more about our eco-friendly roofing solutions.",
    date: "26 August 2025",
    author: "Martin Graham",
    imageUrl: "https://images.unsplash.com/photo-1542618991-7f99ff9bd1ec?q=80&w=2070&auto=format&fit=crop",
    category: "Roofing Insights & Tips",
  },
  {
    id: "2",
    slug: "how-to-spot-early-signs-of-roof-damage",
    title: "How to Spot Early Signs of Roof Damage",
    excerpt: "Catching roof damage early can save you thousands of dollars in major repairs.",
    content: "Your roof undergoes a lot of stress from the elements. Over time, this wear and tear can lead to damage. Spotting this damage early is crucial to preventing more extensive and costly repairs down the line.\n\nHere are some early signs of roof damage to look out for:\n- Missing, cracked, or curling shingles\n- Granules in your gutters\n- Water stains on your ceiling or walls\n- Sagging roof decks\n- Increased energy bills\n\nIf you notice any of these signs, it's essential to have a professional inspection. Shumaker Roofing offers comprehensive roof inspections to assess the health of your roof and recommend the best course of action.",
    date: "12 September 2025",
    author: "Sarah Jenkins",
    imageUrl: "https://images.unsplash.com/photo-1510629532822-04cb5b6fa72d?q=80&w=2070&auto=format&fit=crop",
    category: "Maintenance",
  },
  {
    id: "3",
    slug: "choosing-right-shingles-for-your-home",
    title: "Choosing the Right Shingles for Your Home",
    excerpt: "With so many options available, how do you choose the best shingles for your home's style and your budget?",
    content: "Selecting the right shingles is a major decision when replacing your roof. It impacts not only the curb appeal of your home but also its protection and value.\n\nThere are several factors to consider:\n1. **Material:** Asphalt shingles are the most popular and affordable, but metal, slate, and tile offer unique aesthetics and longevity.\n2. **Color:** Choose a color that complements your home's exterior. Dark colors absorb heat, while light colors reflect it.\n3. **Style:** Architectural shingles offer a dimensional look, while 3-tab shingles are more traditional and cost-effective.\n\nOur experts at Shumaker Roofing can guide you through the process, helping you select the perfect shingles that meet your aesthetic preferences and budget requirements.",
    date: "05 October 2025",
    author: "Michael Shumaker",
    imageUrl: "https://images.unsplash.com/photo-1548614606-52b4451f994b?q=80&w=2070&auto=format&fit=crop",
    category: "Home Improvement",
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
