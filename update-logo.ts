import { db } from "./lib/db";
async function updateLogo() {
  const currentSettings = await db.getSettings();
  const siteConfig = currentSettings.site_config || {};
  siteConfig.logo =
    "https://storage.googleapis.com/timetraq-public/other/img/logo%201%20Background%20Removed.png";
  await db.updateSetting("site_config", siteConfig);
  console.log("Logo updated");
}
updateLogo();
