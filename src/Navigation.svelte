<script>
  import { printing } from './stores/cards'

  let showNav = false
  const handlePrint = () => {
    printing.set(true)
    setTimeout(window.print, 500)
  }
</script>

<nav>
  <img alt="Arty Siege" src="img/Logo.webp" height="60px" />
  <button on:click={() => (showNav = !showNav)}>Navigation</button>
  <ul class:showNav>
    <li>About</li>
    <li>Gallery</li>
    <li><button on:click={handlePrint}>Print</button></li>
    <li>What's Next</li>
    <li>How to Play</li>
    <li>Credits</li>
  </ul>
</nav>

<style>
  nav {
    padding: var(--padding) calc(var(--padding) * 2);
    background: #130639;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    /* position: sticky; */
    top: 0;
    z-index: 100;
    /* height: 60px; */
  }
  img {
    height: 60px;
  }
  nav > button {
    display: none;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
  }
  li {
    margin: 0 calc(var(--padding) * 2);
  }
  li button {
    background: transparent;
    border: none;
    padding: 0;
    color: white;
    pointer: cursor;
  }

  @media (max-width: 780px) {
    button {
      display: block;
    }
    nav {
      flex-direction: column;
    }
    ul {
      flex-direction: column;
      display: none;
    }
    ul.showNav {
      display: block;
    }
  }
</style>
