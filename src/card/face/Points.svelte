<script>
  import { getCardContext } from '../getCardContext'
  import { styles } from '../../stores/style'
  const card = getCardContext()
  const rarity = card.rarity
</script>

<points class={card.rarity}>
  <svg>
    <text class="stroke" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">{card.points}</text>
    <text class="fill" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">{card.points}</text>
  </svg>
  <!-- <span style="filter: {$styles.shadows}"> {card.points} </span> -->
</points>

<style>
  points {
    background-image: url('../img/UI/ScoreDiamond.png');
    color: white;
    font-family: Splatoon1;
    font-size: calc(var(--gallery-scale) * 36px);
    width: calc(var(--gallery-scale) * 86.5px);
    height: calc(var(--gallery-scale) * 86.5px);
    line-height: calc(var(--gallery-scale) * 86.5px);
    display: block;
    background-size: contain;
    background-repeat: no-repeat;
    left: calc(var(--gallery-scale) * 23px);
    top: calc(var(--gallery-scale) * 23px);
    position: absolute;
    --shadowColor: #442f8e;
    will-change: transform;
  }
  .rare {
    background-image: url('../img/UI/ScoreDiamondRare.png');
    --shadowColor: #81762f;
  }
  .fresh {
    background-image: url('../img/UI/ScoreDiamondFresh.png');
  }
  svg {
    width: 100%;
    height: 100%;
    paint-order: stroke fill;
  }
  text.stroke {
    stroke: var(--shadowColor);
    stroke-width: calc(var(--gallery-scale) * 7px);
    stroke-linejoin: round;
  }
  text.fill {
    fill: white !important;
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
    text.stroke {
      stroke-width: 1.5mm;
    }
  }
</style>
