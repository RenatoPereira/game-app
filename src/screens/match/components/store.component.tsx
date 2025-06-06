import { Socket } from "socket.io-client";
import { useMatchContext } from "../contexts/match.hook";
import { Accessor, For } from "solid-js";
import { Card } from "~/components/card.component";
import { Unit } from "~/types/unit.type";

type Props = {
  socket: Accessor<Socket | null>;
};

export const StoreMatch = (props: Props) => {
  const { battle } = useMatchContext();

  const cardAction = (unit: Unit) => {
    props.socket()?.emit("buyUnit", unit);
  };

  return (
    <aside
      class={`absolute bottom-0 left-48 right-48 transition duration-300 translate-y-1/2 hover:-translate-y-4`}
    >
      <ul class="w-full flex items-end justify-center flex-nowrap">
        <For each={battle.store}>
          {(item, index) => {
            return (
              <li class="block transition duration-300 scale-95 translate-y-20 origin-bottom hover:scale-100 hover:translate-y-0">
                <Card
                  unit={item}
                  disabled={item.price > battle.gold}
                  action={cardAction}
                />
              </li>
            );
          }}
        </For>
      </ul>
    </aside>
  );
};
