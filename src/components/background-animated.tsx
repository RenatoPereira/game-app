type Props = {
  video: string;
};

export const BackgroundAnimated = (props: Props) => {
  return (
    <video
      src={props.video}
      class="block fixed left-0 top-0 w-screen h-screen -z-10 object-cover"
      muted
      autoplay
      loop
    />
  );
};
