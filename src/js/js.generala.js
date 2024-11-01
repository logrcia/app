/*document.getElementById('roll-btn').addEventListener('click', rollDice);

function rollDice() {
  for (let i = 1; i <= 5; i++) {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById(`dado-${i}`).textContent = diceValue;
  }
}*/

const DICE_SIZE = 100;

const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker = /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull = /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;

const game = {
    dados: ["", "", "", "", ""],
    dadosSeleccionados: [false, false, false, false, false],
    jugadores: 2,
    turno: 1,
    moves: 1,
    scores: [],
}



const initGame = () => {
    game.dados = ["", "", "", "", ""]; 
    game.dadosSeleccionados = [false, false, false, false, false];
    game.turno = 1; //habría q hacer que empiece un jugador al azar game.jugadores
    game.moves = 1;

    document.querySelectorAll(".dados-container .dados").forEach((diceElement, i) => {
        diceElement.addEventListener("click", () => toggleDiceSelection(i));
    });

    drawDices();
};

const drawScores = () => {
    //encabezado Falta algo para q aparezca q no llegue a copiar
    const contHeader = document.querySelector("#g2 .scores table thead tr");
    contHeader.innerHTML = null;
    const cellGame = document.createElement("th");
    cellGame.innerHTML = "Juego";
    contHeader.appendChild(cellGame);
    for(let i = 0; i < game.jugadores.length; i++){
        const cellPlayerName = document.createElement("th");
        cellPlayerName.innerHTML = `J${i + 1}`;
        contHeader.appendChild(cellPlayerName);
    }
    //juegos
    const contGames = document.querySelector("#g2 .scores table tbody");
    for (let i = 0; i < 11; i++){
        const contGame = document.createElement("th");
        const cellGameName = document.createElement("td");
        cellGameName.innerHTML = getGameName(i);
        contGames.appendChild(cellGameName);
        for (let p = 0; p < game.jugadores.length; p++){
            const cellPlayerScore = document.createElement("td");
            cellPlayerScore.innerHTML = game.scores[p][i];
            contGames.appendChild(cellPlayerScore);
        }
    }
    //total
    const contTotal = document.createElement("tr");
    const cellTotalName = document.createElement("th");
    cellTotalName.innerHTML = "Total";
    contTotal.appendChild(cellTotalName);
    for (let p = 0; p < game.jugadores.length; p++){
        const cellPlayerScore = document.createElement("td");
        cellPlayerScore.innerHTML = game.scores[p][i];
        contGames.appendChild(cellPlayerScore);
    }
}

const isGameMatch = regaex => {
    return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regaex) !== null;//hago una copia del array, lo ordena, lo convierte en un string y lo matchea con la expresion regular de la generala
}

const score = whichGame => {
    let score = 0;
    switch(whichGame) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            //computar puntajes para los numeros
            break;
        case 6:
            if (isGameMatch(reEscalera)) {
               /* score = 20;
            }else if(isGameMatch(reEscalera) || moves === 1){
                score = 25;
                */
                score = game.moves === 1 ? 25 : 20;
            }
            //si coincide con escalera
            // y si es el primer tiro +5
            break;
        case 7:
            if (isGameMatch(reFull)) {
                score = game.moves === 1 ? 35 : 30;
            }
            break;
        case 8:
            if (isGameMatch(rePoker)) {
                score = game.moves === 1 ? 45 : 40;
            }
            break;
        case 9:
            if (isGameMatch(reGenerala)) {
                score = game.moves === 1 ? 55 : 50;
            }
            break;
        case 10:
            if (isGameMatch(reGenerala)) {
                score = game.moves === 1 ? 105 : 100;
            }
            break;
        default: 
        score = game.dados.filter(dado => dado === whichGame +1).reduce((acc, cur) => acc +cur, 0);
        //numeros 1-6
        /*const dadosQueMeInteresan = [];
        for(let i = 0; i < game.dados.length; i++){
            if (game.dados[i] === whichGame + 1) {
                dadosQueMeInteresan.push(game.dados[i]);
            }
        }
        score = dadosQueMeInteresan.reduce((acc, cur) => acc + cur, 0);*/

       /* const dadosQueMeInteresan = game.dados.filter(function(dice) {
            return dice === whichGame + 1;
        });
        score = dadosQueMeInteresan.reduce((acc, cur) => acc + cur, 0);*/
        break;
    }
    return score;
}

const drawDices = () => {
    game.dados.forEach((dado, i) => {
        const diceElement = document.querySelector(`.dados-container .dado-${i + 1}`);
        if (diceElement) {
            //diceElement.innerHTML = dado;  // Muestra el valor del dado
            showDices(diceElement, dado);
        }
    });
};

const drawState = () => {
    document.getElementById("jugadorGenerala").innerHTML = game.turno;
    document.getElementById("movesGenerala").innerHTML = game.moves;
}

const rollDices = () => {
    for (let i = 0; i < game.dados.length; i++) {
        if (game.moves === 1 || !game.dadosSeleccionados[i]) {  // Solo lanza los dados que no están seleccionados
            game.dados[i] = Math.floor(Math.random() * 6) + 1;  // Genera un número entre 1 y 6
        }
    }
    game.dadosSeleccionados = [false, false, false, false, false];
    drawDices();  // Después de tirar los dados, actualiza la interfaz

    game.moves++;
    if (game.moves > 3){
        game.turno++;
        if(game.turno > game.jugadores) {
            game.turno = 1;
        }
        game.moves = 1;
        game.dadosSeleccionados = [false, false, false, false, false];
    }
    drawState();
};

const getGameName = whichGame => {
    const games = ['1', '2', '3', '4', '5', '6', 'E', 'F', 'P', 'G', 'D'];
    return games[whichGame];
}

const toggleDiceSelection = diceNumber => {
    game.dadosSeleccionados[diceNumber] = !game.dadosSeleccionados[diceNumber];
    const diceElement = document.querySelector(`.dados-container .dado-${diceNumber + 1}`);
    if (game.dadosSeleccionados[diceNumber]) {
        diceElement.classList.add("dadosSeleccionados");
    } else {
        diceElement.classList.remove("dadosSeleccionados");
    }
};

const cambiarSeleccion = (index) => {
    if (game.moves > 1 && game.moves <= 3) {
        game.dadosSeleccionados[index] = !juego.dadosSeleccionados[index];
        drawDices();
    }
};

const showDices = (contDiv, number) => {
    const sourceImg = document.getElementById(`d${number - 1}`);
    
    // Verificar si sourceImg existe antes de continuar
    if (!sourceImg) {
        console.error(`No se encontró la imagen con ID d${number - 1}`);
        return;
    }

    contDiv.innerHTML = '';  // Limpia el contenedor antes de añadir la imagen

    const img = document.createElement("img");
    img.setAttribute("width", DICE_SIZE);
    img.setAttribute("height", DICE_SIZE);
    img.setAttribute("alt", `dice ${number}`);
    img.setAttribute("src", sourceImg.src);  // Usa sourceImg.src para obtener la ruta de la imagen

    contDiv.appendChild(img);  // Añade la imagen al contenedor
};

document.getElementById("roll-btn").addEventListener("click", rollDices);

document.addEventListener("DOMContentLoaded", () => {
    initGame();
});