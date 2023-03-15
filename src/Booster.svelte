<script>
  import { cards } from './stores/cards'
  import CardContext from './card/Context.svelte'
  import Card from './card/Card.svelte'

  export let boosterCards = []
  export let number = 1
  const flipped = [false, false, false, false, false]
  let ref
  const flip = () => {
    // if (number !== 7 && number !== 9) {
    //   ref.parentNode.removeChild(ref)
    // }
    flipped[flipped.filter((f) => !!f).length] = true
    if (!flipped[4]) {
      setTimeout(flip, 500)
    } else {
      setTimeout(unflip, 1000)
    }
  }

  const unflip = () => {
    flipped[flipped.filter((f) => !f).length] = false
    if (flipped[4]) {
      setTimeout(unflip, 500)
    }
  }

  const handleStartFlips = () => {
    setTimeout(flip, 500)
    setTimeout(() => {
      ref.parentNode.removeChild(ref)
    }, 12000)
  }

  $: {
    if ($cards.length && boosterCards.length) {
      const cardDefinitions = boosterCards.map((cardNumber) => $cards[cardNumber - 1])
      const twitterTags = cardDefinitions.map((card) => {
        const twitter = card.artistLinks?.find((l) => l.title === 'Twitter')
        if (!twitter) {
          return card.artist
        }
        return twitter.link.replace(/https?:\/\/twitter.com\//, '@')
      })

      const twitterCredits = twitterTags.slice(0, 4).join(', ') + ' and ' + twitterTags[4]
      const tumblrTags = cardDefinitions.map((card) => {
        const tumblr = card.artistLinks?.find((l) => l.title === 'Tumblr')
        if (!tumblr) {
          return card.artist
        }
        const handle = tumblr.link.match(/https?:\/\/(www\.)?(.*)\.tumblr\.com\/?(.*)/)
        if (handle && handle[2] === 'www') {
          return '@' + handle[3]
        } else if (handle) {
          return '@' + handle[2]
        } else {
          return card.artist
        }
      })
      const tumblrCredits = tumblrTags.slice(0, 4).join(', ') + ' and ' + tumblrTags[4]

      console.log(cardDefinitions.map((card) => card.name).join(', '))
      console.log(cardDefinitions.map((card) => card.artist).join(', '))
      console.log(twitterCredits)
      console.log(tumblrCredits)
      console.log('---------' + number + '---------')
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={handleStartFlips} bind:this={ref}>
  <h2>Sneak<br />Peek</h2>
  <h2>Booster<br />Pack #{number}</h2>
  <booster>
    {#if $cards.length && boosterCards.length}
      {#each boosterCards as cardNumber, i}
        <div class="hitbox" class:flip={flipped[i]}>
          <div class="flipper">
            <CardContext
              cardDetails={$cards[cardNumber - 1]}
              width={(744 + 71) / 2}
              height={(1039 + 71) / 2}
              units="px"
            >
              <Card style="width:100%;height:100%" animate={true} />
            </CardContext>
          </div>
        </div>
      {/each}
    {/if}
  </booster>
</main>

<style>
  main {
    background: repeating-linear-gradient(45deg, #606dbc22, #606dbc22 30px, #46529822 30px, #46529822 60px);
    padding: 10px 0 40px;
    position: relative;
    height: 110vh;
  }
  booster {
    display: flex;
    --gallery-scale: 0.75;

    margin: auto;
    max-width: 1200px;
    flex-wrap: wrap;
    justify-content: center;
    cursor: none;
  }
  h2 {
    font-size: 4rem;
    font-family: Splatoon1;
    color: white;
    position: absolute;
    z-index: 1;
    transform: rotate(-10deg);
    padding: 0 3rem;
    line-height: 4.5rem;
  }
  h2 ~ h2 {
    bottom: 15rem;
    right: 0;
    font-size: 4.5rem;
    line-height: 5rem;
  }
  div.hitbox {
    flex: 0 0 calc(407.5px * var(--gallery-scale));
  }
  div.flipper {
    width: calc(407.5px * var(--gallery-scale));
    height: calc(555px * var(--gallery-scale));
    transform-style: preserve-3d;
  }
  div.flipper :global(.illustrated-front) {
    filter: brightness(0);
  }
  div.flipper :global(.card_front),
  div.flipper :global(.card_back) {
    transform: rotateY(180deg);
    transition: all 0.3s ease;
    perspective: 1000px;

    transition-delay: 5s;
  }
  div.flipper :global(.card_back) {
    transform: rotateY(180deg) scaleX(-1);
  }
  /* div.hitbox:hover .flipper :global(.card_front), */
  /* div.hitbox:hover .flipper :global(.card_back), */
  div.hitbox.flip .flipper :global(.card_front),
  div.hitbox.flip .flipper :global(.card_back) {
    transform: rotateY(0);
    transition-delay: 0s;
  }
  /* div.hitbox:hover .flipper :global(.card_back), */
  div.hitbox.flip .flipper :global(.card_back) {
    transform: rotateY(0deg) scaleX(-1);
  }

  @media print {
    main {
      display: none;
    }
  }
</style>
