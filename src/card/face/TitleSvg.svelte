<script>
  import { onMount } from 'svelte'
  import { getCardContext } from '../getCardContext'
  import { cardNames, lang, titleFontSize } from '../../stores/lang'
  const card = getCardContext()
  $: localizedCard = $cardNames[card.number]
  $: ratio = Math.min(1, localizedCard.headerScale)
  $: fontFamily =
    $lang === 'ko_KR' ? 'KoreanCUBE-R' : $lang === 'zh_CN' || $lang === 'zh_TW' ? 'DFPZongYiW9-GB' : 'Splatoon1'
  // let gradientSize = 392 / localizedCard.headerScale

  // After creating the SVGs, export them from the page using the SVG Export chrome browser plugin
  // The files are usable from a fresh import, but to reduce the filesize, the <defs> block can be
  // removed and the &quot; escaped characters can be removed or replaced with '
  // The <title> block could also be removed; it's only supplied to get the right filename on export.

  // Better common colours for screen preview
  // background-image: linear-gradient(#b4a6fe, #6600ff, #3715aa);

  const common_character_space = /[-a-zA-Z0-9α.·\/＆&]/
  const ja_JP_common_cjk_character_space = /[]/
  const ja_JP_l1_character_space = /[踊使将軍号容量式竹筒銃子大甲司令]/
  // actually these are from the l1 files
  const zh_CN_l2_character_space = /[螃鲨鱿蜊鲶蝙蝠鼹鲑笠鹦鹉阱]/
  const zh_TW_l1_character_space =
    /[擊槍廣標記葉專業侖頂噴潔熱遠衝塗捲開纖維滾滾電動馬達變羅齋魷準壓飛濺潑筆迴滿轉裝圓鸚鵡號鍍機爾雙彈陽傘營務發獵魚盤灑護牆壺躍點偵測阱霧線終極護觸導雲讚氣聲納螃鯊騎龍風笠脈鮭擬螢評審評審戰鬥鋼鐵鋒貝澤鍛門時無劍壽輪強槳槳鏡艙艙揮進將軍齡蝙蝠鼴墊潛鍋蓋樓蜊楓聯聯飾寬藝術藝術藝術誘餌煙莢幫]/
  // TODO: #159 needs this char, not in the l1 space
  const zh_TW_l2_character_space = /[鯰]/
  $: isZhKo = $lang === 'ko_KR' || $lang === 'zh_CN' || $lang === 'zh_TW'
</script>

