<script lang="ts">
</script>

<main>
  <div class="whats-next-wrapper">
    <h2 id="whats-next">What's Next</h2>
    <div class="whats-next">
      <p>The project will take a bit of a break, some small website updates might happen during that time.</p>
      <p>
        A print run is in continual consideration but is not anticipated to occur any time soon - we'd like to catch up
        more to the in-game cards.
      </p>
      <p>
        You can fill in this <a href="https://forms.gle/vi9CDbJXvrkTEmMRA" target="_blank" rel="noreferrer"
          >Interest Check form</a
        > to help us determine where we put our energy after returning from hiatus!
      </p>
    </div>
  </div>
  <div class="how-to-play-wrapper">
    <div class="how-to-play-background" />
    <div class="how-to-play">
      <h2 id="how-to-play">How To Play</h2>
      <p>By printing these cards you can play Tableturf in real life!</p>
      <p>
        We <a href="https://twitter.com/alecatmew/status/1571518307064483840">prototyped</a> and
        <a href="https://twitter.com/alecatmew/status/1578373911892226048">playtested IRL tableturf</a>, but since the
        game now offers multiplayer the focus of the project has pivoted away from making it a practical Print &amp;
        Play game; we worried less about size and contrast on the cards in favour of allowing the artists to let their
        imaginations run wild with the card art.
      </p>
      <p>Files to accompany these instructions will come at a later date.</p>
      <p>These instructions will not explain the rules of Tableturf.</p>
      <p>You will need:</p>
      <ul>
        <li>16 card decks for two players (you can print just the cards you need!)</li>
        <li>Privacy screens to keep your moves hidden</li>
        <li>
          A private map for each player. To match the Arty Siege cards, make the grid lines 3mm / 1/8th inch apart
        </li>
        <ul>
          <li>Lined graph paper is a handy way to draw out your moves.</li>
          <li>
            Using a piece of clear acrylic, or printing on clear acetate will allow you to preview each move by sliding
            your card around under the minimap
          </li>
        </ul>
        <li>
          A play area to be shared by the players and a way to mark the occupied squares - you can get very creative
          with how you construct the game board!
        </li>
        <ul>
          <li>Fans have made their own boards using lego, 3D printed grids, cardboard, beads and more!</li>
        </ul>
        <li>Tokens to track how much special charge each player has</li>
      </ul>
      <p>Play:</p>
      <p>Start the game by drawing your starting hand.</p>
      <ul>
        <li>
          Each turn, make your move selection in secret, using your minimap to guide where you are permitted to place
          pieces.
        </li>
        <li>Once both players have made their selections, reveal where you placed your cards!</li>
        <ul><li>Or, reveal that you haven't placed a card, discarding your card for a special charge.</li></ul>
        <li>Resolve the placements.</li>
        <ul>
          <li>
            Update the play mat. It's handy to mark all the tiles for the larger card, then the smaller one, overriding
            the large piece's tiles if necessary
          </li>
          <li>Spend any special charge tokens that were needed to make your placement.</li>
          <li>Remember to update your minimaps as well!</li>
        </ul>
        <li>Check for special charge - take a token if you've charged special from a square.</li>
        <ul><li>Make sure you have a way of knowing that you've taken special charge from a square once only</li></ul>
        <li>Draw a new card</li>
        <li>Repeat card placements until twelve turns have passed</li>
      </ul>
      <p>The winner is the player who has claimed the most squares at the end of the game!</p>
    </div>
  </div>
</main>

<style>
  main {
    margin-top: 10px;
  }
  h2 {
    margin: 5px auto;
  }
  .whats-next-wrapper {
    text-align: right;
    width: var(--gallery-width);
    margin: 30px auto 0;
  }
  .whats-next {
    background: #606dbc22; /*repeating-linear-gradient(45deg, #606dbc22, #606dbc22 30px, #46529822 30px, #46529822 60px);*/
    border-radius: 10px;
    position: relative;
    padding: 20px;
    color: white;
  }
  .whats-next::after {
    content: '';
    border-radius: 10px;
    margin: auto;
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-shadow: inset 0 0 10px #000000;
    width: 100%;
    mix-blend-mode: multiply;
  }

  .how-to-play-wrapper {
    text-align: left;
    margin-top: 30px;
    width: 100%;
    color: white;
    padding: 20px 0;
    position: relative;
    overflow: hidden;
  }
  .how-to-play-background::before {
    position: absolute;
    width: 200%;
    height: 200%;
    content: '';
    background: url('../img/Site/HowToPlayBackground.webp');
    background-repeat: repeat;
    background-size: 600px;
    transform: translateX(-25%) translateY(-25%) rotate(-8deg);
  }
  .how-to-play-background::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    /* background is a linear gradient from the bottom */
    background: linear-gradient(180deg, #00000000, #0e1252);
  }
  #how-to-play {
    color: var(--theme-highlight);
  }
  .how-to-play {
    width: var(--gallery-width);
    margin: auto;
    position: relative;
  }
  @media print {
    main {
      display: none;
    }
  }
</style>
