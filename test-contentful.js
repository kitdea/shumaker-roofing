const { client } = require("./lib/contentful");

async function run() {
  const result = await client.getEntries({ content_type: "blog", limit: 3, include: 2 });
  result.items.forEach(item => {
    console.log("Post:", item.fields.title);
    console.log("Author field:", JSON.stringify(item.fields.author, null, 2));
  });
}
run();
