import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { PlayerProvider } from "./contexts/player.provider";

export default function App() {
  return (
    <section class="flex flex-col h-screen">
      <PlayerProvider>
        <Router
          root={(props) => (
            <>
              <Suspense>{props.children}</Suspense>
            </>
          )}
        >
          <FileRoutes />
        </Router>
      </PlayerProvider>
    </section>
  );
}
