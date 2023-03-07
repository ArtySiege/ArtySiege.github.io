<script lang="ts">
  import Face from './face/Face.svelte'
  import { getCardContext } from './getCardContext'
  import Glare from './face/Glare.svelte'
  import Holo from './face/Holo.svelte'
  import { prefersReducedMotion } from '../stores/interaction'
  import { orientation, resetBaseOrientation } from '../stores/orientation'
  import { activeCardNumber } from '../stores/cards'
  import html2canvas from 'html2canvas'
  // import { saveAs } from 'FileSaver'
  const card = getCardContext()
  $: active = $activeCardNumber === card.number
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

  const clamp = (num, min = -20, max = 20) => Math.min(Math.max(num, min), max)

  const orientate = (e) => {
    const xDeg = e.relative.gamma
    const yDeg = e.relative.beta

    const max = { x: 16, y: 23 }
    x = clamp(xDeg, -max.x, max.x)
    y = clamp(yDeg, -max.y, max.y)
  }

  orientation.subscribe((sub) => {
    if (active) {
      orientate($orientation)
    }
  })

  function transformElement(mouseX, mouseY) {
    let box = tiltBox.getBoundingClientRect()
    if (!$prefersReducedMotion) {
      x = (mouseY - box.y - box.height / 2) / multiple
      y = -(mouseX - box.x - box.width / 2) / multiple
    }
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

  const onClick = (e) => {
    if (active) {
      activeCardNumber.set(undefined)
    } else {
      activeCardNumber.set(card.number)
      // capture()
    }
    active = !active
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

  const capture = () => {
    var svgElem = ref.getElementsByTagName('svg')
    for (const node of svgElem) {
      if (!node.hasAttribute('height') || !node.hasAttribute('width')) {
        const height = window.getComputedStyle(node, null).height
        const width = window.getComputedStyle(node, null).width
        node.setAttribute('width', width)
        node.setAttribute('height', height)
        node.replaceWith(node)
      }
    }

    html2canvas(ref, { removeContainer: true }).then((canvas) => {
      document.body.appendChild(canvas)
    })
  }
</script>

<card
  class:active
  class:pagebreak
  bind:this={ref}
  {style}
  on:click={onClick}
  on:keydown={() => {}}
  on:mousemove={onMouseMove}
  on:mouseleave={onMouseLeave}
>
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
    perspective: calc(1000px * var(--gallery-scale));
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
  card:focus {
    background: transparent;
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
    clip-path: inset(calc(var(--gallery-scale) * 17.75px) round calc(var(--gallery-scale) * 20px));
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
    transform-style: preserve-3d;
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
  @media print {
    card {
      width: 69mm;
      height: 94mm;
      clip-path: inset(3mm);
      --gallery-scale: 1;
    }
    .tilt {
      clip-path: unset;
    }
    card::before {
      content: '';
      position: absolute;
      top: calc(3mm - 0.5px);
      left: calc(3mm - 0.5px);
      width: 63mm;
      height: 88mm;
      border: 1px solid grey;
      border-radius: 3mm;
    }
  }
</style>
