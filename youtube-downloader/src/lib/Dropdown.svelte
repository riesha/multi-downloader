<script>
  import { fade } from "svelte/transition";
  import { mode } from "../store";
  const modes = [
    { site: "youtube", mode: "yt" },
    { site: "twitter", mode: "tw" },
    { site: "soundcloud", mode: "sc" },
  ];
  let idx = 0;

  $: {
    mode.set(modes[idx].mode);
  }
</script>

<div class="header">
  <div class="site">
    <div class="arrow">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <i
        class="fa-solid fa-angle-up"
        class:hidden={idx === 0}
        on:click={() => (idx -= 1)}
      />
    </div>
    {#key idx}
      <h1 in:fade>{modes[idx].site}</h1>
    {/key}

    <div class="arrow">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <i
        class="fa-solid fa-angle-down"
        class:hidden={idx === modes.length - 1}
        on:click={() => (idx += 1)}
      />
    </div>
  </div>
  &nbsp;
  <h1>downloader</h1>
</div>

<style>
  .arrow {
    transition: opacity 3s;
    opacity: 50%;
  }
  .hidden {
    visibility: hidden;
    opacity: 0%;
  }
  .site h1 {
    margin-block: 0;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .site {
    display: flex;
    flex-direction: column;
  }
</style>
