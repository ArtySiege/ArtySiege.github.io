<script>
  import { getCardContext } from '../getCardContext'

  const card = getCardContext()
  let loading = true

  const imageLoader = (e) => {
    loading = false
  }

  let img_base = card.img.startsWith('http') ? '' : './img/'
  let img_url = ''

  img_url = img_base + card.img
  img_url = img_url.replace('.png', '.webp')
  img_url = img_url.replace('./CardArtRedraw', './CardArtWebp')
</script>

<img
  class="illustrated_front"
  src={img_url}
  alt="{card.name} illustrated by {card.artist}"
  on:load={imageLoader}
  loading="lazy"
/>

<style>
  .illustrated_front {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
