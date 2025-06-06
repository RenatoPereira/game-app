import { useMatchContext } from "../contexts/match.hook";

export const PlayersMatch = () => {
  const { battle } = useMatchContext();

  return (
    <header class="absolute top-0 left-0 bg-indigo-950/30 pb-2 flex justify-between w-full overflow-hidden">
      <section class="flex gap-x-4 w-1/3">
        <figure
          class={`border-2 ${
            battle.isPlayer ? "border-neutral-200" : "border-indigo-950"
          } w-32 overflow-hidden bg-slate-950 -skew-x-12 -ml-4`}
        >
          <img
            src={battle.player?.getAsset("splash")}
            class="w-full skew-x-12"
          />
        </figure>

        <div class="flex flex-col justify-between pt-4 pb-1">
          <p class="text-lg text-neutral-200 font-bold">
            {battle.player?.getName()}
          </p>
        </div>
      </section>

      <h2 class="text-4xl text-neutral-200 mt-4 text-center">
        {battle.activeTurn ? "Your" : "Enemy"} turn
        <br />
        <span class="text-2xl text-neutral-200 -translate-x-4">
          {battle.gold} <small>G</small>
        </span>
      </h2>

      <section class="flex gap-x-4 w-1/3 justify-end">
        <p class="text-lg text-neutral-200 font-bold py-4">
          {battle.enemy?.getName()}
        </p>

        <figure
          class={`border-2 ${
            !battle.isPlayer ? "border-neutral-200" : "border-indigo-950"
          } w-32 overflow-hidden bg-slate-950 skew-x-12 -mr-4`}
        >
          <img
            src={battle.enemy?.getAsset("splash")}
            class="w-full -skew-x-12"
          />
        </figure>
      </section>
    </header>
  );
};
