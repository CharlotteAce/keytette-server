import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AlbumList } from "./components/AlbumList";
import { buildAlbums } from "./utils/jacket";
import "./index.css";
import { Player } from "./components/Player";
import { AlbumPage } from "./pages/AlbumPage";


// 1回だけglob
const modules = import.meta.glob("/src/assets/*/*/*", {
  eager: true,
  as: "url",
}) as Record<string, string>;

type Category = {
  key: string;
  title: string;
};

const categories: Category[] = [
  { key: "new_albums", title: "New Albums" },
  { key: "other_albums", title: "Old Albums" },
];

const categoryAlbums = categories.map((cat) => {
  const filtered: Record<string, string> = {};

  for (const path in modules) {
    // /src/assets/{category}/{album}/{file}
    const parts = path.split("/");
    const categoryName = parts[3];

    if (categoryName === cat.key) {
      filtered[path] = modules[path];
    }
  }

  return {
    key: cat.key,
    title: cat.title,
    albums: buildAlbums(filtered),
  };
});

const App: React.FC = () => {
  return (
    <div>
      {categoryAlbums.map((cat) => (
        <AlbumList key={cat.key} title={cat.title} albums={cat.albums} />
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:albumName" element={<AlbumPage />} />
      </Routes>
      <Player />
    </BrowserRouter>
  </React.StrictMode>
);