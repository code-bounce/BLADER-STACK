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

if (!packageJson.dependencies) {
  packageJson.dependencies = {};
}

packageJson.dependencies["@blader/ui"] = "workspace:*";

if (!packageJson.devDependencies) {
  packageJson.devDependencies = {};
}

packageJson.devDependencies["@tailwindcss/postcss"] = "^4.1.18";

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
console.log(`✓ Added @blader/ui to ${appName} dependencies`);
console.log(`✓ Added @tailwindcss/postcss to ${appName} devDependencies`);

// Update main.tsx to include globals.css import and TooltipProvider (Vite app)
const mainTsxPath = path.join(appDir, "src", "main.tsx");
if (fs.existsSync(mainTsxPath)) {
  let mainContent = fs.readFileSync(mainTsxPath, "utf-8");
  const globalsImport = 'import "@blader/ui/globals.css";';
  const tooltipImport =
    'import { TooltipProvider } from "@blader/ui/components/tooltip";';

  let updated = false;

  if (!mainContent.includes(globalsImport)) {
    // Add the import after other imports
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
    updated = true;
    console.log(`✓ Added globals.css import to main.tsx`);
  }

  if (!mainContent.includes(tooltipImport)) {
    const lines = mainContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, tooltipImport);
    mainContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added TooltipProvider import to main.tsx`);
  }

  if (!mainContent.includes("<TooltipProvider>")) {
    mainContent = mainContent.replace(
      /<App\s*\/>/,
      "<TooltipProvider>\n      <App />\n    </TooltipProvider>",
    );
    updated = true;
    console.log(`✓ Wrapped App with TooltipProvider in main.tsx`);
  }

  if (updated) {
    fs.writeFileSync(mainTsxPath, mainContent);
  }
}

// Update main.tsx to include Toaster (Vite app)
const mainTsxPathToaster = path.join(appDir, "src", "main.tsx");
if (fs.existsSync(mainTsxPathToaster)) {
  let mainContentToaster = fs.readFileSync(mainTsxPathToaster, "utf-8");
  const toasterImport =
    'import { Toaster } from "@blader/ui/components/sonner";';

  let updated = false;

  if (!mainContentToaster.includes(toasterImport)) {
    const lines = mainContentToaster.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, toasterImport);
    mainContentToaster = lines.join("\n");
    updated = true;
    console.log(`✓ Added Toaster import to main.tsx`);
  }

  if (!mainContentToaster.includes("<Toaster />")) {
    mainContentToaster = mainContentToaster.replace(
      /<\/TooltipProvider>/,
      "</TooltipProvider>\n      <Toaster />",
    );
    updated = true;
    console.log(`✓ Added Toaster component to main.tsx`);
  }

  if (updated) {
    fs.writeFileSync(mainTsxPathToaster, mainContentToaster);
  }
}

// Update layout.tsx to include TooltipProvider and Toaster (Next.js app)
const layoutTsxPath = path.join(appDir, "src", "app", "layout.tsx");
if (fs.existsSync(layoutTsxPath)) {
  let layoutContent = fs.readFileSync(layoutTsxPath, "utf-8");
  const tooltipImport =
    'import { TooltipProvider } from "@blader/ui/components/tooltip";';
  const toasterImport =
    'import { Toaster } from "@blader/ui/components/sonner";';

  let updated = false;

  if (!layoutContent.includes(tooltipImport)) {
    const lines = layoutContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, tooltipImport);
    layoutContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added TooltipProvider import to layout.tsx`);
  }

  if (!layoutContent.includes(toasterImport)) {
    const lines = layoutContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, toasterImport);
    layoutContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added Toaster import to layout.tsx`);
  }

  if (!layoutContent.includes("<TooltipProvider>")) {
    layoutContent = layoutContent.replace(
      /<body>([\s\S]*?){children}([\s\S]*?)<\/body>/,
      "<body>\n        <TooltipProvider>\n          {children}\n        </TooltipProvider>\n        <Toaster />\n      </body>",
    );
    updated = true;
    console.log(`✓ Wrapped children with TooltipProvider in layout.tsx`);
  }

  if (updated) {
    fs.writeFileSync(layoutTsxPath, layoutContent);
  }
}

console.log(
  `\n✅ Setup complete for ${appName}! Run 'bun install' to install dependencies.`,
);
