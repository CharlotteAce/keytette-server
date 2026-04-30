import React from "react";
import { AlbumList } from "../components/AlbumList";
import { buildAlbums } from "../utils/jacket";
import categories from "../config/categories.json";

const modules = import.meta.glob("/src/assets/albums/**/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

type Category = {
  key: string;
  title: string;
};

const typedCategories = categories as Category[];

const categoryAlbums = typedCategories.map((cat) => {
  const filtered: Record<string, string> = {};

  for (const path in modules) {
    const match = path.match(/albums\/([^/]+)\//);
    const categoryName = match?.[1];

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