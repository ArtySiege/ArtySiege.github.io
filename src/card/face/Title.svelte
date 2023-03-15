<script>
  import { onMount } from 'svelte'
  import { getCardContext } from '../getCardContext'
  import { styles } from '../../stores/style'
  const card = getCardContext()
</script>

<div
  class="header-wrapper"
  class:singleLine={card.nameParts.length === 1}
  style="--header-scale: {Math.min(1, card.headerScale)}"
>
  <svg width="100%" height="100%">
    <g>
      {#each card.nameParts as part, i}
        {@const y = i === 0 ? (card.nameParts.length === 1 ? 0.455 : 0.3) : 0.7}
        <text class="stroke-small" x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">{part}</text>
        <text class="stroke" x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">{part}</text>
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
    transform: scale(var(--header-scale), 1);
    line-height: calc(var(--gallery-scale) * 38px);
  }
  .singleLine header {
    margin-top: calc(-7px * var(--gallery-scale));
  }
  text.stroke-small {
    stroke: var(--shadowColor);
    stroke-width: calc(var(--gallery-scale) * 5.5px);
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
    letter-spacing: calc(var(--gallery-scale) * 1px);
    transform: scale(var(--header-scale), 1);
  }
  header span {
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(#c6b6d9, #5e3ce6, #423896);
    color: transparent;
    filter: var(--dropShadow);
    letter-spacing: calc(var(--gallery-scale) * 1px);
  }
  span.fresh {
    background-image: repeating-linear-gradient(120deg, #ffff99, #f2707a, #cc3399, #84d4f2, #33ffcc, #ffff99 35%);
    background-position: var(--posx) var(--posy);
    background-size: 400% 200%;
  }
  span.rare {
    background-image: repeating-linear-gradient(-63deg, #ffff99, #daa520, #ffff99 50%);
    background-position: var(--posx) var(--posy);
    background-size: 400% 200%;
  }
  :global(card:hover) span.rare {
    --space: 10%;
    background-image: repeating-linear-gradient(-63deg, #ffff99, #daa520, #ffff99 50%),
      repeating-linear-gradient(-63deg, #ffff99aa, #daa520aa, #ffff99aa 50%),
      repeating-linear-gradient(
        -63deg,
        rgba(255, 119, 115, 1) calc(var(--space) * 1),
        rgba(255, 237, 95, 1) calc(var(--space) * 2),
        rgba(168, 255, 95, 1) calc(var(--space) * 3),
        rgba(131, 255, 247, 1) calc(var(--space) * 4),
        rgba(120, 148, 255, 1) calc(var(--space) * 5),
        rgb(216, 117, 255, 1) calc(var(--space) * 6),
        rgb(255, 119, 115, 1) calc(var(--space) * 7)
      );
    background-blend-mode: color-burn, normal, normal;
  }
  .header-wrapper {
    height: 17.28%;
    margin-left: 7.852760736%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 96.2%;
    left: 1.226993865%;
    top: 4%;
  }

  @media print {
    header {
      font-size: 5.42mm;
      line-height: 6.44mm;
    }
    header span,
    svg {
      letter-spacing: 0.1694915254mm;
    }
    .singleLine header {
      margin-top: -1.5mm;
    }
    svg {
      font-size: 5.42mm;
      letter-spacing: 0.1694915254mm;
    }
    text.stroke {
      stroke-width: 1.5mm;
    }
    text.stroke-small {
      stroke-width: 0.9mm;
    }
  }
</style>
