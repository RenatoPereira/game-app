type Props = {
  image: string;
};

export const Background = (props: Props) => {
  return (
    <img
      src={props.image}
      class="block fixed left-0 top-0 w-screen h-screen -z-10 object-cover"
    />
  );
};
