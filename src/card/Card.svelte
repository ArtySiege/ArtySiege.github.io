<script lang="ts">
  import { getCardContext } from './getCardContext'
  import Glare from './face/Glare.svelte'
  import Holo from './face/Holo.svelte'
  import { prefersReducedMotion, prefersReducedLighting } from '../stores/interaction'
  import { orientation, resetBaseOrientation, isSafari } from '../stores/orientation'
  import { activeCardNumber } from '../stores/cards'
  import Title from './face/Title.svelte'
  const card = getCardContext()
  $: active = $activeCardNumber === card.number
  $: {
    if (active) {
      o = 1
    } else {
      o = 0
    }
  }
  export let style
  export let pagebreak = false
  export let animate = true
  let loading = true

  const imageLoader = (e) => {
    loading = false
  }

  let card_front_background = './img/Merged/' + card.number.toString().padStart(3, '0') + '.webp'

  let img_base = card.img.startsWith('http') ? '' : './img/'
  let front_img = ''

  front_img = img_base + card.img

  const multiple = 10
  let tiltBox: HTMLDivElement
  let x
  let y
  let mx
  let my
  let posx = 50
  let posy = 50
  let o = 0

  const clamp = (num, min = -20, max = 20) => Math.min(Math.max(num, min), max)

  const orientate = (e) => {
    const xDeg = e.relative.beta
    const yDeg = e.relative.gamma

    const max = { x: 16, y: 23 }
    x = clamp(xDeg, -max.x, max.x)
    y = clamp(yDeg, -max.y, max.y)
    posx = (xDeg / max.x) * 10 + 50
    posy = (yDeg / max.y) * 10 + 50
  }

  $: proxyOrientation = active ? orientation : null

  $: proxyOrientation && orientate($orientation)

  function transformElement(mouseX, mouseY) {
    let box = tiltBox.getBoundingClientRect()
    if (!$prefersReducedMotion) {
      x = (mouseY - box.y - box.height / 2) / multiple
      y = -(mouseX - box.x - box.width / 2) / multiple
    }
    if (!$prefersReducedLighting) {
      mx = mouseX - box.x
      my = mouseY - box.y

      posx = 100 * (mx / box.width)
      posy = 100 * (my / box.height)
      o = 1
    }
  }

  const onMouseMove = (e) => {
    if (animate) {
      window.requestAnimationFrame(function () {
        transformElement(e.clientX, e.clientY)
      })
    }
  }

  const onClick = (e) => {
    if (active) {
      activeCardNumber.set(undefined)
    } else {
      activeCardNumber.set(card.number)
    }
    resetBaseOrientation()
  }

  const onMouseLeave = (e) => {
    window.requestAnimationFrame(function () {
      x = 0
      y = 0
      posx = 50
      posy = 50
    })
    o = 0

    // active = false
  }

  let ref: HTMLElement
</script>

<card
  class:active
  class:pagebreak
  class:prefersReducedLighting={$prefersReducedLighting}
  bind:this={ref}
  {style}
  on:click={onClick}
  on:keydown={() => {}}
  on:mousemove={onMouseMove}
  on:mouseleave={onMouseLeave}
  aria-label="{card.name} by {card.artist}"
  id="card_{card.number}"
>
  <div
    class="tilt"
    style="--mx:{mx}px; --my:{my}px; transform: rotateX({x}deg) rotateY({y}deg);--posx: {posx}%; --posy:{posy}%; --o: {o}"
    bind:this={tiltBox}
  >
    <img
      aria-hidden="true"
      class="card_back"
      src="./img/UI/CardBack.webp"
      alt=""
      data-html2canvas-ignore
      loading="lazy"
    />
    <div class="card_front">
      <div>
        <!-- loading=lazy must appear before src -->
        <img
          class="rarity_back"
          loading="lazy"
          src={card_front_background}
          aria-hidden="true"
          alt=""
          data-html2canvas-ignore
          on:load={imageLoader}
        />
      </div>
      {#if !loading}
        {#if !$prefersReducedLighting}
          <Holo />
        {/if}
        <Title />
      {/if}
    </div>
    {#if !$prefersReducedLighting}
      <Glare />
    {/if}
  </div>
</card>

<style>
  card {
    display: block;
    /* width: 744px;
    height: 1039px; */
    position: relative;
    perspective: calc(1000px * var(--gallery-scale));
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    filter: drop-shadow(0px 0px calc(5px * var(--gallery-scale)) black);
  }
  card:focus {
    background: transparent;
  }
  .pagebreak {
    page-break-after: always;
  }
  .tilt {
    will-change: transform;
    transform-style: preserve-3d;
    transition: all 0.1s;
    width: 100%;
    height: 100%;
    transform-origin: center;
    clip-path: inset(calc(var(--gallery-scale) * 17.75px) round calc(var(--gallery-scale) * 20px));
  }
  .card_back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    clip-path: inset(calc(var(--gallery-scale) * 17.75px) round calc(var(--gallery-scale) * 20px));
    /* transform-style: preserve-3d; */
    /* transform: rotateY(180deg) scaleX(-1); */
  }
  .card_front {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    clip-path: inset(calc(var(--gallery-scale) * 17.75px) round calc(var(--gallery-scale) * 20px));
  }
  .card_front :global(*) {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .rarity_back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .active {
    filter: drop-shadow(0px 0px calc(10px * var(--gallery-scale)) goldenrod);
  }
</style>
