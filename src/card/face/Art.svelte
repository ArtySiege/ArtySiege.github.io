<script>
  import { getCardContext } from '../getCardContext'

  const card = getCardContext()
  let loading = true

  const imageLoader = (e) => {
    loading = false
  }

  let img_base = card.img.startsWith('http') ? '' : './img/'
  let img_url = ''

  img_url = img_base + '/CardArtWebp/' + card.img + '.webp'
</script>

<img
  class="illustrated-front"
  data-card-number={card.number}
  src={img_url}
  alt="{card.name} illustrated by {card.artist}"
  on:load={imageLoader}
  loading="lazy"
/>

<style>
  .illustrated-front {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  @media screen {
    /* Holo effects that appear above the art */
    .illustrated-front[data-card-number='89']:after {
      /* Preload */
      content: url('../img/CardArtWebp/089_spintintin_hover.webp');
    }
    :global(card):hover .illustrated-front[data-card-number='89'] {
      -webkit-mask-image: url('../img/CardArtWebp/089_spintintin_hover.webp');
      -webkit-mask-size: contain;
      mask-image: url('../img/CardArtWebp/089_spintintin_hover.webp');
      mask-size: contain;
    }
  }
</style>
