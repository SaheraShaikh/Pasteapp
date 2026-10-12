import { useState } from "react";
import toast from "react-hot-toast";
import { copyText, createShareUrl } from "../utils/sharing";
export default function PasteActions({ paste }) {
  const [busy, setBusy] = useState(false),
    [link, setLink] = useState(""),
    [opened, setOpened] = useState(false);
  async function copy() {
    try {
      await copyText(paste.content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy. Select the text and copy it manually.");
    }
  }
  async function share() {
    setBusy(true);
    setOpened(true);
    try {
      const url = createShareUrl(paste);
      setLink(url || "");
      await copyText(url || `${paste.title}\n\n${paste.content}`);
      toast.success(
        url
          ? "Share link copied!"
          : "Too large for a link. Text copied to share instead.",
      );
    } catch {
      toast.error(
        "Could not copy automatically. Select the link or text below.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function nativeShare() {
    try {
      await navigator.share(
        link
          ? { title: paste.title, url: link }
          : { title: paste.title, text: paste.content },
      );
    } catch (e) {
      if (e.name !== "AbortError")
        toast.error("Sharing unavailable. Copy the link or text instead.");
    }
  }
  return (
    <>
      <div className="action-group">
        <button className="button secondary" onClick={copy}>
          Copy text
        </button>
        <button className="button secondary" onClick={share} disabled={busy}>
          {busy ? "Sharing…" : "Share ↗"}
        </button>
      </div>
      {opened && (
        <div className="share-box">
          <label>
            {link ? "Share this snapshot" : "Copy this text to share"}
            {link ? (
              <input readOnly value={link} onFocus={(e) => e.target.select()} />
            ) : (
              <textarea
                readOnly
                value={`${paste.title}\n\n${paste.content}`}
                onFocus={(e) => e.target.select()}
              />
            )}
          </label>
          <small>
            {link
              ? "Anyone with this link can read its text. Future edits won’t change this snapshot."
              : "This paste is too large for a share link. Send its text directly."}
          </small>
          <div className="action-group">
            {typeof navigator.share === "function" && (
              <button className="text-button" onClick={nativeShare}>
                Open share menu ↗
              </button>
            )}
            <button className="text-button" onClick={() => setOpened(false)}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
