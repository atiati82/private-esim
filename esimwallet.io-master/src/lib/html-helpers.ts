/**
 * Extract URL links from provided text
 */
export function extractUrlLinks(textContent: string | null | undefined): string[] {
  const foundLinks = textContent?.match(urlRegexp);
  const foundLocalhostLinks = textContent?.match(urlLocalhostRegexp);

  const allLinks = [
    ...(foundLinks ?? []).map((link) => link.trim()),
    ...(foundLocalhostLinks ?? []).map((link) => link.trim()),
  ];
  return [...new Set(allLinks)];
}

const urlRegexp =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
const urlLocalhostRegexp = /https?:\/\/localhost(:\d+)?(\/[^\s<>"'()[\]{}\\^`~]*)?/g;
