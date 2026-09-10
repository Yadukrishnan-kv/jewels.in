let symbol = "₹";

export function setCurrencySymbol(next) {
  if (next) symbol = next;
}

export function getCurrencySymbol() {
  return symbol;
}

export function formatPrice(n) {
  return `${symbol} ${Number(n || 0).toFixed(2)}`;
}
