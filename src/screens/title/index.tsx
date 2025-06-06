import { BackgroundAnimated } from "~/components/background-animated";
import { AmbientSound } from "~/components/ambient-sound";
import { MenuTitle } from "./components/menu.component";

export const TitleScreen = () => {
  const menu = [
    {
      label: "Find a match",
      route: "/heroes",
    },
    {
      label: "Settings",
      route: "/settings",
      disabled: true,
    },
    {
      label: "Exit",
      route: "/logout",
      disabled: true,
    },
  ];
  return (
    <main class="w-screen h-screen">
      <AmbientSound
        sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749213749/title_f7outf.ogg"
        loop={true}
        volume={0.7}
      />
      <BackgroundAnimated video="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749211956/background-animated_dnnxsu.webm" />

      <div class="size-full flex items-center justify-end">
        <MenuTitle options={menu} />
      </div>
    </main>
  );
};
