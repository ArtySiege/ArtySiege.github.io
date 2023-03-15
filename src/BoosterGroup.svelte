<script>
  import { cards } from './stores/cards'
  import CardContext from './card/Context.svelte'
  import Card from './card/Card.svelte'
  import { onMount } from 'svelte'
  import Booster from './Booster.svelte'

  const boosterGroups = []
  const takenCards = [
    82,
    51,
    59,
    7,
    119, // 1
    41,
    97,
    69,
    43,
    31, // 2
    60,
    100,
    19,
    151,
    175, // 3
    53,
    29,
    162,
    75,
    8, // 4
    9,
    52,
    62,
    77,
    153, // 5
    84,
    66,
    170,
    168,
    3, // 6
    2,
    156,
    15,
    74,
    165, // 7
    46,
    90,
    22,
    17,
    34, // 8
    126,
    71,
    25,
    95,
    10, // 9
    88,
    24,
    5,
    40,
    80, // 10
    101,
    4,
    67,
    37,
    83, // 11
    18,
    70,
    6,
    58,
    85, // 12
    169,
    57,
    160,
    155,
    12, // 13
    28,
    21,
    33,
    76,
    1, // 14
    98,
    47,
    64,
    55,
    79, // 15
    195,
    35,
    50,
    36,
    81, // 16
    11,
    89,
    96,
    27,
    54, // 17
    48,
    107,
    13,
    61,
    73, // 18
    44,
    78,
    20,
    63,
    115, // 19
    87,
    68,
    16,
    56,
    38, // 20
    117, // 21
  ]

  const takenSet = new Set(takenCards)
  $: {
    if ($cards.length) {
      // const cardsCopy = $cards.filter((c) => c.artist && !takenSet.has(c.number))
      // for (let i = cardsCopy.length - 1; i > 0; i--) {
      //   const j = Math.floor(Math.random() * (i + 1))
      //   const temp = cardsCopy[i]
      //   cardsCopy[i] = cardsCopy[j]
      //   cardsCopy[j] = temp
      // }
      // console.log(JSON.stringify(cardsCopy))

      while (takenCards.length > 0) {
        const boosterNumbers = takenCards.splice(0, 5)
        // const booster = boosterNumbers.map((n) => $cards.find((c) => c.number === n))
        boosterGroups.push(boosterNumbers)
      }
      console.log('GROUPS', boosterGroups)
    }
  }
</script>

<main>
  {#if $cards.length}
    {#each boosterGroups as group, i}
      <Booster boosterCards={group} number={i + 1} />
    {/each}
  {/if}
</main>

<style>
  main {
    cursor: none;
  }
  @media print {
    main {
      display: none;
    }
  }
</style>
