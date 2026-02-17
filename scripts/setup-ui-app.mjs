import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const appName = process.argv[2];

if (!appName) {
  console.error("Usage: node setup-ui-app.mjs <app-name>");
  process.exit(1);
}

const appDir = path.join(rootDir, "apps", appName);
const uiDir = path.join(rootDir, "packages", "ui");

// Check if app directory exists
if (!fs.existsSync(appDir)) {
  console.error(`App directory not found: ${appDir}`);
  process.exit(1);
}

// Copy components.json
const componentsSourcePath = path.join(uiDir, "components.json");
const componentsDestPath = path.join(appDir, "components.json");

if (fs.existsSync(componentsSourcePath)) {
  fs.copyFileSync(componentsSourcePath, componentsDestPath);
  console.log(`✓ Copied components.json to ${appName}`);
}

// Copy postcss.config.mjs
const postcssSourcePath = path.join(uiDir, "postcss.config.mjs");
const postcssDestPath = path.join(appDir, "postcss.config.mjs");

if (fs.existsSync(postcssSourcePath)) {
  fs.copyFileSync(postcssSourcePath, postcssDestPath);
  console.log(`✓ Copied postcss.config.mjs to ${appName}`);
}

// Update app's package.json
const packageJsonPath = path.join(appDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

if (!packageJson.devDependencies) {
  packageJson.devDependencies = {};
}

packageJson.devDependencies["@tailwindcss/postcss"] = "^4.1.18";

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
console.log(`✓ Added @tailwindcss/postcss to ${appName} devDependencies`);

// Update main.tsx to include globals.css import
const mainTsxPath = path.join(appDir, "src", "main.tsx");
if (fs.existsSync(mainTsxPath)) {
  let mainContent = fs.readFileSync(mainTsxPath, "utf-8");
  const globalsImport = 'import "@repo/ui/globals.css";';

  if (!mainContent.includes(globalsImport)) {
    // Add the import after other imports from relative paths
    const lines = mainContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, globalsImport);
    mainContent = lines.join("\n");
    fs.writeFileSync(mainTsxPath, mainContent);
    console.log(`✓ Added globals.css import to main.tsx`);
  }
}

console.log(
  `\n✅ Setup complete for ${appName}! Run 'bun install' to install dependencies.`,
);
