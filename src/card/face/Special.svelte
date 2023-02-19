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
    width: 22px;
    height: fit-content;
    left: 34px;
    top: 108px;
    display: flex;
    flex-direction: column;
    gap: 2.5px;
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
