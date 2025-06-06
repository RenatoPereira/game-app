type Props = {
  action: () => void;
  label: string;
  disabled?: boolean;
};

export const Button = (props: Props) => {
  return (
    <button
      onClick={!props.disabled ? props.action : undefined}
      class={`relative text-base text-slate-200 ${
        !props.disabled
          ? "after:content-[''] after:block after:bg-neutral-200 after:absolute after:top-full after:left-0 after:w-full after:h-px after:transition-transform after:duration-150 after:ease-in after:scale-x-0 hover:after:scale-x-100 cursor-pointer"
          : "line-through cursor-not-allowed"
      }`}
    >
      {props.label}
    </button>
  );
};
