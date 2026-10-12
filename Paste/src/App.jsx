import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Paste from "./components/Paste";
import ViewPaste from "./components/ViewPaste";
import "./App.css";
export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pastes" element={<Paste />} />
            <Route path="/pastes/:id" element={<ViewPaste />} />
            <Route path="/shared" element={<ViewPaste shared />} />
            <Route
              path="*"
              element={
                <div className="empty-state">
                  <h1>Page not found</h1>
                  <a href="#/">Create a paste →</a>
                </div>
              }
            />
          </Routes>
        </main>
        <footer>
          Made for the things you want to keep.
          <span>Saved on this browser.</span>
        </footer>
      </div>
    </HashRouter>
  );
}
