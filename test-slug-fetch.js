const { createClient } = require('contentful');

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function getServiceFromSlug(slug) {
  let service = null;

  try {
    const response = await client.getEntries({ content_type: 'services', 'fields.url': slug, limit: 1 });
    if (response.items.length > 0) {
      service = response.items[0];
    }
  } catch {
    // ignore
  }

  if (!service) {
    try {
      const byId = await client.getEntry(slug);
      if (byId && byId.sys.contentType.sys.id === 'services') {
        service = byId;
      }
    } catch {
      // ignore
    }
  }

  return service;
}

async function run() {
  const result = await getServiceFromSlug('residential-roofing');
  console.log("Result:", result ? result.sys.id : "null");
}
run();
