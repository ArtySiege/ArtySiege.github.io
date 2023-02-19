<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<numbering>
  <span>
    {card.seriesNumber}/{card.seriesTotal}
  </span>
  <span class="set set-{card.series}" />
</numbering>

<style>
  numbering {
    position: absolute;
    right: 33px;
    top: 506px;
    font-size: 12px;
    color: black;
    display: flex;
  }
  .set {
    width: 19px;
    height: 16px;
    background-repeat: no-repeat;
    background-size: contain;
    margin-top: 4px;
    margin-left: 2px;
  }
  .set-1 {
    background-image: url('../img/UI/2023_Drizzle.svg');
  }
  .set-2 {
    background-image: url('../img/UI/2023_Chill.svg');
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
