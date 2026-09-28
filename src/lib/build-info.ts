// Last commit hash and date, read from git at build time. Null when git isn't available
// (e.g. a build from a tarball), in which case the build stamp is simply not shown.
import { execSync } from "node:child_process";

function readLastCommit() {
  try {
    const [hash, date] = execSync("git log -1 --format=%h%x20%cs", { encoding: "utf8" }).trim().split(" ");
    return { hash, date };
  } catch {
    return null;
  }
}

export const lastCommit = readLastCommit();

/** "2026-09-28" → "28.09.2026" */
export const formatDate = (isoDate: string) => isoDate.split("-").reverse().join(".");
