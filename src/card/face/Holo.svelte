<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<div
  class="holo {card.rarity}"
  style="background-image: url('../img/HoloOverlays/{card.number.toString().padStart(3, '0')}.webp'),
repeating-linear-gradient(
  -63deg,
  rgb(255, 119, 115) calc(var(--space) * 1),
  rgba(255, 237, 95, 1) calc(var(--space) * 2),
  rgba(168, 255, 95, 1) calc(var(--space) * 3),
  rgba(131, 255, 247, 1) calc(var(--space) * 4),
  rgba(120, 148, 255, 1) calc(var(--space) * 5),
  rgb(216, 117, 255) calc(var(--space) * 6),
  rgb(255, 119, 115) calc(var(--space) * 7)
);"
/>

<style>
  /*

  setup

*/

  .holo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    opacity: var(--o);
    transition: 0.3s opacity ease;
  }

  .holo {
    --space: 3%;

    background-blend-mode: multiply, color-burn;
    background-position: 0, var(--posx) var(--posy);
    background-size: cover, 400% 200%;

    filter: brightness(0.75) contrast(1.2) saturate(1.5) blur(1px);
    mix-blend-mode: color-dodge;
  }

  @media print {
    .holo {
      display: none;
    }
  }
</style>
