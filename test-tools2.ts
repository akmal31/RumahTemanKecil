import { db } from "./lib/db";

async function testTools() {
  const isReal = db.isRealDbConnected();
  console.log("Is real db connected?", isReal);

  const tools = await db.getTools();
  console.log("Tools length:", tools.length);

  const settings = await db.getSettings();
  console.log("Settings keys:", Object.keys(settings));
}

testTools();
