import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { App } from "./pages/TopPage";
import { Player } from "./components/Player";
import { AlbumPage } from "./pages/AlbumPage";
import "normalize.css"
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:category/:albumName" element={<AlbumPage />} />
      </Routes>
      <div className="footer">Powered by <a href="https://github.com/CharlotteAce/keytette" target="_blank" rel="noopener noreferrer">key-tette</a> / <a href="https://charlotteace.github.io" target="_blank" rel="noopener noreferrer">charlotteace</a></div>
      <Player />
    </BrowserRouter>
  </React.StrictMode>
);