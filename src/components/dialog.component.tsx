import { createEffect, createSignal } from "solid-js";
import { Button } from "./button.component";
import { Show } from "solid-js";
import Typewriter from "./type-writer";

type Props = {
  name: string;
  content: string;
  asset: string;
  direction: DialogDirection;
  action: () => void;
};

export enum DialogDirection {
  left = "left",
  right = "right",
}

export const Dialog = (props: Props) => {
  const [showAction, setShowAction] = createSignal(false);

  const enableAction = () => {
    setShowAction(true);
  };

  const handleAction = () => {
    setShowAction(false);
    props.action();
  };

  createEffect(() => {
    setShowAction(false);
  }, [props.content]);

  return (
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-72 rounded-lg border-2 border-neutral-300 bg-indigo-950/85 flex flex-col gap-y-4 p-8">
      <figure class={`absolute bottom-full mb-px ${props.direction}-8`}>
        <img src={props.asset} />
      </figure>

      <h3 class="text-xl text-neutral-200">{props.name}</h3>

      <div class="h-full overflow-x-auto">
        <p class="text-sm leading-6 text-neutral-300">
          <Typewriter text={props.content} onComplete={enableAction} />
        </p>
      </div>

      <Show when={showAction()}>
        <span class="self-end">
          <Button label="Continue" direction="right" action={handleAction} />
        </span>
      </Show>
    </div>
  );
};
