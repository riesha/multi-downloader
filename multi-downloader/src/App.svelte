<script>
  import Dropdown from "./lib/Dropdown.svelte";
  import { mode } from "./store";
  import axios from "axios";
  let link = "";
  let valid = false;
  let processing = false;
  let output = "";
  const endpoint = "http://127.0.0.1:3000/api";

  function link_isvalid(link, mode) {
    if (link === "") {
      return false;
    }
    switch (mode) {
      case "yt":
        return link.match(
          /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[^&\s]+).*)|(?:v(\/.*))|(channel\/.+)|(?:user\/(.+))|(?:results\?(search_query=.+))))?)|(?:youtu\.be(\/.*)?))/g
        );
        break;
      case "tw":
        return link.match(
          /(https?:\/\/(?:www.)?twitter\.com\/.*\/status(?:es)?\/([^\/\?\D]+))/
        );
        break;
      case "sc":
        return link.match(
          /(https?:\/\/(?:www.)?soundcloud.com\/[\w-]+\/?(?:sets\/)?[\w-]+)/
        );
        break;
    }
  }

  const submitAPI = async () => {
    output = "";
    processing = true;
    axios
      .post(
        endpoint,
        {
          link: link,
          mode: $mode,
        },
        {
          responseType: "blob",
        }
      )
      .then(function (response) {
        processing = false;
        const file = window.URL.createObjectURL(response.data);
        output = file;
        console.log(response);
      })
      .catch(function (error) {
        processing = false;
        console.log(error);
      });
  };
  $: {
    valid = link_isvalid(link, $mode);
  }
</script>

<main>
  <header>
    <Dropdown />
  </header>
  <section>
    <div class="input">
      <form>
        <input
          type="text"
          class="text"
          bind:value={link}
          placeholder="insert link..."
        /><input
          type="submit"
          class="button"
          value="send"
          disabled={!valid}
          on:click|preventDefault={submitAPI}
        />
      </form>
    </div>
    {#if processing}
      <p>processing request...</p>
    {/if}
    {#if output != ""}
      <div class="download">
        <a href={output} download>Download</a>
        <i class="fa-solid fa-arrow-down" />
      </div>
    {/if}
  </section>
  <footer>
    <p>made with 💝 by <a href="https://github.com/riesha">riesha</a></p>
  </footer>
</main>

<style>
  ::placeholder {
    color: aliceblue;
    font-family: consolas;
  }
  :global(body) {
    background-color: black;
    color: aliceblue;
  }
  a {
    text-decoration: none;
    color: aliceblue;
    font-family: consolas;
  }
  a:hover {
    text-decoration: underline;
  }
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
    width: 50%;
    margin-top: 20vmin;
    font-family: consolas;
  }
  header {
    text-align: center;
    margin-bottom: 1rem;
  }
  footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  section {
    text-align: center;
  }
  .text {
    width: 50rem;
  }
  .button {
    width: 25%;
    transition: backdrop-filter 0.2s ease-in-out;
  }
  .button:disabled {
    opacity: 20%;
  }
  .button:hover {
    cursor: pointer;
    transition: backdrop-filter 0.2s ease-in-out;
    backdrop-filter: invert(20%);
  }
  input {
    background-color: inherit;
    color: inherit;
    padding-inline: 1rem;
    width: 100%;
    height: 2.5rem;
    font-size: 1.2rem;
    border-radius: 5rem;
    border: 2px solid aliceblue;
    outline: none;
  }

  @media (max-width: 480px) {
    .text {
      width: 75vw;
    }
    .button {
      width: 75%;
    }
  }
</style>
