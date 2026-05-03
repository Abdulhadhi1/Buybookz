const fs = require("node:fs");
const path = require("node:path");

if (process.platform !== "win32") {
  process.exit(0);
}

const file = path.join(
  process.cwd(),
  "node_modules",
  "@opennextjs",
  "aws",
  "dist",
  "build",
  "copyTracedFiles.js",
);

if (!fs.existsSync(file)) {
  process.exit(0);
}

const before = "symlinkSync(symlink, to);";
const after = `symlinkSync(
                    symlink,
                    to,
                    statSync(symlink).isDirectory() ? "junction" : undefined,
                );`;

const source = fs.readFileSync(file, "utf8");

if (source.includes(after)) {
  process.exit(0);
}

if (!source.includes(before)) {
  console.warn("OpenNext Windows symlink patch was not applied: target code not found.");
  process.exit(0);
}

fs.writeFileSync(file, source.replace(before, after));
console.log("Applied OpenNext Windows junction patch.");
