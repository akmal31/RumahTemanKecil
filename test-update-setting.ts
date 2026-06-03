import { db } from "./lib/db";
async function testUpdateSetting() {
  console.log(
    "update site_config:",
    await db.updateSetting("site_config", { logo: "Edited" }),
  );
  console.log("get site_config:", await db.getSettings());
}
testUpdateSetting();
