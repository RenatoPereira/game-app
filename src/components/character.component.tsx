import { IoFootstepsOutline } from "solid-icons/io";
import { TbHeart, TbShield, TbSwords } from "solid-icons/tb";
import { JSX } from "solid-js";
import { usePlayerContext } from "~/contexts/player.hook";
import { Unit } from "~/types/unit.type";

type Props = {
  unit: Unit;
};

export const Character = (props: Props) => {
  const { state, setHero } = usePlayerContext();

  const onClick = () => {
    if (state.hero?.id === props.unit.id) return;

    const sound = new Audio(
      "https://res.cloudinary.com/dyfphd7ir/video/upload/v1749213709/character-choosed_zosuia.mp3"
    );

    sound.play();

    setHero(props.unit);
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
      onClick={onClick}
      class={`w-full flex flex-col items-center gap-y-4 transition duration-150 scale-90 origin-bottom hover:opacity-100 hover:scale-100 ${
        state.hero?.id === props.unit.id
          ? "cursor-not-allowed opacity-100 scale-100"
          : "cursor-pointer opacity-50"
      }`}
    >
      <figure class="relative w-full flex items-end">
        <img
          src={props.unit.assets?.full || ""}
          class="relative block w-full z-10"
        />
        <img
          src="https://res.cloudinary.com/dyfphd7ir/image/upload/v1749215233/character-selected_hcyezj.webp"
          class="absolute -bottom-12 left-0 w-full z-0"
        />
      </figure>

      <h3 class="text-lg text-neutral-200 mt-8">{props.unit.name}</h3>

      <div class="flex gap-x-2">
        {renderAttr(props.unit.health, <TbHeart />)}
        {renderAttr(props.unit.attack, <TbSwords />)}
        {renderAttr(props.unit.defense, <TbShield />)}
        {renderAttr(props.unit.movement, <IoFootstepsOutline />)}
      </div>
    </article>
  );
};
