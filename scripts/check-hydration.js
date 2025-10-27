#!/usr/bin/env node
/**
 * Script to check for potential React hydration issues
 * This script scans the codebase for common patterns that cause hydration mismatches
 */

const fs = require("fs");
const path = require("path");

const issues = [];

function checkFile(filePath, content) {
  const filename = path.relative(process.cwd(), filePath);

  // Check for Date.now() or new Date() in data files
  if (
    filePath.includes("menu-data") &&
    (content.includes("Date.now()") || content.includes("new Date()"))
  ) {
    issues.push({
      file: filename,
      line: content.split("\n").findIndex((line) => line.includes("Date")),
      issue:
        "Potential hydration issue: Using Date.now() or new Date() in data file",
      severity: "error",
    });
  }

  // Check for Math.random() in non-administrative client components
  if (
    (filePath.includes("components") || filePath.includes("app")) &&
    !filePath.includes("admin") &&
    content.includes("Math.random()")
  ) {
    issues.push({
      file: filename,
      line: content
        .split("\n")
        .findIndex((line) => line.includes("Math.random")),
      issue: "Potential hydration issue: Using Math.random() in component",
      severity: "warning",
    });
  }

  // Check for typeof window checks without proper client component handling
  if (content.includes("typeof window") && !content.includes('"use client"')) {
    issues.push({
      file: filename,
      line: content
        .split("\n")
        .findIndex((line) => line.includes("typeof window")),
      issue:
        'Potential hydration issue: typeof window check without "use client"',
      severity: "warning",
    });
  }

  // Check for localStorage or sessionStorage
  if (
    (content.includes("localStorage") || content.includes("sessionStorage")) &&
    !content.includes('"use client"')
  ) {
    issues.push({
      file: filename,
      line: content
        .split("\n")
        .findIndex(
          (line) =>
            line.includes("localStorage") || line.includes("sessionStorage")
        ),
      issue:
        'Potential hydration issue: Using localStorage/sessionStorage without "use client"',
      severity: "error",
    });
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, and other build directories
      if (!["node_modules", ".next", ".git", "dist", "build"].includes(file)) {
        walkDir(filePath);
      }
    } else if (
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js") ||
      file.endsWith(".jsx")
    ) {
      const content = fs.readFileSync(filePath, "utf-8");
      checkFile(filePath, content);
    }
  });
}

// Walk through app, components, and lib directories
["app", "components", "lib"].forEach((dir) => {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
});

// Report issues
if (issues.length > 0) {
  console.log("\n⚠️  Potential Hydration Issues Found:\n");
  issues.forEach((issue) => {
    console.log(
      `[${issue.severity.toUpperCase()}] ${issue.file}:${issue.line}`
    );
    console.log(`  ${issue.issue}\n`);
  });
  process.exit(1);
} else {
  console.log("\n✅ No hydration issues detected.\n");
  process.exit(0);
}
