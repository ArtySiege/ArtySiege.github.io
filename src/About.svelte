<script>
  import { cards, uniqueArtists } from './stores/cards'
</script>

<about id="about">
  <column>
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
      <div class="card">
        <p>“Arty Siege” describes the gameplay of Tableturf - territory control using ink.</p>
        <p>
          It also contains some of the same sounds as “our TCG”, a reference to the acronym for “Trading Card Game”.
        </p>
      </div>
    </section>
  </column>
  <column class="socials">
    <section>
      <div class="card">
        <p>
          <strong>Stay Updated!</strong>
        </p>
        <ul>
          <li><a href="https://twitter.com/tableturfproj" target="_blank" rel="noreferrer">Twitter</a></li>
          <li><a href="https://tableturfproj.tumblr.com" target="_blank" rel="noreferrer">Tumblr</a></li>
          <li><a href="https://cohost.org/TableTurfProj" target="_blank" rel="noreferrer">Cohost</a></li>
          <li><a href="https://discord.gg/Be9XqKmVwf" target="_blank" rel="noreferrer">Discord</a></li>
        </ul>
        <p>
          Join the <a href="https://forms.gle/keK7rG84gPcT7qit9" target="_blank" rel="noreferrer">Mailing List</a> for email
          updates.
        </p>
      </div>
    </section>
  </column>
</about>

<style>
  about {
    background-image: url('../img/Site/HeaderImageSprawl.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
  }
  strong {
    font-weight: bold;
    font-family: Splatoon1;
  }
  .socials {
    text-align: right;
  }
  .socials ul {
    list-style: none;
    padding: 0;
  }

  .card {
    color: white;
    background: #000a;
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
    about {
      flex-direction: column;
    }
    section {
      flex-direction: column;
    }
    .socials {
      text-align: center;
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
