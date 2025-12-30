const EMAIL_ENABLED = process.env.EMAIL_ENABLED === "true";

export const safeSend = async (fn, ...args) => {
  if (!EMAIL_ENABLED) {
    console.log("📭 Email skipped:", fn.name);
    return;
  }
  return fn(...args);
};
