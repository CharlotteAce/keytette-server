import { useParams } from "react-router-dom";
import { buildAlbums } from "../utils/jacket";
import { usePlayerStore } from "../store/playerStore";
import "./AlbumPage.css";

export const AlbumPage: React.FC = () => {
  const { category, albumName } = useParams<{ category: string; albumName: string }>();
  const play = usePlayerStore((s) => s.play);

  // 指定ディレクトリのみ取得
  const modules = import.meta.glob(
    "/src/assets/albums/*/*/*",
    {
      eager: true,
      as: "url",
    }
  ) as Record<string, string>;

  const albums = buildAlbums(modules).filter(
    (a) => a.category === category
  );

  // 該当アルバムを探す
  const album = albums.find((a) => a.name === albumName);

  if (!album) {
    return <div>Album not found</div>;
  }

  // mp3だけ抽出（とりあえず）
  const mp3Files = album.files.filter((f) =>
    f.toLowerCase().endsWith(".mp3")
  );

  return (
    <div className="album-page">
      {/* ジャケット */}
      {album.jacketUrl && (
        <img
          src={album.jacketUrl}
          alt={album.name}
        />
      )}
      <h1>{album.name}</h1>

      {/* 楽曲一覧 */}
      <div className="track-grid">
        {mp3Files.map((file) => {
          const name = (file.split("/").pop() ?? "").replace(/\.mp3$/i, "");

          return (
            <div className="track"
              key={file}
              style={{ cursor: "pointer" }}
              onClick={() =>
                play({
                  title: name,
                  src: file,
                  artwork: album.jacketUrl,
                })
              }
            >
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
};