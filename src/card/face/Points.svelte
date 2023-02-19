<script>
  import { getCardContext } from '../getCardContext'
  import { styles } from '../../stores/style'
  const card = getCardContext()
</script>

<points class={card.rarity}>
  <svg><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle">{card.points}</text></svg>
  <!-- <span style="filter: {$styles.shadows}"> {card.points} </span> -->
</points>

<style>
  points {
    background-image: url('../img/UI/ScoreDiamond.png');
    color: white;
    font-family: Splatoon1;
    font-size: 36px;
    width: 86.5px;
    height: 86.5px;
    line-height: 86.5px;
    display: block;
    background-size: contain;
    background-repeat: no-repeat;
    left: 23px;
    top: 23px;
    position: absolute;
    --shadowColor: #442f8e;
    will-change: transform;
  }
  .rare {
    background-image: url('../img/UI/ScoreDiamondRare.png');
    --shadowColor: #81762f;
    fill: white !important;
  }
  .fresh {
    background-image: url('../img/UI/ScoreDiamondFresh.png');
    fill: white !important;
  }
  svg {
    width: 100%;
    height: 100%;
    stroke: var(--shadowColor);
    fill: white !important;
    stroke-width: 7px;
    paint-order: stroke fill;
  }
  @media print {
    points {
      font-size: 6.1mm;
      width: 14.66mm;
      height: 14.66mm;
      line-height: 14.66mm;
      left: 3.9mm;
      top: 3.9mm;
    }
    svg {
      stroke-width: 1.5mm;
    }
  }
</style>
