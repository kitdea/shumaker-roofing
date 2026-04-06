require('dotenv').config({ path: '.env.local' });
const { createClient } = require('contentful');

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function run() {
  try {
    const result = await client.getContentTypes();
    result.items.forEach(item => {
      console.log("ID:", item.sys.id, "Name:", item.name);
      item.fields.forEach(f => console.log("  Field:", f.id));
    });
  } catch (e) { console.error(e); }
}
run();
