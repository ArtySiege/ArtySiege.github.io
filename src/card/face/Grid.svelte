<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<div class="grid-wrapper">
  <div class="grid">
    {#each Array(8) as _, i}
      {#each Array(8) as _, j}
        <div class="grid-space" data-space-type={card.grid[i]?.[j]} />
      {/each}
    {/each}
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(8, 16px);
    grid-template-rows: repeat(8, 16px);
    gap: 2px;
    position: relative;
  }
  .grid-wrapper {
    position: absolute;
    top: 368px;
    left: 35px;
    width: fit-content;
    height: fit-content;
    background-image: url('../img/UI/grid.svg');
    background-size: contain;
  }
  /* .grid-space {
    background: #00000040;
  } */
  .grid-space[data-space-type='S'],
  .grid-space[data-space-type='X'] {
    margin: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    background-size: contain;
    background-repeat: no-repeat;
    /* background-color: unset; */
  }
  .grid-space[data-space-type='S'] {
    background-image: url('../img/UI/SpecialSquare.svg');
  }
  .grid-space[data-space-type='X'] {
    background-image: url('../img/UI/NormalSquare.svg');
  }
  @media print {
    .grid {
      grid-template-columns: repeat(8, 3mm);
      grid-template-rows: repeat(8, 3mm);
      gap: 0;
    }
    .grid-wrapper {
      top: 62.328mm;
      left: 5.93mm;
      width: 24mm;
      height: 24mm;
      background-size: cover;
    }
    .grid-space[data-space-type='S'],
    .grid-space[data-space-type='X'] {
      margin: -0.15mm;
      width: calc(100% + 0.3mm);
      height: calc(100% + 0.3mm);
    }
  }
</style>
