import { Show } from "solid-js";
import { useUnitContext } from "../contexts/unit.hook";
import { AiOutlineCloseCircle } from "solid-icons/ai";

export const UnitDetail = () => {
  const { state, setUnit } = useUnitContext();

  const onClose = () => {
    setUnit(null);
  };

  return (
    <Show when={state.unit}>
      <article class="absolute top-1/2 left-8 -translate-y-1/2 w-56 h-72 flex flex-col gap-y-4 p-2 overflow-hidden rounded-md bg-indigo-950 z-50">
        <button
          class="absolute top-2 right-2 text-xl text-neutral-200 cursor-pointer transition duration-150 hover:scale-105"
          onclick={onClose}
        >
          <AiOutlineCloseCircle size={28} />
        </button>

        <figure class="border-2 border-indigo-900 w-full h-32 flex items-end justify-center">
          <img
            src={state.unit?.unit.assets.splash || ""}
            class="block h-full"
          />
        </figure>

        <p class="text-sm text-neutral-200">
          Name: <strong class="bold">{state.unit?.unit.name}</strong>
          <br />
          Level: <strong class="bold">{state.unit?.state.level}</strong>
          <br />
          Health:{" "}
          <strong class="bold">
            {state.unit?.unit.health}/{state.unit?.state.health}
          </strong>
          <br />
          Attack: <strong class="bold">{state.unit?.unit.attack}</strong>
          <br />
          Defense: <strong>{state.unit?.unit.defense}</strong>
        </p>
      </article>
    </Show>
  );
};
