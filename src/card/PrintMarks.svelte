<script lang="ts">
  import { bleed } from '../stores/print'
</script>

<div class="marks" style="--markWidth: {$bleed === 0 ? '.5px' : '1px'};">
  <div class="corner" style="grid-area: top-left;" />
  <div class="corner" style="grid-area: top-right" />
  <div class="corner" style="grid-area: bottom-left" />
  <div class="corner" style="grid-area: bottom-right" />
  <div class="vertical top" style="grid-area: top-gap-1;" />
  <div class="vertical top" style="grid-area: top-gap-2;" />
  <div class="horizontal left" style="grid-area: left-gap-1;" />
  <div class="cross" style="grid-area: top-left-intersect;" />
  <div class="cross" style="grid-area: top-right-intersect;" />
  <div class="horizontal right" style="grid-area: right-gap-1;" />
  <div class="horizontal left" style="grid-area: left-gap-2;" />
  <div class="cross" style="grid-area: bottom-left-intersect;" />
  <div class="cross" style="grid-area: bottom-right-intersect;" />
  <div class="horizontal right" style="grid-area: right-gap-2;" />
  <div class="vertical bottom" style="grid-area: bottom-gap-1;" />
  <div class="vertical bottom" style="grid-area: bottom-gap-2;" />
</div>

<style>
  .marks {
    position: absolute;
    top: calc((100% - var(--cardHeight) * 3) / 2 - 3mm);
    left: 0;
    width: calc(var(--cardWidth) * 3 + 6mm);
    height: calc(var(--cardHeight) * 3 + 6mm);
    display: grid;
    grid-template-columns:
      calc(3mm + var(--printBleed))
      63mm
      calc(var(--printBleed) * 2)
      63mm
      calc(var(--printBleed) * 2)
      63mm
      calc(3mm + var(--printBleed));
    grid-template-rows:
      calc(3mm + var(--printBleed))
      88mm
      calc(var(--printBleed) * 2)
      88mm
      calc(var(--printBleed) * 2)
      88mm
      calc(3mm + var(--printBleed));

    grid-template-areas:
      'top-left . top-gap-1 . top-gap-2 . top-right'
      '. . . . . . .'
      'left-gap-1 . top-left-intersect . top-right-intersect . right-gap-1'
      '. . . . . . .'
      'left-gap-2 . bottom-left-intersect . bottom-right-intersect . right-gap-2'
      '. . . . . . .'
      'bottom-left . bottom-gap-1 . bottom-gap-2 . bottom-right';
    /* grid-gap: calc(var(--printBleed) * 2); */
  }
  .marks > div {
    border: 1px solid black;
    margin: -0.5px;
    position: relative;
  }
  .marks > .vertical {
    border-width: var(--markWidth);
    border-top: none;
    border-bottom: none;
    height: calc(100% + 1.5mm);
  }

  .top {
    top: 0;
  }
  .top::before {
    content: '';
    width: calc(100% + 3mm);
    border-top: 1px solid white;
    position: relative;
    display: block;
    left: -1.5mm;
    top: calc(100% - 1.5mm);
  }
  .bottom {
    top: -1.5mm;
  }

  .bottom::before {
    content: '';
    width: calc(100% + 3mm);
    border-top: 1px solid white;
    position: relative;
    display: block;
    left: -1.5mm;
    top: 1.5mm;
  }
  .marks > .horizontal {
    border-width: var(--markWidth);
    border-left: none;
    border-right: none;
    width: calc(100% + 1.5mm);
  }

  .left {
    left: 0;
  }
  .left::before {
    content: '';
    height: calc(100% + 3mm);
    border-left: 1px solid white;
    position: relative;
    display: block;
    left: calc(100% - 1.5mm);
    top: -1.5mm;
  }
  .right {
    left: -1.5mm;
  }
  .right::before {
    content: '';
    height: calc(100% + 3mm);
    border-left: 1px solid white;
    position: relative;
    display: block;
    left: 1.5mm;
    top: -1.5mm;
  }
  .corner::after {
    content: '';
    width: 1.5mm;
    height: 1.5mm;
    position: relative;
    display: block;
    border-color: white;
  }
  .corner:nth-child(1) {
    border-top: none;
    border-left: none;
  }
  .corner:nth-child(1)::after {
    border-top-width: 1px;
    border-top-style: solid;
    border-left-width: 1px;
    border-left-style: solid;
    left: 100%;
    top: 100%;
  }
  .corner:nth-child(2) {
    border-top: none;
    border-right: none;
  }
  .corner:nth-child(2)::after {
    border-top-width: 1px;
    border-top-style: solid;
    border-right-width: 1px;
    border-right-style: solid;
    left: calc(-1.5mm - 1px);
    top: 100%;
  }
  .corner:nth-child(3) {
    border-bottom: none;
    border-left: none;
  }
  .corner:nth-child(3)::after {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-left-width: 1px;
    border-left-style: solid;
    left: 100%;
    top: calc(-1.5mm - 1px);
  }
  .corner:nth-child(4) {
    border-bottom: none;
    border-right: none;
  }
  .corner:nth-child(4)::after {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-right-width: 1px;
    border-right-style: solid;
    left: calc(-1.5mm - 1px);
    top: calc(-1.5mm - 1px);
  }

  .marks > div.cross {
    /* clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); */
    width: calc(100% + 3mm);
    height: calc(100% + 3mm);
    left: -1.5mm;
    position: relative;
    top: -1.5mm;
    border: none;
  }
  .cross::before {
    /* Horizontal lines */
    content: '';
    border-top: var(--markWidth) solid white;
    border-bottom: var(--markWidth) solid white;
    height: calc(100% - 3mm - 1px);
    position: relative;
    display: block;
    top: 1.5mm;
  }

  .cross::after {
    /* Vertical lines */
    content: '';
    border-left: var(--markWidth) solid white;
    border-right: var(--markWidth) solid white;
    width: calc(100% - 3mm - 1px);
    height: 100%;
    position: relative;
    display: block;
    left: calc(1.5mm);
    top: calc(var(--printBleed) * -2);
  }
</style>
