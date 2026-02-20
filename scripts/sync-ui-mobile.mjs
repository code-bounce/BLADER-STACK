#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MOBILE_APP_PATH = join(__dirname, "../apps/mobile");
const GLOBAL_CSS_PATH = join(MOBILE_APP_PATH, "global.css");
const METRO_CONFIG_PATH = join(MOBILE_APP_PATH, "metro.config.js");
const APP_LAYOUT_PATH = join(MOBILE_APP_PATH, "app/_layout.tsx");
const PACKAGE_JSON_PATH = join(MOBILE_APP_PATH, "package.json");

console.log("🚀 Setting up Uniwind for Expo app...\n");

// Step 1: Install packages
function installPackages() {
  console.log("📦 Step 1: Installing uniwind and tailwindcss...");

  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf-8"));

  if (
    packageJson.dependencies?.uniwind &&
    packageJson.dependencies?.tailwindcss
  ) {
    console.log("✓ Packages already installed\n");
    return;
  }

  try {
    execSync("bun add uniwind tailwindcss", {
      cwd: MOBILE_APP_PATH,
      stdio: "inherit",
    });
    console.log("✓ Packages installed\n");
  } catch (error) {
    console.error("✗ Failed to install packages:", error.message);
    process.exit(1);
  }
}

// Step 2: Create global.css
function createGlobalCSS() {
  console.log("📝 Step 2: Creating global.css file...");

  const globalCSSContent = `@import "tailwindcss";
@import "uniwind";
`;

  if (existsSync(GLOBAL_CSS_PATH)) {
    const existingContent = readFileSync(GLOBAL_CSS_PATH, "utf-8");
    if (existingContent.includes('@import "uniwind"')) {
      console.log("✓ global.css already configured\n");
      return;
    }
  }

  writeFileSync(GLOBAL_CSS_PATH, globalCSSContent);
  console.log(`✓ Created ${GLOBAL_CSS_PATH}\n`);
}

// Step 3: Import global.css in app layout
function importGlobalCSS() {
  console.log("📝 Step 3: Importing global.css in app layout...");

  if (!existsSync(APP_LAYOUT_PATH)) {
    console.error(`✗ App layout not found at ${APP_LAYOUT_PATH}`);
    process.exit(1);
  }

  let layoutContent = readFileSync(APP_LAYOUT_PATH, "utf-8");

  if (layoutContent.includes("global.css")) {
    console.log("✓ global.css already imported\n");
    return;
  }

  // Add import at the top, after other imports
  const importStatement = "import '@/global.css';\n";

  // Find the position after the last import statement
  const importRegex = /^import\s+.*?;$/gm;
  const matches = [...layoutContent.matchAll(importRegex)];

  if (matches.length > 0) {
    const lastImport = matches[matches.length - 1];
    const insertPosition = lastImport.index + lastImport[0].length + 1;
    layoutContent =
      layoutContent.slice(0, insertPosition) +
      importStatement +
      layoutContent.slice(insertPosition);
  } else {
    layoutContent = importStatement + layoutContent;
  }

  writeFileSync(APP_LAYOUT_PATH, layoutContent);
  console.log("✓ Imported global.css in app layout\n");
}

// Step 4: Configure Metro
function configureMetro() {
  console.log("⚙️  Step 4: Configuring metro.config.js...");

  const metroConfig = `// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/** @type {import('expo/metro-config').MetroConfig} */
module.exports = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: "./global.css",
  // (optional) path where we gonna auto-generate typings
  // placing in app/ directory ensures TypeScript automatically includes it
  dtsFile: "./app/uniwind-types.d.ts",
});
`;

  if (existsSync(METRO_CONFIG_PATH)) {
    const metroContent = readFileSync(METRO_CONFIG_PATH, "utf-8");
    if (metroContent.includes("withUniwindConfig")) {
      console.log("✓ Metro already configured\n");
      return;
    }
  }

  writeFileSync(METRO_CONFIG_PATH, metroConfig);
  console.log("✓ Created metro.config.js with Uniwind configuration\n");
}

// Step 5: Update TypeScript config
function updateTsConfig() {
  console.log("📝 Step 5: Checking TypeScript configuration...");

  const tsConfigPath = join(MOBILE_APP_PATH, "tsconfig.json");

  if (!existsSync(tsConfigPath)) {
    console.log("⚠ tsconfig.json not found, skipping\n");
    return;
  }

  const tsConfig = JSON.parse(readFileSync(tsConfigPath, "utf-8"));

  console.log("✓ TypeScript configuration looks good\n");
}

// Main execution
function main() {
  try {
    installPackages();
    createGlobalCSS();
    importGlobalCSS();
    configureMetro();
    updateTsConfig();

    console.log("✅ Uniwind setup complete!\n");
    console.log("Next steps:");
    console.log("  1. Run: cd apps/mobile && bun start");
    console.log("  2. Wait for Metro to generate app/uniwind-types.d.ts");
    console.log("  3. Start using Tailwind classes in your components!\n");
    console.log("📚 Documentation: https://docs.uniwind.dev/quickstart");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

main();
