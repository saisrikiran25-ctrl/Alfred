
import { generateSmartBotReply } from '../src/lib/botLogic';

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

function test(name, fn) {
  try {
    fn();
    console.log(`${COLORS.green}PASS${COLORS.reset}: ${name}`);
  } catch (err) {
    console.error(`${COLORS.red}FAIL${COLORS.reset}: ${name}`);
    console.error(err);
  }
}

console.log(`${COLORS.cyan}--- RE-VERIFYING SYNTHESIS QUALITY ---${COLORS.reset}\n`);

test("Synthesis - No double numbering", () => {
  const reply = generateSmartBotReply("What are the top purchase factors?", true);
  // Check that sentences starting with "1." are cleaned
  if (reply.includes("- 1. ")) throw new Error("Leading number not cleaned.");
  if (reply.includes("(82%), 2.")) throw new Error("Trailing number from split not cleaned.");
  // Verify table is multiline
  const lines = reply.split('\n');
  const tableLines = lines.filter(l => l.startsWith('|'));
  if (tableLines.length < 5) throw new Error("Table rendering still seems broken (too few lines).");
});

test("Synthesis - Header consistency", () => {
  const reply = generateSmartBotReply("What are the top purchase factors?", true);
  if (!reply.includes("#### Statistical Breakdown")) throw new Error("Missing data header.");
});

console.log(`\n${COLORS.cyan}--- TEST SUITE COMPLETED ---${COLORS.reset}`);
