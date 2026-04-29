import React from "react";
import { AlbumList } from "../components/AlbumList";
import { buildAlbums } from "../utils/jacket";

const modules = import.meta.glob("/src/assets/albums/*/*/*", {
  eager: true,
  as: "url",
}) as Record<string, string>;

type Category = {
  key: string;
  title: string;
};

const categories: Category[] = [
  { key: "new_albums", title: "新譜" },
  { key: "other_albums", title: "その他の音楽" },
];

const categoryAlbums = categories.map((cat) => {
  const filtered: Record<string, string> = {};

  for (const path in modules) {
    const parts = path.split("/");
    const categoryName = parts[4]; // ←ここも変わる

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

export const App: React.FC = () => {
  return (
    <div className="top-page">
      {categoryAlbums.map((cat) => (
        <AlbumList key={cat.key} title={cat.title} albums={cat.albums} />
      ))}
    </div>
  );
};