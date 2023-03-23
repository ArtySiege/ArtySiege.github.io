<script>
  import { cards, uniqueArtists } from './stores/cards'
</script>

<about id="about">
  <section>
    <div class="card mini">
      A unique Tableturf deck for you to print at home, currently featuring {$cards.filter((c) => !!c.img).length} cards
      illustrated by {$uniqueArtists.length}
      artists!
    </div>
  </section>
  <section>
    <div class="card">
      <p>
        <strong>arty</strong> <i>[ahr-tee]</i><br />
        Inclined towards the arts
      </p>
      <p>
        <strong>siege</strong> <i>[seej]</i><br />
        A blockade or assault on a territory
      </p>
    </div>
    <div class="card ">
      <p>“Arty Siege” describes the gameplay of Tableturf - territory control using ink.</p>
      <p>It also contains some of the same sounds as “our TCG”, a reference to the acronym for “Trading Card Game”.</p>
    </div>
  </section>
</about>

<style>
  about {
    background-image: url('../img/Splash/Table02.webp');
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: cover;
    display: block;
  }
  strong {
    font-weight: bold;
    font-family: Splatoon1;
  }

  .card {
    color: black;
    background: #fff8;
    padding: var(--padding);
    max-width: 300px;
    margin: var(--padding);
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .mini {
    max-width: 200px;
  }
  section {
    padding: 0 calc(var(--padding) * 2);
    display: flex;
    align-items: center;
    justify-content: start;
  }
  p {
    margin: 0;
  }

  @media (max-width: 780px) {
    section {
      flex-direction: column;
    }
  }

  @media print {
    about {
      background: none;
      display: none;
    }
    section {
      display: none;
    }
  }
</style>
