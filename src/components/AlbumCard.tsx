import React from "react";
import { Link } from "react-router-dom";
import "./AlbumCard.css";

export type Album = {
  name: string;
  category: string;
  jacketUrl?: string;
};

type Props = {
  album: Album;
};

export const AlbumCard: React.FC<Props> = ({ album }) => {
  return (
    <Link to={`/${album.category}/${album.name}`} className="album-card">
      {album.jacketUrl ? (
        <img src={album.jacketUrl} alt={album.name} />
      ) : (
        <div>No Image</div>
      )}
      <div>{album.name}</div>
    </Link>
  );
};