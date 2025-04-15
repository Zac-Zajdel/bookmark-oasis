export function parseUrl(url: string | undefined): string | null {
  if (!url) return null;

  try {
    const { href } = new URL(url);
    return /^https?:\/\//i.test(href) ? href : null;
  } catch {
    return null;
  }
}
