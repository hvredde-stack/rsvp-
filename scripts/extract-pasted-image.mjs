import { readFileSync, writeFileSync } from "node:fs";

const logPath = process.argv[2];
const outPath = process.argv[3];
if (!logPath || !outPath) {
  console.error("usage: node extract-pasted-image.mjs <log-path> <out-path>");
  process.exit(1);
}

const log = readFileSync(logPath, "utf8");

// Find every base64 image payload, keep the LAST (most recent paste).
const re = /"type":"image","source":\{"type":"base64","media_type":"image\/(png|jpeg)","data":"([A-Za-z0-9+/=]+)"\}/g;

let last = null;
let match;
while ((match = re.exec(log)) !== null) {
  last = { mediaType: match[1], base64: match[2] };
}

if (!last) {
  console.error("No base64 image payload found in log.");
  process.exit(2);
}

const buf = Buffer.from(last.base64, "base64");
writeFileSync(outPath, buf);
console.log(`Wrote ${buf.length} bytes (${last.mediaType}) to ${outPath}`);
