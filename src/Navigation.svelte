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
  <div class:showNav>
    <button on:click={() => (showNav = !showNav)}><span /><span /><span /></button>
    <ul class:showNav>
      <li>About</li>
      <li>Gallery</li>
      <li class="print"><button on:click={handlePrint}>Print</button></li>
      <li>What's Next</li>
      <li>How to Play</li>
      <li>Credits</li>
    </ul>
  </div>
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
  nav > div > button {
    display: none;
    background: none;
    border: none;
  }
  nav > div > button > span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;
    background: #ddd;
    border-radius: 3px;
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
    cursor: pointer;
    margin-bottom: 0;
  }

  @media (max-width: 780px) {
    nav {
      align-items: start;
      justify-content: space-between;
    }
    nav > div > button {
      display: block;
      align-self: center;
      margin: 0 10px 0 auto;
    }
    nav > div.showNav > button {
      margin: 17px 10px 8px auto;
    }
    nav > div {
      text-align: right;
      display: block;
      align-self: center;
    }
    ul {
      flex-direction: column;
      display: none;
    }
    .showNav ul {
      display: block;
    }
  }

  @media screen {
  }

  @media print {
    nav {
    }
    ul {
      flex-direction: column;
      display: none;
    }
    nav > div > button {
      display: none;
    }
  }
</style>
