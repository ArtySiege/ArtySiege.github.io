<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<special alt="Special Cost: {card.specialCost}">
  {#each Array(card.specialCost) as _, i}
    <div aria-hidden="true" class="special-square" />
  {/each}
</special>

<style>
  special {
    position: absolute;
    width: calc(var(--gallery-scale) * 22px);
    height: fit-content;
    left: calc(var(--gallery-scale) * 34px);
    top: calc(var(--gallery-scale) * 108px);
    display: flex;
    flex-direction: column;
    gap: calc(var(--gallery-scale) * 2.5px);
  }
  .special-square {
    width: 100%;
    aspect-ratio: 1;
    background-image: url('../img/UI/SpecialSquare.svg');
    background-size: contain;
  }
  @media print {
    special {
      width: 3.73mm;
      left: 5.93mm;
      top: 18.3mm;
      gap: 0.42mm;
    }
  }
</style>
