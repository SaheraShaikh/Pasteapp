import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addToPastes, updateToPastes } from "../redux/pasteSlice";
function Editor({ paste }) {
  const draftKey = `paste-draft:${paste?._id || "new"}`;
  const [draft] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(draftKey));
      return saved &&
        typeof saved.title === "string" &&
        typeof saved.content === "string"
        ? saved
        : paste;
    } catch {
      return paste;
    }
  });
  const [title, setTitle] = useState(draft?.title || ""),
    [content, setContent] = useState(draft?.content || "");
  useEffect(() => {
    try {
      sessionStorage.setItem(draftKey, JSON.stringify({ title, content }));
    } catch {
      /* Saving a paste remains available if draft storage is unavailable. */
    }
  }, [draftKey, title, content]);
  const dispatch = useDispatch(),
    navigate = useNavigate();
  function save(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Add a title and some content first.");
      return;
    }
    const data = {
      _id: paste?._id || crypto.randomUUID(),
      title: title.trim(),
      content,
      createdAt: paste?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(paste ? updateToPastes(data) : addToPastes(data));
    try {
      sessionStorage.removeItem(draftKey);
    } catch {
      /* Optional draft cleanup. */
    }
    toast.success(paste ? "Changes saved" : "Paste added to your library");
    navigate(`/pastes/${data._id}`);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR IDEAS, WITHIN REACH</p>
          <h1>{paste ? "A little refinement." : "Keep something good."}</h1>
          <p className="subtitle">
            Notes, snippets, and sparks of inspiration. Give them a home.
          </p>
        </div>
        <Link className="text-link" to="/pastes">
          Browse library →
        </Link>
      </div>
      <form
        className="editor-panel"
        onSubmit={save}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") save(e);
        }}
      >
        <div className="editor-top">
          <span className="section-label">
            {paste ? "EDIT PASTE" : "NEW PASTE"}
          </span>
          <span className="subtle">Plain text · Draft kept in this tab</span>
        </div>
        <label className="field-label" htmlFor="paste-title">
          Title
        </label>
        <input
          id="paste-title"
          className="title-input"
          placeholder="Give your paste a name…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
        <label className="field-label" htmlFor="paste-content">
          Content
        </label>
        <textarea
          id="paste-content"
          className="content-input"
          placeholder="Start typing, or paste something worth keeping…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          spellCheck={false}
        />
        <div className="editor-bottom">
          <span className="subtle">
            {content.length.toLocaleString()} characters{" "}
            <span className="keyboard-hint">· Ctrl / ⌘ + Enter to save</span>
          </span>
          <div className="action-group">
            <Link className="button secondary" to="/pastes">
              Cancel
            </Link>
            <button className="button primary" type="submit">
              {paste ? "Save changes" : "Create paste"} →
            </button>
          </div>
        </div>
      </form>
      <div className="helper-row">
        <span>✦ A small space for big ideas.</span>
        <span>Share a snapshot whenever you’re ready.</span>
      </div>
    </>
  );
}
export default function Home() {
  const [params] = useSearchParams();
  const id = params.get("pasteId");
  const paste = useSelector((s) => s.paste.pastes.find((p) => p._id === id));
  if (id && !paste)
    return (
      <div className="empty-state">
        <h1>That paste is no longer here.</h1>
        <p>It may have been deleted or saved in another browser.</p>
        <Link className="button primary" to="/pastes">
          Back to library
        </Link>
      </div>
    );
  return <Editor key={id || "new"} paste={paste} />;
}
