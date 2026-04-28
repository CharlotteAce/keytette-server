import React from "react";
import { AlbumCard } from "./AlbumCard";
import type { Album } from "./AlbumCard";

type Props = {
  albums: Album[];
  title?: string;
};

export const AlbumList: React.FC<Props> = ({ albums, title }) => {
  return (
    <div className="album-grid">
      {title && <h2 className="album-grid-title">{title}</h2>}

      {albums.map((album) => (
        <AlbumCard key={album.name} album={album} />
      ))}
    </div>
  );
};