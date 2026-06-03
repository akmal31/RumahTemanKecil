import { db } from "./lib/db";

async function testUpdate() {
  const tools = await db.getTools();
  console.log("Current tools count:", tools.length);
  if (tools.length > 0) {
    const firstId = tools[0].id;
    console.log("Updating tool", firstId);

    await db.updateTool(firstId, {
      title: tools[0].title.replace(" - Updated", ""),
    });

    const db2 = await db.getTools();
    console.log(
      "New title of first tool:",
      db2.find((t) => t.id === firstId)?.title,
    );
  }
}

testUpdate();
