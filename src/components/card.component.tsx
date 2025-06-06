import { IoFootstepsOutline } from "solid-icons/io";
import { TbCoins, TbHeart, TbShield, TbSwords } from "solid-icons/tb";
import { JSX, Show } from "solid-js";
import { Unit } from "~/types/unit.type";

type Props = {
  unit: Unit;
  action: (unit: Unit) => void;
  disabled?: boolean;
};

export const Card = (props: Props) => {
  const handleAction = () => {
    props.action(props.unit);
  };

  const renderAttr = (value: number, icon: JSX.Element) => {
    return (
      <p
        class={`relative flex flex-col border border-indigo-900 rounded-full size-8 flex items-center justify-center bg-indigo-700/50 text-sm text-neutral-300 bold`}
      >
        <span class="opacity-80 text-neutral-200 text-sm -mb-2 -translate-y-2">
          {icon}
        </span>

        {value}
      </p>
    );
  };

  return (
    <article
      class={`relative w-56 h-72 relative flex flex-col gap-y-2 p-2 overflow-hidden rounded-md bg-indigo-950 ${
        props.disabled ? "opacity-80 cursor-not-allowed" : ""
      }`}
    >
      <header class="absolute top-2 left-2 right-2 flex items-center justify-between">
        {renderAttr(props.unit.movement, <IoFootstepsOutline />)}
        {renderAttr(props.unit.price, <TbCoins />)}
        {renderAttr(props.unit.health, <TbHeart />)}
      </header>

      <figure class="border-2 border-indigo-900 w-full h-32 flex items-end justify-center">
        <img src={props.unit.assets?.splash || ""} class="block h-full" />
      </figure>

      <h3 class="text-lg text-neutral-200">{props.unit.name}</h3>

      <footer class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        {renderAttr(props.unit.defense, <TbShield />)}
        {renderAttr(props.unit.attack, <TbSwords />)}
      </footer>

      <Show when={!props.disabled}>
        <button
          class="absolute top-0 left-0 size-full cursor-pointer opacity-0"
          onClick={handleAction}
        >
          Buy unit
        </button>
      </Show>
    </article>
  );
};
