import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { addToPastes } from "../redux/pasteSlice";
import { decodePaste } from "../utils/sharing";
import PasteActions from "./PasteActions";
export default function ViewPaste({ shared = false }) {
  const { id } = useParams(),
    [params] = useSearchParams();
  const stored = useSelector((s) => s.paste.pastes.find((p) => p._id === id));
  const dispatch = useDispatch(),
    navigate = useNavigate();
  let paste = stored;
  if (shared) {
    try {
      paste = decodePaste(params.get("data"));
    } catch {
      paste = null;
    }
  }
  if (!paste)
    return (
      <div className="empty-state">
        <h1>{shared ? "This share link is invalid." : "Paste not found."}</h1>
        <p>
          {shared
            ? "Ask the sender for a fresh link."
            : "It may have been deleted or saved in another browser."}
        </p>
        <Link className="button primary" to="/pastes">
          Back to library
        </Link>
      </div>
    );
  function saveCopy() {
    const copy = {
      ...paste,
      _id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    dispatch(addToPastes(copy));
    toast.success("Saved to your library");
    navigate(`/pastes/${copy._id}`);
  }
  return (
    <>
      <Link className="text-link back-link" to="/pastes">
        ← Back to library
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {shared ? "SHARED SNAPSHOT" : "FROM YOUR COLLECTION"}
          </p>
          <h1 className="view-title">{paste.title}</h1>
          <p className="subtitle">
            {shared
              ? "A snapshot shared with you. Save a copy to keep it."
              : `Created ${new Date(paste.createdAt).toLocaleString()}`}{" "}
            · {paste.content.length.toLocaleString()} characters
          </p>
        </div>
        {shared ? (
          <button className="button primary" onClick={saveCopy}>
            Save to my library +
          </button>
        ) : (
          <Link className="button primary" to={`/?pasteId=${paste._id}`}>
            Edit paste
          </Link>
        )}
      </div>
      <section className="reader-panel">
        <div className="editor-top">
          <span className="section-label">PLAIN TEXT</span>
          <PasteActions paste={paste} />
        </div>
        <pre className="paste-content" tabIndex={0}>
          {paste.content}
        </pre>
      </section>
    </>
  );
}
