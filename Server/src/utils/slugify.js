export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HJ${Date.now().toString().slice(-6)}${rand}`;
}
