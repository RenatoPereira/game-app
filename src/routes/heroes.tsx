import { query, createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import { HeroesScreen } from "~/screens/heroes";

const getHeroes = query(async () => {
  const units = await fetch(`${import.meta.env.VITE_API_URL}/units`);
  return await units.json();
}, "heroes");

export default function Heroes() {
  const heroes = createAsync(async () => await getHeroes());

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroesScreen units={heroes()} />
    </Suspense>
  );
}
