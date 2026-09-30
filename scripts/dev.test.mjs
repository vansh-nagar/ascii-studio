import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDevArgs, findAvailablePort } from "./dev-options.mjs";

test("keeps every Next.js argument when --base is omitted", () => {
  assert.deepEqual(parseDevArgs(["--webpack", "--hostname", "localhost"]), {
    base: 3000, passThrough: ["--webpack", "--hostname", "localhost"],
  });
  assert.deepEqual(parseDevArgs([]), { base: 3000, passThrough: [] });
});

test("consumes only --base and its value", () => {
  assert.deepEqual(parseDevArgs(["--webpack", "--base", "4000", "--hostname", "localhost"]), {
    base: 4000, passThrough: ["--webpack", "--hostname", "localhost"],
  });
});

test("rejects missing, malformed, and out-of-range ports", () => {
  for (const value of [undefined, "", "0", "-1", "65536", "3000junk", "3.5", "--webpack"]) {
    assert.throws(() => parseDevArgs(value === undefined ? ["--base"] : ["--base", value]), /--base must/);
  }
});

test("uses the base port when free", async () => {
  assert.equal(await findAvailablePort(3000, async () => true), 3000);
});

test("skips occupied ports and checks the selected port", async () => {
  const checked = [];
  assert.equal(await findAvailablePort(3000, async (port) => {
    checked.push(port);
    return port === 3002;
  }), 3002);
  assert.deepEqual(checked, [3000, 3001, 3002]);
});

test("fails after 100 occupied ports instead of launching on an unchecked port", async () => {
  const checked = [];
  await assert.rejects(findAvailablePort(3000, async (port) => {
    checked.push(port);
    return false;
  }), /No free port found between 3000 and 3099/);
  assert.equal(checked.length, 100);
  assert.equal(checked.at(-1), 3099);
});

test("never probes past the TCP port limit", async () => {
  const checked = [];
  await assert.rejects(findAvailablePort(65535, async (port) => {
    checked.push(port);
    return false;
  }), /65535 and 65535/);
  assert.deepEqual(checked, [65535]);
  assert.equal(await findAvailablePort(65535, async () => true), 65535);
});

test("launcher forwards flags, sets portable polling, and preserves child exit codes", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "ascii-dev-test-"));
  try {
    const binDir = path.join(fixture, "node_modules", "next", "dist", "bin");
    mkdirSync(binDir, { recursive: true });
    writeFileSync(path.join(binDir, "next.js"), `
      console.log(JSON.stringify({ args: process.argv.slice(2), polling: process.env.WATCHPACK_POLLING }));
      process.exit(7);
    `);
    const launcher = fileURLToPath(new URL("./dev.mjs", import.meta.url));
    for (const polling of [undefined, "false"]) {
      const env = { ...process.env };
      delete env.WATCHPACK_POLLING;
      if (polling !== undefined) env.WATCHPACK_POLLING = polling;
      const result = spawnSync(process.execPath, [launcher, "--webpack"], {
        cwd: fixture, env, encoding: "utf8", timeout: 10000,
      });
      assert.equal(result.error, undefined);
      assert.equal(result.status, 7, result.stderr);
      const output = JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1));
      assert.equal(output.polling, polling ?? "true");
      assert.equal(output.args[0], "dev");
      assert.equal(output.args.at(-1), "--webpack");
      assert.ok(Number(output.args[2]) >= 3000 && Number(output.args[2]) <= 3099);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
