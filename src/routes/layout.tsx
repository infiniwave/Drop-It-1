import { component$, Slot, useStyles$ } from "@builder.io/qwik";

import styles from "../app.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <>
      <Slot />
      <footer></footer>
    </>
  );
});
