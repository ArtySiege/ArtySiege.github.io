<script>
  import { onMount } from 'svelte'
  import { getCardContext } from '../getCardContext'
  import { styles } from '../../stores/style'
  const card = getCardContext()

  let canvas
  let width = 392
  $: {
    if (canvas) {
      const ratio = 1 //Math.ceil(window.devicePixelRatio)
      const context = canvas.getContext('2d')
      if (context) {
        canvas.height = 100 * ratio

        context.font = `${32}px Splatoon1`
        context.letterSpacing = `${0.5}px`
        canvas.width = (392 + 20) * ratio
        context.font = `${32 * ratio}px Splatoon1`
        context.letterSpacing = `${0.5 * ratio}px`
        context.lineWidth = 5 * ratio
        const x = canvas.width / 2
        context.textAlign = 'center'
        const gradient = context.createLinearGradient(x, 0, x, canvas.height)
        gradient.addColorStop('0', '#c6b6d9')
        gradient.addColorStop('0.5', '#4d54a5')
        gradient.addColorStop('1.0', '#423896')
        context.fillStyle = gradient

        card.nameParts.forEach((part, i) => {
          const y = (123 * (i + 1)) / (card.nameParts.length * 2)
          context.strokeText(part, x, y * ratio)
          context.fillText(part, x, y * ratio)
        })
      }
    }
  }
</script>

<div
  class="header-wrapper"
  style="--wrapper-height-scale: {card.nameParts.length > 1 ? 6 : 5.5};--header-scale: {Math.min(1, card.headerScale)}"
>
  <!-- style="--wrapper-height: {card.nameParts.length > 1 ? '6rem' : '5.5rem'}" -->
  <canvas bind:this={canvas} style="display: none" />
  <svg width="392" height={card.nameParts.length > 1 ? '96' : '88'}>
    {#if card.rarity === 'common'}
      <linearGradient id="gradient-{card.number}" gradientTransform="rotate(90)">
        <stop offset="0%" stop-color="#c6b6d9" stop-opacity="1" />
        <stop offset="50%" stop-color="#4d54a5" stop-opacity="1" />
        <stop offset="100%" stop-color="#423896" stop-opacity="1" />
      </linearGradient>
    {/if}
    {#if card.rarity === 'rare'}
      <linearGradient
        id="gradient-{card.number}"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(27) scale(2)"
        x1="40"
        y1="0"
        x2="390"
        y2="100"
      >
        <!-- background-image: repeating-linear-gradient(-63deg, #ffff99, #daa520, #ffff99 50%); -->
        <stop offset="0%" stop-color=" #daa520" stop-opacity="1" />
        <stop offset="50%" stop-color="#ffff99" stop-opacity="1" />
        <stop offset="100%" stop-color="#daa520" stop-opacity="1" />
      </linearGradient>
    {/if}
    {#if card.rarity === 'fresh'}
      <!-- background-image: repeating-linear-gradient(-63deg,#ffff99,#cc3399,#33ffcc,#ffff99 50%); -->
      <linearGradient id="gradient-{card.number}" gradientTransform="rotate(27) scale(1)">
        <!-- background-image: repeating-linear-gradient(-63deg, #ffff99, #daa520, #ffff99 50%); -->
        <stop offset="0%" stop-color=" #ffff99" stop-opacity="1" />
        <stop offset="25%" stop-color="#cc3399" stop-opacity="1" />
        <stop offset="70%" stop-color="#33ffcc" stop-opacity="1" />
        <stop offset="100%" stop-color="#ffff99" stop-opacity="1" />
      </linearGradient>
    {/if}
    <g style="fill: url(#gradient-{card.number})">
      {#each card.nameParts as part, i}
        {@const y = i === 0 ? (card.nameParts.length === 1 ? 0.455 : 0.3) : 0.7}
        <text class="stroke-small" x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">{part}</text>
        <text class="stroke" x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">{part}</text>
        <text class="fill" x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
          {part}
        </text>
      {/each}
    </g>
  </svg>

  <header data-html2canvas-ignore>
    <span class={card.rarity}>{@html card.nameParts.join('<br />')}</span>
  </header>
</div>

<style>
  header {
    position: relative;
    font-size: calc(var(--gallery-scale) * 32px);
    /* color: #aa11ff; */
    font-family: Splatoon1;
    letter-spacing: calc(var(--gallery-scale) * 0.5px);
    transform: scale(var(--header-scale), 1);
    line-height: calc(var(--gallery-scale) * 38px);
  }
  canvas {
    position: absolute;
    transform: scale(var(--header-scale), 1);
  }
  text.stroke-small {
    stroke: var(--shadowColor);
    stroke-width: calc(var(--gallery-scale) * 4.6px);
    stroke-linejoin: round;
    fill: black !important;
    paint-order: stroke fill;
  }
  text.stroke {
    stroke: var(--shadowColor);
    stroke-width: calc(var(--gallery-scale) * 7px);
    stroke-linejoin: round;
    fill: black !important;
    paint-order: stroke fill;
  }
  svg {
    position: absolute;
    font-size: calc(var(--gallery-scale) * 32px);
    /* color: #aa11ff; */
    font-family: Splatoon1;
    letter-spacing: calc(var(--gallery-scale) * 0.5px);
    transform: scale(var(--header-scale), 1);
  }
  header span {
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(#c6b6d9, #4d54a5, #423896);
    color: transparent;
    filter: var(--dropShadow);
    letter-spacing: calc(var(--gallery-scale) * 0.5px);
  }
  span.fresh {
    background-image: repeating-linear-gradient(
      -63deg,
      #ffff99,
      rgba(204, 51, 153, 1),
      rgba(51, 255, 204, 1),
      rgba(255, 255, 153, 1) 50%
    );
    background-position: var(--posx) var(--posy);
    background-size: 400% 200%;
  }
  span.rare {
    background-image: repeating-linear-gradient(-63deg, #ffff99, #daa520, #ffff99 50%);
    background-position: var(--posx) var(--posy);
    background-size: 400% 200%;
  }
  .header-wrapper {
    height: var(--wrapper-height);
    margin-left: calc(var(--gallery-scale) * 2rem);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: calc(100% - var(--gallery-scale) * 16px);
    left: calc(var(--gallery-scale) * 5px);
    top: calc(var(--gallery-scale) * 22px);
    --wrapper-height: calc(16px * 6 * var(--gallery-scale));
  }

  @media screen {
    svg .fill {
      display: none;
    }
  }

  @media print {
    header {
      font-size: 5.42mm;
      letter-spacing: 0.08474576271mm;
      line-height: 6.44mm;
    }
    header span {
      /* --dropShadow: none !important; */
    }
    svg text.fill {
      display: none;
    }
    .header-wrapper {
      margin-left: 5.4237288136mm;
      width: calc(100% - 2.8mm);
      left: 0.8474576271mm;
      top: 3.7288135593mm;
      --wrapper-height: calc(var(--wrapper-height-scale) * 16mm / 5.9);
    }
    svg {
      font-size: 5.42mm;
      letter-spacing: 0.08474576271mm;
    }
    text.stroke {
      stroke-width: 1.5mm;
    }
    text.stroke-small {
      stroke-width: 1.1mm;
    }
  }
</style>
