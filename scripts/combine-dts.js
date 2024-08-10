const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "..", "dist");

function combineDeclarationFiles(dir) {
  let combined = "";
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      combined += combineDeclarationFiles(filePath);
    } else if (file.endsWith(".d.ts")) {
      combined += fs.readFileSync(filePath, "utf8") + "\n";
      fs.unlinkSync(filePath);
    }
  });

  return combined;
}

const combinedDeclarations = combineDeclarationFiles(distPath);
fs.writeFileSync(path.join(distPath, "index.d.ts"), combinedDeclarations);

// Clean up empty directories
function removeEmptyDirectories(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      removeEmptyDirectories(filePath);
      if (fs.readdirSync(filePath).length === 0) {
        fs.rmdirSync(filePath);
      }
    }
  });
}

removeEmptyDirectories(distPath);

console.log("Combined all .d.ts files into index.d.ts");