<svg width={392 / ratio} height={localizedCard.nameParts.length > 1 ? '96' : '88'}>
  <title>{card.number.toString().padStart(3, '0')}</title>
  {#if card.rarity === 'common'}
    <linearGradient id="gradient-{card.number}" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="#f6c4ff" stop-opacity="1" />
      <stop offset="50%" stop-color="#bd82ff" stop-opacity="1" />
      <stop offset="100%" stop-color="#5e3ce6" stop-opacity="1" />
    </linearGradient>
  {/if}
  {#if card.rarity === 'rare'}
    <linearGradient
      id="gradient-{card.number}"
      gradientUnits="userSpaceOnUse"
      gradientTransform="rotate(27)"
      x1="{(392 * (1 - 0.6 / localizedCard.headerScale)) / 2}px"
      x2="{(392 * (1 + 0.7 / localizedCard.headerScale)) / 2}px"
      y1="{0}px"
      y2="{(392 * (1 / localizedCard.headerScale)) / 20}px"
    >
      <stop offset="0%" stop-color="#ffff99" stop-opacity="1" />
      <stop offset="55%" stop-color="#daa520" stop-opacity="1" />
      <stop offset="90%" stop-color="#ffff99" stop-opacity="1" />
    </linearGradient>
  {/if}
  {#if card.rarity === 'fresh'}
    <linearGradient
      id="gradient-{card.number}"
      gradientTransform="rotate(20)"
      gradientUnits="userSpaceOnUse"
      x1="{(392 * (0.85 - 0.3 / localizedCard.headerScale)) / 2}px"
      x2="{(392 * (0.8 + 1 / localizedCard.headerScale)) / 2}px"
      y1="{0}px"
      y2="{(392 * (1 / localizedCard.headerScale)) / 20}px"
    >
      <stop offset="0%" stop-color=" #ffff99" stop-opacity="1" />
      <stop offset="30%" stop-color=" #f2707a" stop-opacity="1" />
      <stop offset="50%" stop-color="#cc3399" stop-opacity="1" />
      <stop offset="80%" stop-color="#84d4f2" stop-opacity="1" />
      <stop offset="95%" stop-color="#33ffcc" stop-opacity="1" />
    </linearGradient>
  {/if}
  <g
    style="font-family: {fontFamily}; font-size: {$titleFontSize}px; letter-spacing: 0.5px; fill: url(#gradient-{card.number})"
  >
    {#each localizedCard.nameParts as part, i}
      {@const y =
        i === 0 ? (localizedCard.nameParts.length === 1 ? 0.455 : isZhKo ? 0.28 : 0.3) : isZhKo ? 0.675 : 0.655}
      {#if $lang === 'ko_KR'}
        <text
          class="stroke"
          stroke="black"
          stroke-width="6"
          x="50%"
          y="{100 * y}%"
          dominant-baseline="central"
          text-anchor="middle"
          stroke-linejoin="round"
        >
          {#each part as char}
            {#if char.match(common_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">{char}</tspan>
            {:else if char === ' '}
              <tspan dominant-baseline="central" style="font-size: .5em">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
        <text x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
          {#each part as char}
            {#if char.match(common_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">{char}</tspan>
            {:else if char === ' '}
              <tspan dominant-baseline="central" style="font-size: .5em">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
      {:else if $lang === 'ja_JP'}
        <text
          class="stroke"
          stroke="black"
          stroke-width="6"
          x="50%"
          y="{100 * y}%"
          dominant-baseline="central"
          text-anchor="middle"
          stroke-linejoin="round"
        >
          {#each part as char}
            {#if char.match(ja_JP_common_cjk_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'DFPZongYiW9-GB">{char}</tspan>
            {:else if char.match(ja_JP_l1_character_space)}
              <tspan dominant-baseline="central" style="font-family:'RowdyStd-EB-Kanji'">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
        <text x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
          {#each part as char}
            {#if char.match(ja_JP_common_cjk_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'DFPZongYiW9-GB">{char}</tspan>
            {:else if char.match(ja_JP_l1_character_space)}
              <tspan dominant-baseline="central" style="font-family:'RowdyStd-EB-Kanji'">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
      {:else if $lang === 'zh_CN'}
        <text
          class="stroke"
          stroke="black"
          stroke-width="6"
          x="50%"
          y="{100 * y}%"
          dominant-baseline="central"
          text-anchor="middle"
          stroke-linejoin="round"
        >
          {#each part as char}
            {#if char.match(common_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">{char}</tspan>
            {:else if char.match(zh_CN_l2_character_space)}
              <tspan dominant-baseline="central" style="font-family:'DFPZongYiW9-GB_L2'">{char}</tspan>
            {:else if char === ' '}
              <tspan dominant-baseline="central" style="font-size: .5em">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
        <text x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
          {#each part as char}
            {#if char.match(common_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">{char}</tspan>
            {:else if char.match(zh_CN_l2_character_space)}
              <tspan dominant-baseline="central" style="font-family:'DFPZongYiW9-GB_L2'">{char}</tspan>
            {:else if char === ' '}
              <tspan dominant-baseline="central" style="font-size: .5em">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
      {:else if $lang === 'zh_TW'}
        <text
          class="stroke"
          stroke="black"
          stroke-width="6"
          x="50%"
          y="{100 * y}%"
          dominant-baseline="central"
          text-anchor="middle"
          stroke-linejoin="round"
        >
          {#each part as char}
            {#if char.match(common_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">{char}</tspan>
            {:else if char === '‧'}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">·</tspan>
            {:else if char.match(zh_TW_l1_character_space)}
              <tspan dominant-baseline="central" style="font-family:'DFZongYi-W9-WINP-BF'">{char}</tspan>
            {:else if char === ' '}
              <tspan dominant-baseline="central" style="font-size: .5em">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
        <text x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
          {#each part as char}
            {#if char.match(common_character_space)}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">{char}</tspan>
            {:else if char === '‧'}
              <tspan dominant-baseline="central" style="font-family: 'Splatoon1">·</tspan>
            {:else if char.match(zh_TW_l1_character_space)}
              <tspan dominant-baseline="central" style="font-family:'DFZongYi-W9-WINP-BF'">{char}</tspan>
            {:else if char === ' '}
              <tspan dominant-baseline="central" style="font-size: .5em">{char}</tspan>
            {:else}
              {char}
            {/if}
          {/each}
        </text>
      {:else}
        <text
          class="stroke"
          stroke="black"
          stroke-width="6"
          x="50%"
          y="{100 * y}%"
          dominant-baseline="central"
          text-anchor="middle"
          stroke-linejoin="round">{part}</text
        >
        <text x="50%" y="{100 * y}%" dominant-baseline="central" text-anchor="middle">
          {part}
        </text>
      {/if}
    {/each}
  </g>
</svg>

<style>
</style>
