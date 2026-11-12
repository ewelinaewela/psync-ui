// Public business details only. Never put keys or private identity documents here.
export function getOperator(env = process.env) {
  return {
    name: (env.PSYNC_OPERATOR_NAME ?? "EKAI LTD").trim(),
    number: (env.PSYNC_OPERATOR_NUMBER ?? "12447903").trim(),
    address: (env.PSYNC_OPERATOR_ADDRESS ?? "5th Floor, 167–169 Great Portland Street\nLondon W1W 5PF\nUnited Kingdom").trim(),
    email: (env.PSYNC_SUPPORT_EMAIL ?? "ekai.operations@gmail.com").trim(),
  };
}

export function requireOperator(env = process.env) {
  const operator = getOperator(env);
  const missing = Object.entries(operator).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) throw new Error(`Public operator details are required before a paid build: ${missing.join(", ")}. See premium-private/LAUNCH_CHECKLIST.md.`);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(operator.email)) throw new Error("PSYNC_SUPPORT_EMAIL must be a valid public support email address.");
  return operator;
}
