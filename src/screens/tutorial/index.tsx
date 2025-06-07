import { useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { BackgroundAnimated } from "~/components/background-animated";
import { Dialog, DialogDirection } from "~/components/dialog.component";

const TUTORIAL_KEY = "GAME_TUTORIAL_DONE";

export const TutorialScreen = () => {
  let activeDialogIndex = 0;

  const navigate = useNavigate();
  const [activeDialog, setActiveDialog] = createSignal<
    (typeof dialogs)[number] | null
  >(null);

  const speecher = {
    name: "Regis",
    asset:
      "https://res.cloudinary.com/dyfphd7ir/image/upload/v1749325860/dialog_rk2goc.webp",
    direction: DialogDirection.right,
  };

  const nextTutorial = () => {
    setActiveDialog(dialogs[++activeDialogIndex]);
  };

  const finishTutorial = () => {
    if (typeof localStorage != "undefined") {
      localStorage.setItem(TUTORIAL_KEY, "true");
      navigate("/title");
    }
  };

  const dialogs = [
    {
      ...speecher,
      content:
        "Hello, brave new player! Welcome to the arena! Get ready to dive into a world of strategic battles and intense real-time action. We're thrilled to have you join us!",
      action: nextTutorial,
    },
    {
      ...speecher,
      content:
        "In this game, you'll engage in thrilling real-time board game battles against other players. It's all about strategy and quick thinking! You'll have a movement turn to position your units, an attack turn to unleash devastation on your foes, and then you'll finish your turn, waiting for your opponent's next move. Outwit your rivals and dominate the board!",
      action: nextTutorial,
    },
    {
      ...speecher,
      content:
        "Ready to jump into the fray? To start a battle, first, you'll need to choose your hero. Pick the one that best suits your playstyle! Once you've made your choice, hit \"Ready\" and then simply wait for another player to join your lobby. May the best strategist win!",
      action: finishTutorial,
    },
  ];

  onMount(() => {
    if (typeof localStorage != "undefined") {
      const tutorialDone = localStorage.getItem(TUTORIAL_KEY);

      if (tutorialDone) {
        navigate("/title");
      } else {
        setActiveDialog(dialogs[0]);
      }
    }
  });

  return (
    <main class="w-screen h-screen">
      <BackgroundAnimated video="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749211956/background-animated_dnnxsu.webm" />

      <div class="size-full flex items-center justify-end">
        <Show when={activeDialog()}>
          <Dialog {...activeDialog()!} />
        </Show>
      </div>
    </main>
  );
};
