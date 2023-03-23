export function capitalize(string: string | undefined) {
  if (!string) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isNumber(value: any): value is number {
  return typeof value === "number" && isFinite(value);
}
