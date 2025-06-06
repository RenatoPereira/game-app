import { createSignal, onCleanup, onMount } from "solid-js";

export const Timer = () => {
  let timerInterval: number | NodeJS.Timeout;
  const [timerSeconds, setTimerSeconds] = createSignal(0);

  const getDisplayTimeBySeconds = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${getDisplayableTime(min)}:${getDisplayableTime(sec)}`;
  };

  function getDisplayableTime(timeValue: number): string {
    return timeValue < 10 ? `0${timeValue}` : `${timeValue}`;
  }

  onMount(() => {
    timerInterval = setInterval(() => {
      setTimerSeconds(timerSeconds() + 1);
    }, 1000);
  });

  onCleanup(() => {
    clearInterval(timerInterval);
  });

  return (
    <span class="proportional-nums">
      {getDisplayTimeBySeconds(timerSeconds())}
    </span>
  );
};
