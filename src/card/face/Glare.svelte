<script>
  export let rarity = 'common'
</script>

<div class="glare {rarity}" />

<style>
  .glare {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateZ(1px);
    /* z-index: 4; */
    background: radial-gradient(
      farthest-corner circle at var(--mx) var(--my),
      rgba(255, 255, 255, 0.8) 5%,
      rgba(255, 255, 255, 0.65) 10%,
      rgba(0, 0, 0, 0.5) 45%
    );
    mix-blend-mode: overlay;
    opacity: calc(var(--o) / 2);
    clip-path: inset(0% 0% round 6% / 5%);
    cursor: pointer;
  }

  @media print {
    .glare {
      display: none;
    }
  }
</style>
