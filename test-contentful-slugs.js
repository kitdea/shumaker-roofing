const { createClient } = require('contentful');

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function run() {
  try {
    const result = await client.getEntries({ content_type: 'services' });
    result.items.forEach(item => {
      console.log("ID:", item.sys.id, "TITLE:", item.fields.title, "URL:", item.fields.url);
    });
  } catch (e) { console.error(e); }
}
run();
