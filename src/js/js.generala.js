
const DICE_SIZE = 50;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

let currentGame;
let modalAction; // To keep track of what action the modal is handling
const modalContent = document.getElementById("modal-content");
const modalMessage = document.getElementById("modal-message");
const acceptButton = document.getElementById("accept-btn");
const cancelButton = document.getElementById("cancel-btn");

// muestra el modal
const showModal = (message, isConfirmation = false) => {
    modalContent.style.display = "flex";
    modalMessage.innerHTML = message;
    acceptButton.style.display = "block";
    acceptButton.innerHTML = isConfirmation ? "Tachar" : "Cerrar";
    cancelButton.style.display = isConfirmation ? "block" : "none";
};

// oculta el modal
const hideModal = () => {
    modalContent.style.display = "none";
};


//jugadas (expresiones regulares)
const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker = /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull = /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;

const game = {
    dados: [0, 0, 0, 0, 0],           // se inicializan en cero para que se vean así antes de la primer tirada
    dadosSeleccionados: [false, false, false, false, false],
    jugadores: 2,
    turno: 1,
    moves: 0,
    scores: [],
    round: 1,
}


// averiguar arrow functions!!
const initGame = () => {
    game.dados = [0, 0, 0, 0, 0];     // Al iniciar, los dados están en cero
    game.dadosSeleccionados = [false, false, false, false, false];
    game.turno = 1; //habría q hacer que empiece un jugador al azar game.jugadores
    game.moves = 0;
    
    for(let i = 0; i < game.jugadores; i++){
        game.scores.push([" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 0]); //el 0 es el total
    }

/*
    for (let p = 0; p < game.jugadores; p++){
        game.scores[p] = Array(12).fill(" ");
        game.scores[p][11] = 0;
    };
*/
    document.querySelectorAll(".dados-container .dados").forEach((diceElement, i) => {
        diceElement.addEventListener("click", () => toggleDiceSelection(i));
    });

    drawDices();
    drawState(); //actualiza el estado inicial de la interfaz
    drawScores();
};

const drawDot = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
};

const drawScores = () => {
    //console.log(game.jugadores, game.scores);
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
             // Aplica un color de fondo si es el turno actual
             if (p === game.turno - 1) {
                cellPlayerScore.style.backgroundColor = "#ffc0cb"; // color de fondo para el jugador en turno
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
                modalAction = "alreadyScored";
                showModal(`Ya se anotó el juego ${getGameName(j)}!!!`, false);
                return;
            }
             // Calcula el puntaje para ver si cumple con el juego seleccionado
        const jugada = calculateScore(j);
    
        // Si no cumple el juego, pregunta si desea tacharlo
        if (jugada === 0) {
            currentGame = j;  // Store the current game
            modalAction = "crossOut";
            showModal(`No tienes el juego ${getGameName(j)}. ¿Quiere tacharlo?`, true);
        }else{  
                const score = calculateScore(j);
                game.scores[game.turno - 1][j] = score === 0 ? "X" : score; //puntaje de cada juego
                game.scores[game.turno - 1][11] += score; //puntaje total de cada jugador
                changePlayerTurn();
                drawScores();
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
         // Aplica un color de fondo si es el turno actual
         if (p === game.turno - 1) {
            cellPlayerTotal.style.backgroundColor = "#d0e0f0"; // color de fondo para el jugador en turno
        }
        contTotal.appendChild(cellPlayerTotal);
    }
    contGames.appendChild(contTotal);
}

const calculateScore = whichGame => {
    let score = 0;
    switch(whichGame) {
        /*
        //puntajes por números sin optimizar
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            break;
        */
        case 6:
            if (isGameMatch(reEscalera)) {
               /* 
               if (isGameMatch(reEscalera)) {
                    if (game.moves === 1) {
                        score = 25;
                    } else {
                        score = 20;
                    }
                }
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
        
        /*
        const dadosQueMeInteresan = [];
        for(let i = 0; i < game.dados.length; i++){
            if (game.dados[i] === whichGame + 1) {
                dadosQueMeInteresan.push(game.dados[i]);
            }
        }
        let acc = 0;
        for (let i = 0; i < dadosQueMeInteresan.length; i++){
            acc += dadosQueMeInteresan[i]; //acc + cur
        }
        score = acc;
        */

    }
    return score;
}

const isGameMatch = regaex => {
    return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regaex) !== null;//hago una copia del array, lo ordena, lo convierte en un string y lo matchea con la expresion regular de la generala
}

const drawDices = () => {
    game.dados.forEach((dado, i) => {
        const diceElement = document.querySelector(`.dados-container .dado-${i + 1}`);
        
        showDice(diceElement, dado);

        // Agrega o quita la clase de selección visual según el estado de cada dado
        if (game.dadosSeleccionados[i]) {
            diceElement.classList.add("dadosSeleccionados");
        } else {
            diceElement.classList.remove("dadosSeleccionados");
        }
        
        //diceElement.innerHTML = dado;  // Muestra el valor actual de cada dado
    });
};

const drawState = () => {
    document.getElementById("jugadorGenerala").innerHTML = game.turno;
    document.getElementById("movesGenerala").innerHTML = game.moves;
}

//modal
acceptButton.addEventListener("click", () => {
    hideModal();
    if (modalAction === "crossOut") {
        game.scores[game.turno - 1][currentGame] = "X";
        changePlayerTurn();
        drawScores();
    }
});

cancelButton.addEventListener("click", () => {
    hideModal();
});


const rollDices = () => {
    for (let i = 0; i < game.dados.length; i++) {
        if (game.moves === 0 || game.dadosSeleccionados[i]) {
            // Genera un valor aleatorio en la primera tirada o para los dados seleccionados
            game.dados[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
    game.dadosSeleccionados = [false, false, false, false, false];
    drawDices();  // Actualiza la vista de los dados con los valores de la tirada

    console.log('---');
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(whichGame => console.log(`Game ${getGameName(whichGame)} score: ${calculateScore(whichGame)}`));


    game.moves++;
    if (game.moves === 3) {
        document.getElementById("roll-btn").setAttribute("disabled", "disabled");
    }
    if (game.moves > 3) {             // Si el jugador ya hizo tres tiradas
        game.turno++;                 // Cambia al siguiente jugador
        if (game.turno > game.jugadores) {
            game.turno = 1;           // Si pasa el último jugador, vuelve al primero
        }
        game.moves = 0;
        game.dados = [0, 0, 0, 0, 0]; // Al cambiar de turno, los dados se resetean a ceros (NUEVO)
        drawDices();                  // Muestra los ceros en pantalla para el nuevo jugador (NUEVO)
    }
    drawState();                      // Actualiza el estado del juego (jugador actual y tiradas)
};

const changePlayerTurn = () => {
    game.dados = [0, 0, 0, 0, 0];
    game.dadosSeleccionados = [false, false, false, false, false];
    game.moves = 0;
    game.turno++;
    if (game.turno > game.jugadores) {
        game.turno = 1;           // Si pasa el último jugador, vuelve al primero
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

const toggleDiceSelection = diceNumber => {
    game.dadosSeleccionados[diceNumber] = !game.dadosSeleccionados[diceNumber]; //hace que lo que era true sea false y al reves
    const diceElement = document.querySelector(`.dados-container .dado-${diceNumber + 1}`);//lo visual!!
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
    showModal(`J${winner + 1} ganó con ${winningScore} puntos!`, false);
}

//presentación de los dados
const drawDice = (cont, number) => {
    let ctx = cont.getContext("2d");

    // Limpia el canvas
    ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

    // Dibuja el cuadrado del dado
    ctx.beginPath();
    ctx.rect(0, 0, DICE_SIZE, DICE_SIZE);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();

    // Dibuja los puntos en función del número
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