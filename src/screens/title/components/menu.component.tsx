import { A } from "@solidjs/router";
import { For } from "solid-js";

type Props = {
  options: Option[];
};

type Option = {
  route: string;
  label: string;
  disabled?: boolean;
};

export const MenuTitle = (props: Props) => {
  return (
    <ul class="flex flex-col items-end gap-y-6 py-4 px-12">
      <For each={props.options}>
        {(item) => (
          <li class="relative text-lg text-right text-neutral-200 font-(family-name:--font-orbitron)">
            {!item.disabled ? (
              <A
                href={item.route}
                class="inline-block after:content-[''] after:block after:bg-neutral-200 after:absolute after:top-full after:left-0 after:w-full after:h-px after:transition-transform after:duration-150 after:ease-in after:scale-x-0 after:origin-right hover:after:scale-x-100"
              >
                {item.label}
              </A>
            ) : (
              <span class="line-through cursor-not-allowed">{item.label}</span>
            )}
          </li>
        )}
      </For>
    </ul>
  );
};
