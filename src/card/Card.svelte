<script lang="ts">
  import { getContext } from 'svelte/internal'
  import Face from './face/Face.svelte'
  import { getCardContext } from './getCardContext'
  import Glare from './face/Glare.svelte'
  import Holo from './face/Holo.svelte'

  const card = getCardContext()
  const interaction = getContext('interaction')
  export let active = false
  export let style
  export let pagebreak = false
  let loading = true

  const imageLoader = (e) => {
    loading = false
  }

  let card_front_background = './img/UI/CardBackground_Grey.webp'

  if (card.rarity === 'rare') {
    card_front_background = './img/UI/CardBackground_Gold.webp'
  } else if (card.rarity === 'fresh') {
    card_front_background = './img/UI/CardBackground_Fresh.webp'
  }

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

  function transformElement(mouseX, mouseY) {
    let box = tiltBox.getBoundingClientRect()
    x = (mouseY - box.y - box.height / 2) / multiple
    y = -(mouseX - box.x - box.width / 2) / multiple
    mx = mouseX - box.x
    my = mouseY - box.y

    posx = 100 * (mx / box.width)
    posy = 100 * (my / box.height)

    o = 1
  }

  const onMouseMove = (e) => {
    window.requestAnimationFrame(function () {
      transformElement(e.clientX, e.clientY)
    })
  }

  const onMouseLeave = (e) => {
    window.requestAnimationFrame(function () {
      x = 0
      y = 0
      posx = 50
      posy = 50
    })
    o = 0
  }
</script>

<card class:active class:pagebreak {style} on:mousemove={onMouseMove} on:mouseleave={onMouseLeave}>
  <div
    class="tilt"
    style="--mx:{mx}px; --my:{my}px; transform: rotateX({x}deg) rotateY({y}deg);--posx: {posx}%; --posy:{posy}%; --o: {o}"
    bind:this={tiltBox}
  >
    <img
      class="card_back"
      src="./img/UI/CardBack.png"
      alt="The back of an Arty Siege card, showing the logo and splatters"
      loading="lazy"
    />
    <div class="card_front">
      <div>
        <img
          class="rarity_back"
          src={card_front_background}
          aria-hidden="true"
          alt="Background for {card.rarity} card"
          loading="lazy"
        />
      </div>
      <Holo />
      <Face />
      <Glare />
    </div>
  </div>
</card>

<style>
  card {
    display: block;
    /* width: 744px;
    height: 1039px; */
    position: relative;
    perspective: 1000px;
  }
  .pagebreak {
    page-break-after: always;
  }
  .tilt {
    transform-style: preserve-3d;
    transition: all 0.1s;
    width: 100%;
    height: 100%;
    transform-origin: center;
    clip-path: inset(17.75px round 20px);
  }
  @media print {
    card {
      width: 69mm;
      height: 94mm;
      clip-path: inset(3mm);
    }
    .tilt {
      clip-path: unset;
    }
    card::after {
      content: '';
      position: absolute;
      top: 3mm;
      left: 3mm;
      width: 63mm;
      height: 88mm;
      border: 1px solid grey;
      border-radius: 3mm;
    }
  }

  .card_back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    transform-style: preserve-3d;
    transform: rotateY(180deg);
  }
  .card_front {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .rarity_back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
