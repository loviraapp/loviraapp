import { rmSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";

try {
  rmSync(".next", { recursive: true, force: true });
} catch {
  // ignore
}

if (process.platform === "win32") {
  try {
    const out = execSync(
      'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000,3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"',
      { encoding: "utf8" }
    ).trim();
    for (const pid of out.split(/\s+/).filter(Boolean)) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore — ports may already be free
  }
}

const result = spawnSync("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
