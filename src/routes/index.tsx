import { component$, useClientEffect$, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { uuid } from "uuidv4";
import ProfileManager from "~/classes/ProfileManager";
import VideoManager from "~/classes/VideoManager";
import { Countdown } from "~/components/Countdown";

interface Store {
  primed: boolean;
  currentDate: Date;
  targetDate: Date | null;
  name: string | null;
  videoUrl: string | null;
  syncTime: number | null;
}

export default component$(() => {
  const store = useStore<Store>({
    primed: false,
    videoUrl: null,
    name: null,
    currentDate: new Date(),
    targetDate: null,
    syncTime: null,
  });

  const profilesModalShown = useStore({ shown: false });

  const videoRef = useSignal<HTMLDivElement>();

  useClientEffect$(({ track }) => {
    const state = track(store);
    const ticker = setInterval(() => {
      store.currentDate = new Date();

      if (state.syncTime && state.targetDate && state.primed) {
        if (state.currentDate.getTime() >= state.targetDate.getTime() - state.syncTime * 1000) {
          VideoManager.play();

          const correctTime = Math.round((state.syncTime - (state.targetDate.getTime() - state.currentDate.getTime()) / 1000 + Number.EPSILON) * 100) / 100;

          VideoManager.validatePlaytime(correctTime);
        }
      }
    }, 50);

    // DOM loaded, load video
    if (!VideoManager.initialized && videoRef.value) {
      // VideoManager.init("https://youtu.be/3_-a9nVZYjk", "video");
    }

    return () => clearInterval(ticker);
  });

  useClientEffect$(({ track }) => {
    const state = track(() => store.videoUrl);

    if (!state) return;

    // DOM loaded, load video
    if (!VideoManager.initialized && videoRef.value) {
      VideoManager.init(state, "video");
    } else {
      VideoManager.load(state, "video");
    }
  });

  const defaultProfile = ProfileManager.getPrimedProfile() || ProfileManager.load(undefined);

  return (
    <>
      <Countdown currentDate={store.currentDate} targetDate={store.targetDate} />
      <main class="main">
        <div class="main__video">
          <div id="video" ref={videoRef}></div>
        </div>
        <aside class="main__panel" data-disabled={store.primed}>
          <h2 class="main__heading">Configuration</h2>
          <form action="#" class="main__form">
            <fieldset class="main__fieldset" disabled={store.primed}>
              <label for="title">Name</label>
              <input type="title" name="title" id="title" onInput$={(e) => (store.name = (e.target as HTMLInputElement).value)} />
            </fieldset>
            <fieldset class="main__fieldset" disabled={store.primed}>
              <label for="url">Video URL</label>
              <input type="url" name="url" id="url" onInput$={(e) => (store.videoUrl = (e.target as HTMLInputElement).value)} />
            </fieldset>
            <fieldset class="main__fieldset profiles" disabled={store.primed}>
              <label for="profiles">Load Profile</label>
              <div class="main__fieldset-group">
                <select name="profiles" id="profiles">
                  {defaultProfile != null ? <option value={defaultProfile.id}>{defaultProfile.name}</option> : null}
                  {ProfileManager.getAll().map((profile) => (
                    <option value={profile.id}>{profile.name}</option>
                  ))}
                </select>
                <div style="display: flex; gap: 0.5em">
                  <button type="button" onClick$={() => (profilesModalShown.shown = true)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick$={() => {
                      const id = uuid();
                      ProfileManager.save(id, {
                        id: id,
                        name: store.name!,
                        date: store.targetDate!.getTime(),
                        videoUrl: store.videoUrl!,
                        syncTime: store.syncTime!,
                      });
                    }}
                    disabled={!store.targetDate || !store.syncTime || !store.videoUrl}
                  >
                    Save
                  </button>
                </div>
              </div>
            </fieldset>
            <fieldset class="main__fieldset" disabled={store.primed}>
              <div class="main__fieldset-group">
                <label for="target-date">Target Time</label>
                <input
                  type="datetime-local"
                  name="target-date"
                  id="target-date"
                  onInput$={(e) => (store.targetDate = new Date((e.target as HTMLInputElement).value))}
                />
              </div>
              <div class="main__fieldset-group">
                <label for="drop-time">Video Sync Time</label>
                <input type="number" name="drop-time" id="drop-time" onInput$={(e) => (store.syncTime = (e.target as HTMLInputElement).valueAsNumber)} />
              </div>
            </fieldset>
          </form>
          <div class="main__controls">
            <button class="main__unprime-btn" disabled={!store.primed} onClick$={() => (store.primed = false)}>
              Unprime
            </button>
            <button class="main__prime-btn" disabled={store.primed} onClick$={() => (store.primed = true)}>
              Prime
            </button>
          </div>
        </aside>

        <div class={"profiles-modal" + (profilesModalShown.shown ? " profiles-modal--shown" : "")}>
          <div class="profiles-modal__content">
            <h2 class="main__heading">Profiles</h2>

            <button class="profiles-modal__close-btn" onClick$={() => (profilesModalShown.shown = false)}>
              ✕
            </button>
          </div>
        </div>
      </main>
    </>
  );
});

export const head: DocumentHead = {
  title: "Drop It",
  meta: [
    {
      name: "description",
      content:
        "Drop your hands when the beat drops by itself, Drop It is a simple web app that automates syncing any part of a YouTube video (such as a beat drop) to any date.",
    },
    {
      name: "author",
      content: "Emperor of Bluegaria (Jack H.)",
    },
  ],
};
