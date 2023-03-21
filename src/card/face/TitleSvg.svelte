<script>
  import { onMount } from 'svelte'
  import { getCardContext } from '../getCardContext'
  import { styles } from '../../stores/style'
  const card = getCardContext()
  const ratio = Math.min(1, card.headerScale)
  let gradientSize = 392 / card.headerScale

  // After creating the SVGs, export them from the page using the SVG Export chrome browser plugin
  // The files are usable from a fresh import, but to reduce the filesize, the <defs> block can be
  // removed and the &quot; escaped characters can be removed or replaced with '
  // The <title> block could also be removed; it's only supplied to get the right filename on export.

  // Better common colours for screen preview
  // background-image: linear-gradient(#b4a6fe, #6600ff, #3715aa);
</script>

<svg width={392 / ratio} height={card.nameParts.length > 1 ? '96' : '88'}>
  <title>{card.number.toString().padStart(3, '0')}</title>
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
      gradientTransform="rotate(27)"
      x1="{(392 * (1 - 0.6 / card.headerScale)) / 2}px"
      x2="{(392 * (1 + 0.7 / card.headerScale)) / 2}px"
      y1="{0}px"
      y2="{(392 * (1 / card.headerScale)) / 20}px"
    >
      <stop offset="0%" stop-color="#ffff99" stop-opacity="1" />
      <stop offset="55%" stop-color="#daa520" stop-opacity="1" />
      <stop offset="90%" stop-color="#ffff99" stop-opacity="1" />
    </linearGradient>
  {/if}
  {#if card.rarity === 'fresh'}
    <linearGradient
      id="gradient-{card.number}"
      gradientTransform="rotate(20)"
      gradientUnits="userSpaceOnUse"
      x1="{(392 * (0.85 - 0.3 / card.headerScale)) / 2}px"
      x2="{(392 * (0.8 + 1 / card.headerScale)) / 2}px"
      y1="{0}px"
      y2="{(392 * (1 / card.headerScale)) / 20}px"
    >
      <stop offset="0%" stop-color=" #ffff99" stop-opacity="1" />
      <stop offset="30%" stop-color=" #f2707a" stop-opacity="1" />
      <stop offset="50%" stop-color="#cc3399" stop-opacity="1" />
      <stop offset="80%" stop-color="#84d4f2" stop-opacity="1" />
      <stop offset="95%" stop-color="#33ffcc" stop-opacity="1" />
    </linearGradient>
  {/if}
  <g style="font-family: Splatoon1; font-size: 32px; letter-spacing: 0.5px; fill: url(#gradient-{card.number})">
    {#each card.nameParts as part, i}
      {@const y = i === 0 ? (card.nameParts.length === 1 ? 0.455 : 0.3) : 0.655}
      <text
        class="stroke"
        stroke="black"
        stroke-width="6"
        x="50%"
        y="{100 * y}%"
        dominant-baseline="central"
        text-anchor="middle"
        stroke-linejoin="round">{part}</text
      >
      <text x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
        {part}
      </text>
    {/each}
  </g>
</svg>

<style>
</style>
