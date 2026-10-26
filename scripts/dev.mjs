// Finds the first free TCP port at/after --base and launches `next dev` on it.
// Usage (run from an app dir, so cwd resolves that app's local `next`):
//   node ../../scripts/dev.mjs --base 3000 [extra next flags...]
import net from "node:net";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { parseDevArgs, findAvailablePort } from "./dev-options.mjs";

const { base, passThrough } = parseDevArgs(process.argv.slice(2));

const isFree = (port) =>
  new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(false));
    srv.once("listening", () => srv.close(() => resolve(true)));
    srv.listen(port, "0.0.0.0");
  });

const port = await findAvailablePort(base, isFree);

if (port !== base) {
  console.log(`\n⚠ port ${base} busy — using free port ${port} instead`);
}
console.log(`\n▶ dev server → http://localhost:${port}\n`);

// resolve THIS app's local next binary (cwd is the app dir under turbo)
const require = createRequire(`${process.cwd()}/`);
const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(
  process.execPath,
  [nextBin, "dev", "-p", String(port), ...passThrough],
  {
    stdio: "inherit",
    env: { ...process.env, WATCHPACK_POLLING: process.env.WATCHPACK_POLLING ?? "true" },
  },
);

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
child.on("error", (error) => {
  console.error(`Failed to start Next.js: ${error.message}`);
  process.exit(1);
});
child.on("exit", (code, signal) => process.exit(code ?? (signal === "SIGINT" ? 130 : 143)));
