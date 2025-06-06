import { createSignal, Show, onCleanup } from "solid-js";
import { io, Socket } from "socket.io-client";
import { UnitStore } from "~/components/units-store.component";
import { MapComponent } from "~/components/map.component";

export default function Match() {
  let socket: Socket | null = null;

  const [connected, setConnected] = createSignal(false);
  const [waiting, setWaiting] = createSignal(false);
  const [gameState, setGameState] = createSignal<any>(null);
  const [movementTurn, setMovementTurn] = createSignal<boolean>(true);

  const connect = () => {
    setWaiting(() => true);
    ioInit();
  };

  const finishMovement = () => {
    setMovementTurn(false);
  };

  const finishTurn = () => {
    socket?.emit("finishTurn");
    setMovementTurn(true);
  };

  const ioInit = () => {
    socket = io("ws://localhost:3100/match");
    socket.connect();

    socket.on("connect", () => {
      setConnected(() => true);
      console.log("Connected to match API");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from match API");
      setConnected(() => false);
      setWaiting(() => false);
    });

    socket.on("matchStart", (data) => {
      console.log("Received message:", data);
      setWaiting(false);
      setGameState(() => data);
    });

    socket.on("matchUpdate", (data) => {
      console.log("Received message:", data);
      setGameState((prev) => ({ ...prev, ...data }));
    });

    socket.on("matchEnd", (data) => {
      console.log("Received message:", data);
      setGameState(() => data);
    });
  };

  onCleanup(() => {
    socket?.disconnect();
  });

  return (
    <main class="size-full text-center mx-auto text-gray-700 p-4 flex flex-col items-center justify-center gap-y-8 p-8">
      <Show when={connected() && !waiting()}>
        <section class="size-full flex">
          <div class="flex flex-col w-4/5 items-center justify-center gap-8">
            <header class="w-full">
              <h1 class="text-3xl font-bold">Match in Progress</h1>

              <div class="flex items-center justify-center gap-8">
                <h2 class="text-lg text-white font-bold leading-6">
                  Player:
                  <small class="block text-sky-100 text-sm">
                    {gameState()?.player.name}
                  </small>
                </h2>

                <h2 class="text-lg text-white font-bold leading-6">
                  Gold:
                  <small class="block text-sky-100 text-sm">
                    {gameState()?.playerGold}
                  </small>
                </h2>

                <h2 class="text-lg text-white font-bold leading-6">
                  Enemy:
                  <small class="block text-sky-100 text-sm">
                    {gameState()?.enemy.name}
                  </small>
                </h2>
              </div>
            </header>

            <div class="size-full overflow-auto">
              {/* <ul class="flex gap-4 flex-wrap">
                  <For each={gameState()?.units}>
                      {(item, index) =>
                        <li class={`bg-white shadow-md rounded-lg p-4 text-left ${item.state.playerId === gameState()?.player.id ? 'border-2 border-sky-600' : 'border-2 border-red-600'}`}>
                            <h3 class="text-xl font-semibold">{item.unit.name}</h3>
                            <div class="text-sm text-gray-500 pl-4">
                                <p>Health: {item.unit.health}/{item.state.health}</p>
                                <p>Attack: {item.unit.attack}</p>
                                <p>Defense: {item.unit.defense}</p>
                            </div>
                        </li>
                      }
                  </For>
                </ul> */}
              <MapComponent
                map={gameState()?.map}
                movementTurn={movementTurn()}
                units={gameState().units}
                playerId={gameState().player.id}
                activeTurn={gameState()?.activeTurn}
                socket={socket}
              />
            </div>
          </div>

          <span class="absolute left-4 top-16 text-white font-bold leading-6 rounded-full border border-white py-2 px-4 bg-white/60">
            {gameState()?.activeTurn ? "Your turn" : "Enemy turn"}
          </span>

          <Show when={gameState()?.activeTurn && socket}>
            <aside class="w-1/5 h-full flex flex-col bg-gray-100 p-4 shadow-md gap-4">
              <UnitStore
                units={gameState()?.store}
                playerGold={gameState()?.playerGold}
                socket={socket}
              />

              {movementTurn() ? (
                <button
                  onClick={finishMovement}
                  class="w-full text-sky-600 hover:bg-sky-600 hover:text-sky-300 rounded-md border-2 border-sky-600 px-4 py-2 cursor-pointer"
                >
                  Finish Movements
                </button>
              ) : (
                <button
                  onClick={finishTurn}
                  class="w-full text-sky-600 hover:bg-sky-600 hover:text-sky-300 rounded-md border-2 border-sky-600 px-4 py-2 cursor-pointer"
                >
                  Finish Turn
                </button>
              )}
            </aside>
          </Show>
        </section>
      </Show>

      <Show when={!connected() && !waiting()}>
        <h1 class="text-3xl font-bold">Welcome to the Match Page</h1>

        <button
          onClick={connect}
          class="text-sky-600 hover:bg-sky-600 hover:text-sky-300 rounded-md border-2 border-sky-600 px-4 py-2 cursor-pointer"
        >
          Connect
        </button>
      </Show>

      <Show when={waiting()}>
        <h1 class="text-3xl font-bold">Waiting for a match...</h1>
        <p class="text-gray-500">Please wait while we find a match for you.</p>
      </Show>
    </main>
  );
}
