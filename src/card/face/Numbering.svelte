<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<numbering style="--color: {card.seriesColorOverride}">
  <span class="designation">
    {card.seriesNumber}/{card.seriesTotal}
  </span>
  <span class="set set-{card.series}" />
</numbering>

<style>
  numbering {
    position: absolute;
    right: calc(var(--gallery-scale) * 33px);
    top: calc(var(--gallery-scale) * 506px);
    font-size: calc(var(--gallery-scale) * 12px);
    display: flex;
    --color: black;
  }
  .designation {
    color: var(--color);
  }
  .set {
    width: calc(var(--gallery-scale) * 19px);
    height: calc(var(--gallery-scale) * 16px);
    background-repeat: no-repeat;
    background-size: contain;
    margin-top: calc(var(--gallery-scale) * 4px);
    margin-left: calc(var(--gallery-scale) * 2px);
  }
  .set-1 {
    background-image: url('../img/UI/2022_Drizzle.svg');
  }
  .set-2 {
    background-image: url('../img/UI/2022_Chill.svg');
  }
  .set-3 {
    background-image: url('../img/UI/2023_Fresh.svg');
  }
  @media print {
    numbering {
      right: 5.93mm;
      top: 85.762mm;
      font-size: 2mm;
    }
    .set {
      width: 3.2mm;
      height: 2.72mm;
      margin-top: 0.678mm;
      margin-left: 0.338mm;
    }
  }
</style>
