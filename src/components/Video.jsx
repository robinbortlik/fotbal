import { useState } from "react";
import { Icon } from "./Icons.jsx";

/* Video z YouTube. Do kliknutí se nic od YouTube nenačítá (ani náhled) — dětský web,
   žádné sledování předem. Pak youtube-nocookie.com bez doporučených videí jiných kanálů.
   v = { id, title, channel, lang?, start?, end?, vertical? } — viz src/scenes/videos.js */
export function Video({ v }) {
  const [on, setOn] = useState(false);
  const src =
    `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0` +
    (v.start ? `&start=${v.start}` : "") +
    (v.end ? `&end=${v.end}` : "");
  return (
    <div className={"video" + (v.vertical ? " vertical" : "")}>
      {on ? (
        <iframe
          src={src}
          title={v.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button className="video-btn" onClick={() => setOn(true)}>
          <span className="video-play">
            <Icon name="play" size={34} />
          </span>
          <span className="video-text">
            <b>{v.title}</b>
            <span>
              {v.channel}
              {v.lang === "EN" ? ", anglicky" : v.lang === "" ? ", beze slov" : ""}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

export default Video;
