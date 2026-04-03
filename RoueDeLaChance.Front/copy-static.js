const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, ".");
const destDir = path.join(__dirname, "../RoueDeLaChance.Web/wwwroot");

// Create wwwroot if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy index.html
fs.copyFileSync(
  path.join(srcDir, "index.html"),
  path.join(destDir, "index.html")
);

// Copy css directory
const cssSrcDir = path.join(srcDir, "css");
const cssDestDir = path.join(destDir, "css");
if (fs.existsSync(cssSrcDir)) {
  if (!fs.existsSync(cssDestDir)) {
    fs.mkdirSync(cssDestDir, { recursive: true });
  }
  fs.readdirSync(cssSrcDir).forEach((file) => {
    fs.copyFileSync(
      path.join(cssSrcDir, file),
      path.join(cssDestDir, file)
    );
  });
}

console.log("✓ Static files copied to RoueDeLaChance.Web/wwwroot");
