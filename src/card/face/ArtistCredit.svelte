<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<illus style="--color: {card.creditColorOverride}">
  <span>Illus. {card.artist}</span>
</illus>

<style>
  illus {
    position: absolute;
    left: calc(var(--gallery-scale) * 35px);
    top: calc(var(--gallery-scale) * 506px);
    font-size: calc(var(--gallery-scale) * 12px);
    --color: black;
  }
  span {
    color: var(--color);
  }
  @media print {
    illus {
      left: 5.93mm;
      top: 85.762mm;
      font-size: 2mm;
    }
  }
</style>
