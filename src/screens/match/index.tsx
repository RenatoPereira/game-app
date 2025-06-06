import { BackgroundAnimated } from "~/components/background-animated";
import { MatchProvider } from "./contexts/match.provider";
import { ConnectMatch } from "./components/connect.component";
import { SearchingMatch } from "./components/searching.component";
import { createSignal, onCleanup } from "solid-js";
import { Socket } from "socket.io-client";
import { BattleMatch } from "./components/battle.component";
import { EndSplash } from "./components/end-splash.component";

export const MatchScreen = () => {
  const [socket, setSocket] = createSignal<Socket | null>(null);

  onCleanup(() => {
    socket()?.disconnect();
    setSocket(null);
  });

  return (
    <main class="w-screen h-screen">
      <BackgroundAnimated video="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749211392/title_zpb4bz.webm" />

      <MatchProvider>
        <div class="relative size-full flex items-center justify-center overflow-hidden">
          <ConnectMatch onInit={setSocket} />
          <SearchingMatch socket={socket} />
          <BattleMatch socket={socket} />
          <EndSplash socket={socket} />
        </div>
      </MatchProvider>
    </main>
  );
};
