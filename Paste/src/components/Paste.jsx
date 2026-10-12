import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { addToPastes, removeFromPastes } from "../redux/pasteSlice";
import PasteActions from "./PasteActions";
export default function Paste() {
  const pastes = useSelector((s) => s.paste.pastes),
    [search, setSearch] = useState(""),
    [sort, setSort] = useState("newest");
  const dispatch = useDispatch();
  const filtered = pastes
    .filter((p) =>
      `${p.title} ${p.content}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : sort === "oldest"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt),
    );
  function remove(paste) {
    dispatch(removeFromPastes(paste._id));
    toast(
      (t) => (
        <span>
          Paste deleted.{" "}
          <button
            className="text-button"
            onClick={() => {
              dispatch(addToPastes(paste));
              toast.dismiss(t.id);
            }}
          >
            Undo
          </button>
        </span>
      ),
      { duration: 6000 },
    );
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
          <h1>Good things, saved.</h1>
          <p className="subtitle">
            {pastes.length} {pastes.length === 1 ? "paste" : "pastes"} in your
            library. Find exactly what you need.
          </p>
        </div>
        <Link className="button primary" to="/">
          + New paste
        </Link>
      </div>
      <div className="library-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search pastes"
            placeholder="Search titles and content…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button aria-label="Clear search" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </label>
        <select
          aria-label="Sort pastes"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>
      {filtered.length ? (
        <div className="paste-grid">
          {filtered.map((paste) => (
            <article className="paste-card" key={paste._id}>
              <div className="card-meta">
                <span className="paste-type">TEXT PASTE</span>
                <time dateTime={paste.createdAt}>
                  {new Date(paste.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <Link className="card-title" to={`/pastes/${paste._id}`}>
                <h2>{paste.title}</h2>
              </Link>
              <p className="card-preview">{paste.content}</p>
              <div className="card-footer">
                <Link className="text-link" to={`/?pasteId=${paste._id}`}>
                  Edit
                </Link>
                <Link className="text-link" to={`/pastes/${paste._id}`}>
                  View
                </Link>
                <button
                  className="text-button danger"
                  onClick={() => remove(paste)}
                >
                  Delete
                </button>
              </div>
              <PasteActions paste={paste} />
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <h2>{search ? "No matches yet." : "Your next idea belongs here."}</h2>
          <p>
            {search
              ? "Try another word or clear your search."
              : "Create your first paste to start your collection."}
          </p>
          {search ? (
            <button className="button secondary" onClick={() => setSearch("")}>
              Clear search
            </button>
          ) : (
            <Link className="button primary" to="/">
              Create a paste →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
