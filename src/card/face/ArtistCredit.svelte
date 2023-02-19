<script>
  import { getCardContext } from '../getCardContext'
  const card = getCardContext()
</script>

<illus>
  Illus. {card.artist}
</illus>

<style>
  illus {
    position: absolute;
    left: 35px;
    top: 506px;
    font-size: 12px;
    color: black;
  }
  @media print {
    illus {
      left: 5.93mm;
      top: 85.762mm;
      font-size: 2mm;
    }
  }
</style>
