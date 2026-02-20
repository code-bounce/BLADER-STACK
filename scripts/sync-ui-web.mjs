import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

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

// Update vite.config.ts to add tailwindcss plugin (Vite app)
const viteConfigPath = path.join(appDir, "vite.config.ts");
if (fs.existsSync(viteConfigPath)) {
  let viteContent = fs.readFileSync(viteConfigPath, "utf-8");

  if (!viteContent.includes("tailwindcss")) {
    // Add tailwindcss import
    if (!viteContent.includes(`import tailwindcss`)) {
      const firstImport = viteContent.match(/^import\s/m);
      if (firstImport) {
        viteContent = viteContent.replace(
          firstImport[0],
          `import tailwindcss from '@tailwindcss/vite'\n${firstImport[0]}`,
        );
      }
    }

    // Add tailwindcss to plugins array
    viteContent = viteContent.replace(
      /plugins:\s*\[([^\]]*)\]/,
      (match, content) => {
        if (!content.includes("tailwindcss")) {
          return `plugins: [\n    tailwindcss(),\n    ${content.trim()}\n  ]`;
        }
        return match;
      },
    );

    fs.writeFileSync(viteConfigPath, viteContent);
    console.log(`✓ Added tailwindcss plugin to vite.config.ts`);
  }
}

// Add @import "tailwindcss"; to index.css or globals.css (Vite app)
const indexCssPath = path.join(appDir, "src", "index.css");
const globalsCssPath = path.join(appDir, "src", "globals.css");
const targetCssPath = fs.existsSync(indexCssPath)
  ? indexCssPath
  : globalsCssPath;

if (fs.existsSync(targetCssPath)) {
  let cssContent = fs.readFileSync(targetCssPath, "utf-8");

  if (!cssContent.includes('@import "tailwindcss";')) {
    cssContent = `@import "tailwindcss";\n\n${cssContent}`;
    fs.writeFileSync(targetCssPath, cssContent);
    console.log(`✓ Added @import "tailwindcss"; to CSS file`);
  }
}

// Add @import "tailwindcss"; to app/globals.css (Next.js app)
const nextGlobalsCssPath = path.join(appDir, "src", "app", "globals.css");
if (fs.existsSync(nextGlobalsCssPath)) {
  let nextCssContent = fs.readFileSync(nextGlobalsCssPath, "utf-8");

  if (!nextCssContent.includes('@import "tailwindcss";')) {
    nextCssContent = `@import "tailwindcss";\n\n${nextCssContent}`;
    fs.writeFileSync(nextGlobalsCssPath, nextCssContent);
    console.log(`✓ Added @import "tailwindcss"; to app/globals.css`);
  }
}

// Update __root.tsx if it exists (TanStack Router) or main.tsx (Vite app)
const rootTsxPath = path.join(appDir, "src", "routes", "__root.tsx");
const mainTsxPath = path.join(appDir, "src", "main.tsx");

