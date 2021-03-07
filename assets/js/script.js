$("document").ready(function () {
    
    loadPokemons();

    $("#button1Poke").click(function (event) {
        event.preventDefault();
      const nombrePoke = $("#inputPoke").val();
      const nombrePokeNormalizado = nombrePoke.trim().toLowerCase();
      loadPokemonByName(nombrePokeNormalizado);
    });
  
    $("#selectPoke").on("change", function (v) {
      const selectedPoke = v.target.value;
      const selectedPokeNormalizado = selectedPoke.toLowerCase();
      loadPokemonByName(selectedPokeNormalizado);
    });
});

const loadPokemons = () => {
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151",
        type: "GET",
        dataType: "JSON",
        success: function (pokemones) {
          const listado = pokemones.results;
          listado.forEach(function (element) {
            $("#selectPoke").append(
              `<option value="${element.name.toUpperCase()}">${element.name.toUpperCase()}</option>`
            );
          });
        }
      });
}

const loadPokemonByName = (nombrePokemon) => {
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`,
        type: "GET",
        dataType: "JSON",
        success: setupPokemon
      });
}

const setupPokemon = (pokemon) => {
    if(pokemon != undefined){
        $(".estadisticas").toggle(pokemon != undefined);
        $(".info").toggle(pokemon != undefined);
        $(".pokemon").toggle(pokemon != undefined);
        setupInfo(pokemon);
        setupChartEstadisticas(pokemon);
    }
}


const setupChartEstadisticas= (pokemon) => {
    let stats = pokemon.stats;
    let hp = stats[0].base_stat;
    let ataque = stats[1].base_stat;
    let defensa = stats[2].base_stat;
    let eataque = stats[3].base_stat;
    let edefensa = stats[4].base_stat;
    let velocidad = stats[5].base_stat;

    var ctx = document.getElementById('pokeChart');
    let data = {
        labels: ['HP', 'Ataque', 'Defensa', 'Ataque especial','Defensa especial','Velocidad'],
        datasets: [{
            label : "Estadísticas",
            data: [hp, ataque, defensa, eataque,edefensa,velocidad]
        }]
    }
    let options = {
        scale: {
            angleLines: {
                display: false
            },
            ticks: {
                suggestedMin: 50,
                suggestedMax: 100
            }
        }
    }
    let pokeChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });
}

const setupInfo = (pokemon) => {
    const nombrePoke = pokemon.name.toUpperCase();
    $("#nombrePoke").text(nombrePoke);
  
    const spriteFront = pokemon.sprites.front_shiny;
    $("#imgPokeFront").attr("src", spriteFront);
  
    pokemon.abilities.forEach( ha => $("#habilidades").append(`<li>${ha.ability.name}</li>`));
    let lenght = pokemon.moves.length >= 5 ? 5 : pokemon.moves.lenght;
    for(let i= 0; i <=lenght ; i++ )
        $("#movimientos").append(`<li>${pokemon.moves[i].move.name}</li>`)
    $("#peso").text(`${pokemon.weight} (KG)`);
    $("#experience").text(`${pokemon.base_experience}`)
}