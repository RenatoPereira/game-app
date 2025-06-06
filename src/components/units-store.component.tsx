import { Socket } from "socket.io-client"
import { For } from "solid-js"

type Props = {
    units: Unit[]
    playerGold: number
    socket: Socket | null
}

type Unit = {
    id: string
    class: string
    name: string
    price: number
    health: number
    attack: number
    defense: number
    range: number
    movement: number
}

export const UnitStore = (props: Props) => {
    const onClick = (unit: Unit) => {
        if (props.playerGold >= unit.price) {
            props.socket?.emit("buyUnit", unit);
        } else {
            alert("Not enough gold!");
        }
    }

    return (
        <div class="flex flex-col gap-y-4 w-full">
            <h2 class="text-2xl font-bold">Store</h2>

            <ul class="flex flex-col gap-4">
                <For each={props.units}>
                    {(item, index) =>
                        <li class="bg-white shadow-md rounded-lg p-4 text-left">
                            <h3 class="text-xl font-semibold">{item.name}</h3>
                            <div class="text-sm text-gray-500 pl-4">
                                <p>Price: {item.price}</p>
                                <p>Health: {item.health}</p>
                                <p>Attack: {item.attack}</p>
                                <p>Defense: {item.defense}</p>
                                <p>Range: {item.range}</p>
                                <p>Movement: {item.movement}</p>
                            </div>

                            <button
                                class={`w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${props.playerGold < item.price ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={props.playerGold < item.price}
                                onClick={() => onClick(item)}>
                                Buy
                            </button>
                        </li>
                    }
                </For>
            </ul>
        </div>
    )
}