// Check for __root.tsx first (TanStack Router pattern)
if (fs.existsSync(rootTsxPath)) {
  let rootContent = fs.readFileSync(rootTsxPath, "utf-8");
  const globalsImport = 'import "@blader/ui/globals.css";';
  const tooltipImport =
    'import { TooltipProvider } from "@blader/ui/components/ui/tooltip";';
  const toasterImport =
    'import { Toaster } from "@blader/ui/components/ui/sonner";';

  let updated = false;

  // Add globals import
  if (!rootContent.includes(globalsImport)) {
    const lines = rootContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, globalsImport);
    rootContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added globals.css import to __root.tsx`);
  }

  // Add TooltipProvider import
  if (!rootContent.includes(tooltipImport)) {
    const lines = rootContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, tooltipImport);
    rootContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added TooltipProvider import to __root.tsx`);
  }

  // Add Toaster import
  if (!rootContent.includes(toasterImport)) {
    const lines = rootContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, toasterImport);
    rootContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added Toaster import to __root.tsx`);
  }

  // Wrap Outlet with TooltipProvider and add Toaster
  if (!rootContent.includes("<TooltipProvider>")) {
    rootContent = rootContent.replace(
      /<Outlet\s*\/>/,
      "<TooltipProvider>\n      <Outlet />\n    </TooltipProvider>\n    <Toaster />",
    );
    updated = true;
    console.log(
      `✓ Wrapped Outlet with TooltipProvider and added Toaster in __root.tsx`,
    );
  }

  if (updated) {
    fs.writeFileSync(rootTsxPath, rootContent);
  }
} else if (fs.existsSync(mainTsxPath)) {
  // Fall back to main.tsx if __root.tsx doesn't exist
  let mainContent = fs.readFileSync(mainTsxPath, "utf-8");
  const globalsImport = 'import "@blader/ui/globals.css";';
  const tooltipImport =
    'import { TooltipProvider } from "@blader/ui/components/ui/tooltip";';
  const toasterImport =
    'import { Toaster } from "@blader/ui/components/ui/sonner";';

  let updated = false;

  // Add globals import
  if (!mainContent.includes(globalsImport)) {
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

  // Add TooltipProvider import
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

  // Add Toaster import
  if (!mainContent.includes(toasterImport)) {
    const lines = mainContent.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === "" && insertIndex > 0) {
        break;
      }
    }

    lines.splice(insertIndex, 0, toasterImport);
    mainContent = lines.join("\n");
    updated = true;
    console.log(`✓ Added Toaster import to main.tsx`);
  }

  // Wrap root.render with TooltipProvider and Toaster
  if (!mainContent.includes("<TooltipProvider>")) {
    // Check if StrictMode is being used
    if (mainContent.includes("<StrictMode>")) {
      // Replace StrictMode children with TooltipProvider wrapped content
      mainContent = mainContent.replace(
        /<StrictMode>([\s\S]*?)<\/StrictMode>/,
        (match, content) => {
          // Extract inner content and wrap with TooltipProvider
          const innerContent = content.trim();
          return `<StrictMode>\n    <TooltipProvider>\n      ${innerContent}\n      <Toaster />\n    </TooltipProvider>\n  </StrictMode>`;
        },
      );
      updated = true;
      console.log(
        `✓ Wrapped content with TooltipProvider and Toaster in main.tsx`,
      );
    } else {
      // Handle various render patterns without StrictMode
      const renderPatterns = [
        // Pattern 1: root.render(<App />)
        /root\.render\(\s*<App\s*\/>\s*\)/,
        // Pattern 2: root.render(<SomeComponent ... />)
        /root\.render\(\s*<(\w+)[^>]*\/>\s*\)/,
        // Pattern 3: root.render(<Component>...</Component>)
        /root\.render\(\s*<(\w+)[^>]*>[\s\S]*?<\/\1>\s*\)/,
      ];

      for (const pattern of renderPatterns) {
        if (pattern.test(mainContent)) {
          mainContent = mainContent.replace(pattern, (match) => {
            // Extract the inner content
            const innerContent = match
              .replace(/^root\.render\(\s*/, "")
              .replace(/\s*\)$/, "");
            return `root.render(\n  <TooltipProvider>\n    ${innerContent}\n    <Toaster />\n  </TooltipProvider>\n)`;
          });
          updated = true;
          console.log(
            `✓ Wrapped render with TooltipProvider and Toaster in main.tsx`,
          );
          break;
        }
      }
    }
  }

  if (updated) {
    fs.writeFileSync(mainTsxPath, mainContent);
  }
}

// Update layout.tsx to include TooltipProvider and Toaster (Next.js app)
const layoutTsxPath = path.join(appDir, "src", "app", "layout.tsx");
if (fs.existsSync(layoutTsxPath)) {
  let layoutContent = fs.readFileSync(layoutTsxPath, "utf-8");
  const tooltipImport =
    'import { TooltipProvider } from "@blader/ui/components/ui/tooltip";';
  const toasterImport =
    'import { Toaster } from "@blader/ui/components/ui/sonner";';

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

// Install tailwindcss and @tailwindcss/vite
try {
  console.log(`\n📦 Installing tailwindcss and @tailwindcss/vite...`);
  execSync(`cd ${appDir} && bun add tailwindcss @tailwindcss/vite`, {
    stdio: "inherit",
  });
  console.log(`✓ Installed tailwindcss and @tailwindcss/vite`);
} catch (error) {
  console.error(`✗ Failed to install tailwindcss packages: ${error.message}`);
}

console.log(
  `\n✅ Setup complete for ${appName}! Run 'bun install' to install remaining dependencies.`,
);
