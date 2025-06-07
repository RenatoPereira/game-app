import { createSignal, createEffect, onCleanup } from "solid-js";

type Props = {
  text: string;
  delay?: number;
  speed?: number;
  onComplete: () => void;
};

export const Typewriter = (props: Props) => {
  let timeoutId: NodeJS.Timeout;

  const [displayedText, setDisplayedText] = createSignal("");
  const [finished, setFinished] = createSignal(false);

  const speed = props.speed ?? 20;
  const delay = props.delay ?? 500;

  const typeCharacter = () => {
    if (displayedText().length < props.text.length) {
      setDisplayedText(props.text.substring(0, displayedText().length + 1));

      timeoutId = setTimeout(typeCharacter, speed);
    } else {
      props.onComplete();
      setFinished(true);
    }
  };

  createEffect(() => {
    timeoutId = setTimeout(typeCharacter, delay);

    onCleanup(() => {
      clearTimeout(timeoutId);
      setFinished(false);
    });
  });

  createEffect(() => {
    if (props.text !== displayedText() && finished()) {
      setDisplayedText("");
      setFinished(false);
      timeoutId = setTimeout(typeCharacter, delay);
    }
  }, [props.text, finished]);

  return <>{displayedText()}</>;
};

export default Typewriter;
