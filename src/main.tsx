import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { App } from "./App";
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
      <Player />
    </BrowserRouter>
  </React.StrictMode>
);