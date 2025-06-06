import { createEffect } from "solid-js";

type Props = {
  sound: string;
  loop?: boolean;
  volume?: number;
};

export const AmbientSound = (props: Props) => {
  let soundRef: HTMLAudioElement | undefined;

  createEffect(() => {
    if (soundRef && props.volume) {
      soundRef.volume = props.volume;
    }
  });

  return (
    <audio
      class="hidden absolute -left-full -top-full -z-50"
      src={props.sound}
      autoplay={true}
      loop={props.loop}
      ref={soundRef}
    />
  );
};
