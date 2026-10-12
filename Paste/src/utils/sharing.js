export function encodePaste(paste) {
  const bytes = new TextEncoder().encode(
    JSON.stringify({ title: paste.title, content: paste.content }),
  );
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}
export function decodePaste(data) {
  if (!data || data.length > 16000) throw new Error("Invalid share link");
  const bytes = Uint8Array.from(
    atob(data.replaceAll("-", "+").replaceAll("_", "/")),
    (c) => c.charCodeAt(0),
  );
  const paste = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(bytes),
  );
  if (
    typeof paste.title !== "string" ||
    typeof paste.content !== "string" ||
    !paste.content.trim()
  )
    throw new Error("Invalid shared paste");
  return paste;
}
export function createShareUrl(paste, href = window.location.href) {
  const data = encodePaste(paste);
  if (data.length > 16000) return null;
  const url = new URL(href);
  url.hash = `/shared?data=${data}`;
  return url.href;
}
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* Try legacy clipboard support before showing a manual fallback. */
    }
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(field);
  field.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
  } finally {
    field.remove();
  }
}
