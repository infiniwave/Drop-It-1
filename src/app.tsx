import "./app.css";
import { useEffect, useRef, useState } from "preact/hooks";

import { Countdown } from "./components/Countdown";

import YouTubePlayer from "youtube-player";
import { YouTubePlayer as YouTubePlayerType } from "youtube-player/dist/types";

let player: YouTubePlayerType;

export function App() {
  const [primed, setPrimed] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [syncTime, setSyncTime] = useState<number | null>(null);

  const videoRef = useRef<HTMLDivElement>(null);

  // Component mounted
  useEffect(() => {
    const ticker = setInterval(() => {
      const newDate = new Date();

      setCurrentDate(newDate);

      if (syncTime && targetDate && primed) {
        if (newDate.getTime() >= targetDate!.getTime() - syncTime! * 1000) {
          player.playVideo();
        }
      }
    }, 50);

    // DOM loaded, load video
    if (!player && videoRef.current) {
      player = YouTubePlayer("video");
      player.loadVideoById("3_-a9nVZYjk");
    }

    return () => clearInterval(ticker);
  }, [syncTime, targetDate]);

  function changeTargetDate(e: Event) {
    console.log(e.target);
    setTargetDate(new Date((e.target as HTMLInputElement).value));
  }

  function changeSyncTime(e: Event) {
    setSyncTime((e.target as HTMLInputElement).valueAsNumber);
  }

  return (
    <>
      <Countdown currentDate={currentDate} targetDate={targetDate} />
      <main className="main">
        <div className="main__video">
          <div id="video" ref={videoRef}></div>
        </div>
        <aside className="main__panel">
          <h2 className="main__heading">Configuration</h2>
          <form action="#" className="main__form">
            <fieldset className="main__fieldset">
              <label htmlFor="url">Video URL</label>
              <input type="url" name="url" id="url" />
            </fieldset>
            <fieldset className="main__fieldset">
              <div className="main__fieldset-group">
                <label htmlFor="target-date">Target Time</label>
                <input type="datetime-local" name="target-date" id="target-date" onInput={changeTargetDate} />
              </div>
              <div className="main__fieldset-group">
                <label htmlFor="drop-time">Video Sync Time</label>
                <input type="number" name="drop-time" id="drop-time" onInput={changeSyncTime} />
              </div>
            </fieldset>
          </form>
          <main className="main__controls">
            <button className="main__unprime-btn">Unprime</button>
            <button className="main__prime-btn">Prime</button>
          </main>
        </aside>
      </main>
      <footer className="footer"></footer>
    </>
  );
}
