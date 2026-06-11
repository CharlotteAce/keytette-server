import { Link } from "react-router-dom";
import "./Header.css";

export function Header() {
  return (
    <>
      <header>
        <div id="header-wrapper">
          <div id="title">
            <Link to="/">key-tette</Link>
          </div>
          <div id="subtitle"><a href="https://charlotteace.jp/" target="_blank" rel="noopener noreferrer">on シャーロットエースの部屋</a></div>
        </div>
      </header>
      <div id="header-wrapper">
        <p><small>本ページは、即売会向け試聴サーバ「key-tette」の動作デモサイトです。</small></p>
      </div>
      
    </>
  );
}