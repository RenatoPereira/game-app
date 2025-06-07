import { Accessor, createEffect, Show } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { Socket } from "socket.io-client";
// import { StoreMatch } from "./store.component";
import { TbSwords } from "solid-icons/tb";

type Props = {
  socket: Accessor<Socket | null>;
};

export const ActionsMatch = (props: Props) => {
  const { battle, turn, updateTurn } = useMatchContext();

  const finishMovingTurn = () => {
    updateTurn({
      moving: false,
    });
  };

  const finishTurn = () => {
    props.socket()?.emit("finishTurn");
  };

  createEffect(() => {
    if (battle.activeTurn) {
      updateTurn({
        moving: true,
      });
    }
  });

  return (
    <Show when={battle.activeTurn}>
      <footer class="absolute bottom-0 left-0 flex items-center justify-between w-full">
        {/* <StoreMatch socket={props.socket} /> */}

        <button
          class="flex items-center justify-center absolute bottom-8 right-8 text-2xl text-indigo-100 rounded-full size-32 border-2 border-neutral-200/50 cursor-pointer before:content-[''] before:block before:absolute before:inset-0 before:size-full before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300 before:bg-neutral-200/25 before:easy-in-out before:rounded-full"
          onClick={turn.moving ? finishMovingTurn : finishTurn}
        >
          {turn.moving ? (
            <span class="text-5xl text-neutral-300/70">
              <TbSwords />
            </span>
          ) : (
            "Finish turn"
          )}
        </button>
      </footer>
    </Show>
  );
};
