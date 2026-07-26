export function camelToTitle(camelCase: string) {
  return camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim();
}

