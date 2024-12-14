
const DICE_SIZE = 60;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

//indica el índice del juego q se quiere anotar, mas adelante le paso el valor
let gameToScore = null;
const modalContent = document.getElementById("modal-content");
const modalMessage = document.getElementById("modal-message");
const acceptButton = document.getElementById("accept-btn");
const cancelButton = document.getElementById("cancel-btn");
const restartButton = document.getElementById("restart-btn");
const backToMain = document.getElementById("back-to-main");
const overlay = document.getElementById("overlay");



//jugadas (expresiones regulares)
const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker = /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull = /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;

const game = {
    dados: [0, 0, 0, 0, 0],  
    dadosSeleccionados: [false, false, false, false, false],
    jugadores: 2,
    turno: 1,
    moves: 0,
    scores: [],
    round: 1,
}

const initGame = () => {
    game.dados = [0, 0, 0, 0, 0];     // al iniciar los dados están en cero
    game.dadosSeleccionados = [false, false, false, false, false];
    game.turno = 1; 
    game.moves = 0;
    game.scores = [];
    
    for(let i = 0; i < game.jugadores; i++){
        game.scores.push([" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 0]); //el 0 es el total
    }

    document.querySelectorAll(".dados-container .dados").forEach((diceElement, i) => {
        diceElement.addEventListener("click", () => toggleDiceSelection(i));
    });

    drawDices();
    drawState(); //actualiza el estado inicial de la interfaz
    drawScores();
};

function showSection(sectionId){
    document.getElementById(sectionId).classList.remove("nodisp");
}

// muestra el modal
const showModal = (message, confirmar = false, reiniciar = false) => {
    modalContent.style.display = "flex";
    overlay.style.display = "block";
    modalMessage.innerHTML = message;
    //si confirmar es true el botón dice "Tachar", sino "Cerrar"
    acceptButton.innerHTML = confirmar ? "Tachar" : "Cerrar";
    //si reiniciar es true que no se muestre el botón
    acceptButton.style.display = reiniciar ? "none" : "block";
    //si confirmar es true el botón aparece, sino se oculta
    cancelButton.style.display = confirmar ? "block" : "none";
    //muestra el boton solo cuando reiniciar es true
    restartButton.style.display = reiniciar ? "block" : "none";
    backToMain.style.display = reiniciar ? "block" : "none";
    if (reiniciar) {
        restartButton.onclick = () => {
            initGame(); 
            hideModal();
            document.getElementById("btn-g2-back").removeAttribute("disabled", "disabled");
        };
        backToMain.onclick = () => {
            hideModal();
            initGame();
            showSection("main");
            document.getElementById("g2").classList.add("nodisp");
            document.getElementById("btn-g2-back").removeAttribute("disabled", "disabled");
        }
    }else{
        restartButton.onclick = null; //limpiar el evento
    }
};

// oculta el modal
const hideModal = () => {
    modalContent.style.display = "none";
    overlay.style.display = "none";
};



const drawScores = () => {
    // header
    const contHeader = document.querySelector("#g2 .scores table thead tr");
    contHeader.innerHTML = "";
    const cellGame = document.createElement("th");
    cellGame.innerHTML = "juego";
    contHeader.appendChild(cellGame);

    for (let i = 0; i < game.jugadores; i++) {
        const cellPlayerName = document.createElement("th");
        cellPlayerName.innerHTML = `J${i + 1}`;
        contHeader.appendChild(cellPlayerName);
        if (i === game.turno - 1) {
            cellPlayerName.style.backgroundColor = "#FFECC1"; // color de fondo para el jugador en turno
        }
    }

    // juegos
    const contGames = document.querySelector("#g2 .scores table tbody");
    contGames.innerHTML = ""; // contenido vacío

    //agrega fila por cada juego
    for (let j = 0; j < 11; j++) {
        const contGame = document.createElement("tr");
        const cellGameName = document.createElement("th");
        cellGameName.innerHTML = getGameName(j);
        contGame.appendChild(cellGameName);

        for (let p = 0; p < game.jugadores; p++) {
            const cellPlayerScore = document.createElement("td");
            cellPlayerScore.innerHTML = game.scores[p][j];     //que se creen celdas de cant de juegos por la cant de los jugadores
             // aplica un color de fondo si es el turno actual
             if (p === game.turno - 1) {
                cellPlayerScore.style.backgroundColor = "#62B273"; // color de fondo para el jugador en turno
            }
            contGame.appendChild(cellPlayerScore);
        }
        contGames.appendChild(contGame);
        contGame.addEventListener("click", () => {
            if(game.dados.some(dado => dado === 0)){ //esto es para determinar que tiré una vez al menos. si al menos algún dado esta en 0 que no se ejecute la función (anotar puntaje)
                return; // termina la función, que no se ejecute lo que sigue 
            }
            console.info(`attempt to score on game ${getGameName(j)}`);
            if (game.scores[game.turno - 1][j] !== " "){
                showModal(`Ya se anotó el juego ${getGameName(j)}!!!`, false);
                return;
            }
            const jugada = calculateScore(j);

            if (jugada === 0) {
                gameToScore = j;
                
                showModal(`No tienes el juego ${getGameName(j)}. ¿Quiere tacharlo?`, true, false);
                if (getGameName(j) === 'G' && game.scores[game.turno - 1][10] !== "X") { 
                    showModal("No se puede tachar la Generala sin tachar la Doble Generala", false, false);
                } 
            }else {
                if (getGameName(j) === 'D' && game.scores[game.turno - 1][9] === " ") {
                    showModal("No se puede anotar la Doble Generala sin haber anotado la Generala primero", false, false);
                } else{
                    game.scores[game.turno - 1][j] = jugada;
                    game.scores[game.turno - 1][11] += jugada;
                    changePlayerTurn();
                    drawScores();
                }
                    
            } 
        });
    }
    // total
    const contTotal = document.createElement("tr");
    const cellTotalName = document.createElement("th");
    cellTotalName.innerHTML = "total";
    contTotal.appendChild(cellTotalName);

    for (let p = 0; p < game.jugadores; p++) {
        const cellPlayerTotal = document.createElement("td");
        cellPlayerTotal.innerHTML = game.scores[p][11];
         // aplica un color de fondo si es el turno actual
         if (p === game.turno - 1) {
            cellPlayerTotal.style.backgroundColor = "#FFECC1"; // color de fondo para el jugador en turno
        }
        contTotal.appendChild(cellPlayerTotal);
    }
    contGames.appendChild(contTotal);
}

const calculateScore = whichGame => {
    let score = 0;
    switch(whichGame) {
      //comienza con los juegos
        case 6:
            if (isGameMatch(reEscalera)) {
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
        //puntaje por números optimizado. primero se fija si es generala, etc y si no es va a default
        default: 
            //score = game.dados.filter(dado => dado === whichGame +1).reduce((acc, cur) => acc +cur, 0);
            const dadosQueMeInteresan = game.dados.filter(function (dado){
                return dado === whichGame + 1;
            });
            score = dadosQueMeInteresan.reduce((acc, cur) => acc + cur, 0);

        //filtro los dados que no son del número que quiero, me quedo solo cn los que quiero y esos sumo
        //.filter es una función que cuando es true lo que devuelve se queda en el array y cuando es false no queda
            break;
    }
    return score;
}

const isGameMatch = regaex => { //verifica si matchea
    return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regaex) !== null;//hago una copia del array, lo ordena de menor a mayor, lo convierte en un string y lo matchea con la expresion regular de la generala
}

const drawDices = () => {
    game.dados.forEach((dado, i) => { //dado es el valor de cada dado (del 1 al 6), i es cada dado (del 0 al 4)
        const diceElement = document.querySelector(`.dados-container .dado-${i + 1}`);
        
        showDice(diceElement, dado);

        // agrega o quita la clase de selección visual según el estado de cada dado
        if (game.dadosSeleccionados[i]) {
            diceElement.classList.add("dadosSeleccionados");
        } else {
            diceElement.classList.remove("dadosSeleccionados");
        }
        
    });
};

const drawState = () => {
    document.getElementById("jugadorGenerala").innerHTML = game.turno;
    document.getElementById("movesGenerala").innerHTML = game.moves;
}

//boton aceptar del modal
acceptButton.addEventListener("click", () => {
    hideModal();
    if (gameToScore !== null && acceptButton.innerHTML === "Tachar") {
        game.scores[game.turno - 1][gameToScore] = "X";
        changePlayerTurn();
        drawScores();
        gameToScore = null; // después de usarlo lo limpio para el próximo
    }
});

cancelButton.addEventListener("click", () => {
    hideModal();
    gameToScore = null;
});


const rollDices = () => {
    for (let i = 0; i < game.dados.length; i++) {
        if (game.moves === 0 || game.dadosSeleccionados[i]) {
            // genera un valor aleatorio en la primera tirada o para los dados seleccionados
            game.dados[i] = Math.floor(Math.random() * 6) + 1;
            console.log(`Dado ${i + 1}: ${game.dados[i]}`); // Muestra el valor de cada dado después de lanzarlo
        }
    }
    game.dadosSeleccionados = [false, false, false, false, false];
    drawDices();  // actualiza los dados

    console.log('---');
    //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(whichGame => console.log(`Game ${getGameName(whichGame)} score: ${calculateScore(whichGame)}`));
    console.log(`Tirada ${game.moves + 1}:`, game.dados); // muestra el estado completo de los dados después de cada tirada


    game.moves++;
    if (game.moves === 1) {
        document.getElementById("btn-g2-back").setAttribute("disabled", "disabled");
    }
    if (game.moves === 3) {
        document.getElementById("roll-btn").setAttribute("disabled", "disabled");
    }
    if (game.moves > 3) {    // si el jugador ya hizo tres tiradas
        game.turno++;    // cambia al siguiente jugador
        if (game.turno > game.jugadores) {
            game.turno = 1;  // si pasa el último jugador, vuelve al primero
        }
        game.moves = 0;
        game.dados = [0, 0, 0, 0, 0]; // al cambiar de turno, los dados se resetean a ceros
        drawDices(); // y los vuelve a mostrar
    }
    drawState();    // actualiza el estado del juego (jugador actual y tiradas)
};

const changePlayerTurn = () => {
    game.dados = [0, 0, 0, 0, 0];
    game.dadosSeleccionados = [false, false, false, false, false];
    game.moves = 0;
    game.turno++;
    if (game.turno > game.jugadores) {
        game.turno = 1;  
        game.round++;
        if(game.round === 12){
            gameOver();
        }
    }
    document.getElementById("roll-btn").removeAttribute("disabled");
    drawDices();
    drawState();
}

const getGameName = whichGame => {
    const games = ['1', '2', '3', '4', '5', '6', 'E', 'F', 'P', 'G', 'D'];
    return games[whichGame];
}

//se le aplica una clase a los dados seleccionados
const toggleDiceSelection = diceNumber => {
    game.dadosSeleccionados[diceNumber] = !game.dadosSeleccionados[diceNumber]; //hace que lo que era true sea false y al reves
    const diceElement = document.querySelector(`.dados-container .dado-${diceNumber + 1}`);
    if (game.dadosSeleccionados[diceNumber]) {
        diceElement.classList.add("dadosSeleccionados");
    } else {
        diceElement.classList.remove("dadosSeleccionados");
    }
};

const gameOver = () => {
    document.getElementById("roll-btn").setAttribute("disabled", "disabled");
    let winner = 0;
    let winningScore = 0;
    for(let i = 0; i < game.jugadores; i++){
        if(game.scores[i][11] > winningScore){
            winningScore = game.scores[i][11];
            winner = i;
        }
    }
    showModal(`J${winner + 1} ganó con ${winningScore} puntos!`, false, true);
}

//presentación de los dados
const drawDot = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
};

const drawDice = (cont, number) => {
    let ctx = cont.getContext("2d");

    // limpia el canvas
    ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

    // dibuja el cuadrado del dado
    ctx.beginPath();
    ctx.rect(0, 0, DICE_SIZE, DICE_SIZE);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();

    // dibuja los puntos en función del número
    switch (number) {
        case 1:
            drawDot(ctx, AT_HALF, AT_HALF);
            break;
        case 2:
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            break;
        case 3:
            drawDot(ctx, AT_HALF, AT_HALF);
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            break;
        case 4:
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_QUARTER);
            drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
            break;
        case 5:
            drawDot(ctx, AT_HALF, AT_HALF);
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_QUARTER);
            drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
            break;
        case 6:
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_QUARTER);
            drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_HALF);
            drawDot(ctx, AT_3QUARTER, AT_HALF);
            break;
    }
};

const showDice = (contDiv, number) => {
    contDiv.innerHTML = null;
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", DICE_SIZE);
    canvas.setAttribute("height", DICE_SIZE);
    drawDice(canvas, number);
    contDiv.appendChild(canvas);
};

document.getElementById("roll-btn").addEventListener("click", rollDices);

document.addEventListener("DOMContentLoaded", () => {
    initGame();
});