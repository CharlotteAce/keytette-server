/* 型 */
export type AlbumFile = {
  url: string;
  fileName: string;
};

export type Album = {
  name: string;
  jacketUrl?: string;
  files: string[];
};

/* 内部util */
const extPriority = ["webp", "svg", "png", "heic", "jpg", "bmp"];

const getBaseName = (name: string) =>
  name.replace(/\.[^.]+$/, "").toLowerCase();

const getExt = (name: string) =>
  name.split(".").pop()?.toLowerCase() ?? "";

/* ジャケット選定（仕様準拠） */
export const pickJacket = (files: string[]): string | undefined => {
  const candidates = files
    .map((url) => {
      const fileName = url.split("/").pop() ?? "";
      return {
        url,
        base: getBaseName(fileName),
        ext: getExt(fileName),
      };
    })
    .filter((f) => extPriority.includes(f.ext));

  if (candidates.length === 0) return undefined;

  const score = (f: typeof candidates[number]) => {
    if (f.base === "jacket") return [0, extPriority.indexOf(f.ext)];
    if (f.base.includes("jacket")) return [1, extPriority.indexOf(f.ext)];
    return [2, extPriority.indexOf(f.ext)];
  };

  candidates.sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa[0] !== sb[0]) return sa[0] - sb[0];
    if (sa[1] !== sb[1]) return sa[1] - sb[1];
    return 0;
  });

  return candidates[0].url;
};

/* glob結果 → Album[] */
export const buildAlbums = (
  modules: Record<string, string>
): Album[] => {
  const albumMap: Record<string, string[]> = {};

  for (const path in modules) {
    const parts = path.split("/");
    const albumName = parts[4];

    if (!albumMap[albumName]) albumMap[albumName] = [];
    albumMap[albumName].push(modules[path]);
  }

  return Object.entries(albumMap).map(([name, files]) => ({
    name,
    files,
    jacketUrl: pickJacket(files),
  }));
};