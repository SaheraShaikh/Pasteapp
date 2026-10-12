import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Navbar() {
  const count = useSelector((s) => s.paste.pastes.length);
  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <span className="brand-icon">P</span>paste
        <span className="brand-dot">.</span>
      </NavLink>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>
          New paste
        </NavLink>
        <NavLink to="/pastes">
          My library <span className="badge">{count}</span>
        </NavLink>
      </nav>
      <span className="local-label">● Local workspace</span>
    </header>
  );
}
