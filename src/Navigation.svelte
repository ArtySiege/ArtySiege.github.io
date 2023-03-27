<script lang="ts">
  import { lang } from './stores/lang'
  let showNav = false
</script>

<nav>
  <img alt="Arty Siege" src="img/Logo.webp" height="60px" />
  <div class:showNav>
    <button on:click={() => (showNav = !showNav)}><span /><span /><span /></button>
    <ul class:showNav>
      <li><a href="#about">About</a></li>
      <li><a href="#gallery">Gallery</a></li>
      <li><a href="#print">Print</a></li>
      <li><a href="#whats-next">What's Next</a></li>
      <li><a href="#how-to-play">How to Play</a></li>
      <li><a href="#credits">Credits</a></li>
    </ul>
  </div>
  <select id="language" bind:value={$lang}>
    <option value="de_EU">Deutsch</option>
    <option value="en_US">English</option>
    <option value="es_EU">Español</option>
    <option value="es_US">Español (MX)</option>
    <option value="fr_EU">Français</option>
    <option value="fr_US">Français (CA)</option>
    <option value="it_EU">Italiano</option>
    <option value="ja_JP">日本語</option>
    <option value="ko_KR">한국어</option>
    <option value="ru_EU">Pусский</option>
    <option value="nl_EU">Nederlands</option>
    <option value="zh_CN">中文（简体)</option>
    <option value="zh_TW">中文（台灣)</option>
  </select>
</nav>

<style>
  nav {
    padding: var(--padding) calc(var(--padding) * 2);
    background: var(--theme-background-accent);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
    /* height: 60px; */
  }
  nav a {
    color: white;
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
    align-items: center;
  }
  li {
    margin: 0 calc(var(--padding) * 2);
    height: fit-content;
  }
  ul select {
    margin: 0;
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
      display: none;
    }
  }
</style>
