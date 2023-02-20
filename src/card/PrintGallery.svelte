<script lang="ts">
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardDetails } from './interface'

  let cards = []
  const getCards = async () => {
    let cardFetch = await fetch('/data.csv')
    let cardData = await cardFetch.text()

    const cardRows = cardData.split('\r\n')
    cardRows.shift()
    cards = cardRows.map((row) => {
      const cols = row.split(',')
      return {
        nameParts: cols.slice(2, 4).filter((s) => !!s) as [string, string?],
        img: cols[18],

        number: parseInt(cols[0]),
        rarity: cols[6].toLowerCase() as 'common' | 'rare' | 'fresh',
        featureType: cols[22] as CardDetails['featureType'],
        series: cols[7],
        seriesNumber: cols[21],
        seriesTotal: cols[22],

        grid: cols.slice(9, 17) as [string, string, string, string, string, string, string, string],
        points: cols[8],
        specialCost: parseInt(cols[4]),

        artist: cols[17],
        artistLinkType: cols[20],
        artistLink: cols[19],
      }
    })
    return cards //.filter((c) => !!c.artist)
  }
</script>

<main>
  {#await getCards() then cards}
    <div class="wrapper">
      {#each cards as card, i}
        <CardContext cardDetails={card} width={69} height={94} units="mm">
          <Card pagebreak={i % 9 === 8} style="" />
        </CardContext>
      {/each}
    </div>
  {/await}
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    margin: 0;
    font-size: 2.1875mm;
  }
  .wrapper {
    display: grid;
    grid-template-columns: 63mm 63mm 63mm;
    grid-auto-rows: 88mm;
    page-break-before: always;
  }

  @media screen {
    main {
      display: none !important;
    }
  }
</style>
