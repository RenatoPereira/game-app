import { Show } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { A, useNavigate } from "@solidjs/router";
import { IoExitOutline } from "solid-icons/io";
import { io } from "socket.io-client";
import { usePlayerContext } from "~/contexts/player.hook";
import { AmbientSound } from "~/components/ambient-sound";
import { Character } from "~/components/character.component";
import { Title } from "@solidjs/meta";

type Props = {
  onInit: any;
};

export const ConnectMatch = (props: Props) => {
  const navigate = useNavigate();
  const { state: user } = usePlayerContext();
  const { state, search } = useMatchContext();

  const handleSearch = () => {
    let socket = io("ws://localhost:3100/match", {
      query: {
        name: user.name,
        leaderId: user.hero?.id,
      },
    });

    socket.connect();

    props.onInit(socket);

    search();
  };

  if (!user.hero) {
    navigate("/", { replace: true });
  }

  return (
    <Show
      when={!state.searching && !state.started && !state.finished && user.hero}
    >
      <Title>Find a match - Game</Title>

      <AmbientSound sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749213749/title_f7outf.ogg" />

      <div class="size-full relative flex flex-col items-center gap-y-8 p-8">
        <h1 class="text-4xl text-neutral-200 font-(family-name:--font-orbitron)">
          Find a Match
        </h1>

        <div class="text-lg text-neutral-2 absolute left-8 top-8">
          <A
            href="/"
            class="flex gap-2 items-center hover:-translate-x-2 transition ease-in-out duration-300"
          >
            <IoExitOutline size={24} class="rotate-180" /> Leave
          </A>
        </div>

        <div class="absolute top-48 left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-8">
          <div class="w-72">
            <Character unit={user.hero!} />
          </div>

          <A
            href="/heroes"
            class="relative inline-block after:content-[''] after:block after:bg-neutral-200 after:absolute after:top-full after:left-0 after:w-full after:h-px after:transition-transform after:duration-150 after:ease-in after:scale-x-0 after:origin-center hover:after:scale-x-100"
          >
            Change character
          </A>
        </div>

        <button
          class="absolute bottom-8 right-8 text-2xl text-indigo-100 font-(family-name:--font-orbitron) rounded-full size-32 border border-neutral-200/50 cursor-pointer before:content-[''] before:block before:absolute before:inset-0 before:size-full before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300 before:bg-neutral-200/25 before:easy-in-out before:rounded-full"
          onClick={handleSearch}
        >
          Ready
        </button>
      </div>
    </Show>
  );
};
