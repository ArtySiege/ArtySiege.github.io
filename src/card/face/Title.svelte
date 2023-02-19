<script>
  import { getCardContext } from '../getCardContext'
  import { styles } from '../../stores/style'
  const card = getCardContext()
  let nameWidth = 1
  let wrapperWidth = 1
</script>

<div
  class="header-wrapper"
  bind:clientWidth={wrapperWidth}
  style="--wrapper-width: {wrapperWidth};--wrapper-height-scale: {card.nameParts.length > 1 ? 6 : 5.5}"
>
  <!-- style="--wrapper-height: {card.nameParts.length > 1 ? '6rem' : '5.5rem'}" -->
  <header
    bind:clientWidth={nameWidth}
    style="--name-width: {nameWidth};--header-scale: {Math.min(1, (wrapperWidth * 0.64) / nameWidth)}"
  >
    <span style="--dropShadow: {$styles.shadows}" class={card.rarity}>{@html card.nameParts.join('<br />')}</span>
  </header>
</div>

<style>
  header {
    position: relative;
    font-size: 32px;
    /* color: #aa11ff; */
    font-family: Splatoon1;
    letter-spacing: 0.5px;
    transform: scale(var(--header-scale), 1);
    line-height: 38px;
  }
  header span {
    background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(#c6b6d9, #4d54a5, #423896);
    color: transparent;
    filter: var(--dropShadow);
  }
  span.fresh {
    background-image: repeating-linear-gradient(
      -63deg,
      rgba(255, 255, 153, 1),
      rgba(204, 51, 153, 1),
      rgba(51, 255, 204, 1),
      rgba(255, 255, 153, 1) 50%
    );
    background-position: var(--posx) var(--posy);
    background-size: 400% 200%;
  }
  span.rare {
    background-image: repeating-linear-gradient(-63deg, rgba(255, 255, 153, 1), goldenrod, rgba(255, 255, 153, 1) 50%);
    background-position: var(--posx) var(--posy);
    background-size: 400% 200%;
  }
  .header-wrapper {
    height: var(--wrapper-height);
    margin-left: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: calc(100% - 1rem);
    left: 5px;
    top: 22px;
    --wrapper-height: calc(16px * var(--wrapper-height-scale));
  }

  @media print {
    header {
      font-size: 5.42mm;
      letter-spacing: 0.08474576271mm;
      line-height: 6.44mm;
    }
    .header-wrapper {
      margin-left: 5.4237288136mm;
      width: calc(100% - 2.7118644068mm);
      left: 0.8474576271mm;
      top: 3.7288135593mm;
      --wrapper-height: calc(var(--wrapper-height-scale) * 16mm / 5.9);
    }
  }
</style>
