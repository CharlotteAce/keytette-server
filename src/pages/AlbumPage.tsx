import { useParams } from "react-router-dom";
import { buildAlbums } from "../utils/jacket";
import { usePlayerStore } from "../store/playerStore";

export const AlbumPage: React.FC = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const play = usePlayerStore((s) => s.play);

  // 指定ディレクトリのみ取得
  const modules = import.meta.glob(
    "/src/assets/other_albums/*/*",
    {
      eager: true,
      import: "default",
    }
  ) as Record<string, string>;

  const albums = buildAlbums(modules);

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
    <div>
      <h1>{album.name}</h1>

      {/* ジャケット */}
      {album.jacketUrl && (
        <img
          src={album.jacketUrl}
          alt={album.name}
          style={{ width: "300px" }}
        />
      )}

      {/* 楽曲一覧 */}
      <ul>

        {mp3Files.map((file) => {
          const name = (file.split("/").pop() ?? "").replace(/\.mp3$/i, "");33;

          return (
            <li
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};