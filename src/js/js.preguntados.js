const options = document.getElementById("opciones");
let buttonCategories;
let buttonOption;

let timer;
const reloj = document.getElementById("reloj");
const relojContainer = document.getElementById("reloj-container"); 

const scoreContent = document.getElementById("score-preg");

const modalContent = document.getElementById("modal-content-preg");
const modalMessage = document.getElementById("modal-message-preg");
const correctButton = document.getElementById("correct-btn-preg");
const incorrectButton = document.getElementById("incorrect-btn-preg");

const restartButton = document.getElementById("restart-btn-preg");
const backToMain = document.getElementById("back-to-main-preg");
const overlay = document.getElementById("overlay-preg");

const preguntaContainer = document.getElementById("pregunta-container");

const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spinButton');
const rouletteContainer = document.getElementById("roulette-container");

const game = {
    score: [0, 0],
    currentCategory: null,
    currentQuestionIndex: 0,
    categories: [
        {
            name: "Geografía",
            questions: [
                { question: "¿Cuál es el río más largo del mundo?", options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correctIndex: 0 },
                { question: "¿Cuál es la capital de Argentina", options: ["San Luis", "Neuquén", "La Pampa", "Buenos Aires"], correctIndex: 3 },
                { question: "¿En qué continente se encuentra el desierto del Sahara?", options: ["Asia", "América", "África", "Oceanía"], correctIndex: 2 },
                { question: "¿Cuál es el país más grande del mundo por superficie?", options: ["Canadá", "China", "Rusia", "Brasil"], correctIndex: 2 },
                { question: "¿Qué país tiene la mayor cantidad de islas?", options: ["Indonesia", "Suecia", "Filipinas", "Japón"], correctIndex: 1 },
                { question: "¿Qué océano es el más grande del mundo?", options: ["Pacífico", "Atlántico", "Índico", "Ártico"], correctIndex: 0 },
                { question: "¿Qué cordillera es la más larga del mundo?", options: ["Himalaya", "Andes", "Alpes", "Montañas Rocosas"], correctIndex: 1 },
                { question: "¿Qué país tiene el mayor número de habitantes?", options: ["India", "Estados Unidos", "China", "Brasil"], correctIndex: 2 },
                { question: "¿Qué isla es la más grande del mundo?", options: ["Madagascar", "Nueva Guinea", "Borneo", "Groenlandia"], correctIndex: 3 },
                { question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Brisbane"], correctIndex: 2 }, 
            ],
            color: "#80b4ff"
        },
        {
            name: "Entretenimiento",
            questions: [
                { question: "¿Cuál es la película más taquillera de la historia?", options: ["Avatar", "Avengers: Endgame", "Titanic", "El Rey León"], correctIndex: 0 },
                { question: "¿Qué banda cantó Bohemian Rhapsody?", options: ["The Beatles", "Queen", "Pink Floyd", "The Rolling Stones"], correctIndex: 1 },
                { question: "¿Qué serie tiene el récord de mayor cantidad de premios Emmy ganados?", options: ["Game of Thrones", "Friends", "The Simpsons", "Breaking Bad"], correctIndex: 0 },
                { question: "¿Qué banda lanzó el álbum The Dark Side of the Moon?", options: ["Led Zeppelin", "Queen", "Pink Floyd", "The Rolling Stones"], correctIndex: 2 },
                { question: "¿Quién protagonizó la película Forrest Gump?", options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Tom Hanks"], correctIndex: 3 },
                { question: "¿Qué videojuego se convirtió en el más vendido de todos los tiempos?", options: ["Tetris", "Minecraft", "GTA", "Mario Kart 8"], correctIndex: 1 },
                { question: "¿Cómo se llama el villano principal en Los Vengadores: Infinity War?", options: ["Loki", "Thanos", "Ultron", "Red Skull"], correctIndex: 1 },
                { question: "¿Cuál es la película animada con mayor recaudación en la historia?", options: ["Intensamente 2", "Frozen II", "El Rey León", "Toy Story 4"], correctIndex: 0 },
                { question: "¿Qué álbum de la famosa cantante Taylor Swift contiene la canción 22", options: ["1989", "Reputation", "Fearless", "Red"], correctIndex: 3 },
                { question: "¿En qué año se emitió el primer episodio de Los Simpson?", options: ["1985", "1987", "1989", "1990"], correctIndex: 2 }, 
            ],
            color: "#ff9ad4"
        },
        {
            name: "Arte",
            questions: [
                { question: "¿Quién pintó la famosa obra La última cena?", options: ["Leonardo da Vinci", "Miguel Ángel", "Vincent van Gogh", "Salvador Dalí"], correctIndex: 0 },
                { question: "¿De qué país es originario el arte del origami?", options:["China", "Corea", "Japón", "Tailandia"], correctIndex: 2 },
                { question: "¿A qué movimiento artístico pertenece Salvador Dalí?", options: ["Impresionismo", "Cubismo", "Surrealismo", "Expresionismo"], correctIndex: 2 },
                { question: "¿Quién esculpió el David?", options: ["Donatello", "Miguel Ángel", "Rodin", "Bernini"], correctIndex: 1 },
                { question: "¿Quién pintó La noche estrellada?", options: ["Vincent van Gogh", "Claude Monet", "Edgar Degas", "Paul Gauguin"], correctIndex: 0 },
                { question: "¿Qué famoso pintor español es conocido por su Guernica?", options: ["Salvador Dalí", "Joan Miró", "Francisco de Goya", "Pablo Picasso"], correctIndex: 3 },
                { question: "¿Quién pintó Las Meninas?", options: ["Diego Velázquez", "El Greco", "Francisco de Goya", "Joaquín Sorolla"], correctIndex: 0 },
                { question: "¿Quién pintó el techo de la Capilla Sixtina?", options: ["Rafael", "Miguel Ángel", "Leonardo da Vinci", "Caravaggio"], correctIndex: 1 },
                { question: "¿Quién es el autor del famoso cuadro El grito?", options: ["Edvard Munch", "Gustav Klimt", "Paul Cézanne", "Henri Matisse"], correctIndex: 0 },
                { question: "¿En qué ciudad se encuentra el Museo del Prado?", options: ["París", "Barcelona", "Roma", "Madrid"], correctIndex: 3 }, 
            ],
            color: "#ee646d"
        },
        {
            name: "Historia",
            questions: [
                { question: "¿En qué año se descubrió América?", options: ["1452", "1492", "1512", "1482"], correctIndex: 1 },
                { question: "¿En qué país comenzó la Revolución Industrial?", options: ["Inglaterra", "Francia", "Alemania", "Argentina"], correctIndex: 0 },
                { question: "¿En qué año comenzó la Primera Guerra Mundial?", options: ["1912", "1914", "1916", "1918"], correctIndex: 1 },
                { question: "¿Quién fue el primer presidente de los Estados Unidos?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correctIndex: 2 },
                { question: "¿Qué civilización construyó la ciudad de Machu Picchu?", options: ["Azteca", "Inca", "Maya", "Olmeca"], correctIndex: 1 },
                { question: "¿Qué tratado puso fin a la Primera Guerra Mundial?", options: ["Tratado de París", "Tratado de Tordesillas", "Tratado de Versalles", "Tratado de Westfalia"], correctIndex: 2 },
                { question: "¿Cuál fue el primer país en abolir la esclavitud?", options: ["Estados Unidos", "Francia", "Haití", "Inglaterra"], correctIndex: 2 },
                { question: "¿Qué mujer francesa lideró tropas durante la Guerra de los Cien Años?", options: ["María Antonieta", "Juana de Arco", "Catalina de Médici", "Leonor de Aquitania"], correctIndex: 1 },
                { question: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2 },
                { question: "¿Quién fue el líder de la campaña libertadora del sur de América?", options: ["Simón Bolívar", "Manuel Belgrano", "Juan Manuel de Rosas", "José de San Martín"], correctIndex: 3 },
            ],
            color: "#fcd94e"
        }
    ],
    jugadores: 2, 
    turno: 1, // jugador que está respondiendo (1 o 2)
    round: 1, // ronda actual (de 1 a 15)
    moves: 1, //movimientos por jugador
    timer: 20, // tiempo restante en segundos
    maxPoints: 10,
    minPoints: 1,
};

const initGame = () => {
    game.turno = 1;
    game.round = 1;
    game.moves = 1;
    game.score = [0, 0];
    reloj.innerHTML = 20;
    options.addEventListener("click", selectOption);
    drawState();
};



const showModal = (message, correct = false, reiniciar = false) => {
    modalContent.style.display = "flex";
    overlay.style.display = "block";
    modalMessage.innerHTML = message;

    //arrancan ocultos todos los botones
    correctButton.style.display = "none";
    incorrectButton.style.display = "none";
    restartButton.style.display = "none";
    backToMain.style.display = "none";
    //muestran los botones que corresponden
    if (reiniciar) {
        restartButton.style.display = "block";
        backToMain.style.display = "block";
    } else {
        correctButton.style.display = correct ? "block" : "none";
        incorrectButton.style.display = !correct ? "block" : "none";
    }
};

const mainDisplay = () => {
    document.getElementById("h1-preg").style.display = "flex";
    document.getElementById("btn-g3-back").style.display = "flex";
    relojContainer.style.display = "none";
    document.getElementById("preg-main-info").style.display = "flex";
    rouletteContainer.style.display = "flex";
    preguntaContainer.style.display = "none";
}

const questionDisplay = () => {
    preguntaContainer.style.display = "flex";
    relojContainer.style.display = "flex";
    document.getElementById("preg-main-info").style.display = "none";
    document.getElementById("h1-preg").style.display = "none";
    document.getElementById("btn-g3-back").style.display = "none";
    rouletteContainer.style.display = "none";
}

correctButton.addEventListener("click", () => {
    hideModal();
    mainDisplay();
});

incorrectButton.addEventListener("click", () => {
    hideModal();
    mainDisplay();
});

restartButton.addEventListener("click", () => {
    hideModal();
    initGame();
    mainDisplay();
    document.getElementById("btn-g3-back").removeAttribute("disabled", "disabled");
});

backToMain.addEventListener("click", () => {
    hideModal();
    initGame();
    mainDisplay();
    document.getElementById("btn-g3-back").removeAttribute("disabled", "disabled");
    document.getElementById("main").classList.remove("nodisp");
    document.getElementById("g3").classList.add("nodisp");
});

const hideModal = () => {
    modalContent.style.display = "none";
    overlay.style.display = "none";
};

//TIMER
const startTimer = () => {
    
    timer = setInterval(() => {
        game.timer--;
        reloj.innerHTML = game.timer;
        reloj.style.color = "black";

        if(game.timer <= 10){
            reloj.style.color = "#F62633";
        }

        if (game.timer <= 0) {
            clearInterval(timer);
            console.log("¡Tiempo agotado!"); // Mensaje de tiempo agotado
            showModal(`¡Se agotó el tiempo!`, false, false);
            game.turno = (game.turno % 2) + 1;
            drawState();
            console.log(game.turno);
        }
    }, 1000);
};

//RULETA + MUESTRA PREGUNTACONTAINER
spinButton.addEventListener('click', () => {
    document.getElementById("btn-g3-back").setAttribute("disabled", "disabled");
    // Disable button during spin
    spinButton.disabled = true;
    
    // Completely remove any existing rotation transform
    wheel.style.removeProperty('transform');
    
    // Force a reflow to ensure the reset takes effect
    void wheel.offsetWidth;

    // crea una rotacion aleatoria, da al menos 5 vueltas
    const totalRotation = 1800 + Math.random() * 360; 
    wheel.style.transition = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // cuando termina de girar sale categoría aleatoria
    setTimeout(() => {
        
        const finalRotation = totalRotation % 360; // calcula el angul final descontando las vueltas completas (el resto de 360)
        const sectors = game.categories.length; // Número de categorías dinámico
        const degreesPerSector = 360 / sectors; // Tamaño de cada sector


        const categoryIndex = Math.floor((360 - finalRotation) / degreesPerSector) % sectors;

        const selectedColor = game.categories[categoryIndex].color;
        
        // Detailed console logs for debugging
        console.log("Total Rotation:", totalRotation);
        console.log("Final Rotation:", finalRotation);
        console.log("Degrees per Sector:", degreesPerSector);
        console.log("Category Index:", categoryIndex);
        console.log("Selected Color:", selectedColor);

        game.currentCategory = game.categories[categoryIndex];
        questionDisplay();
        showCategory(); 
        startTimer(game.timer = 20);

        wheel.style.transition = "none";
        wheel.style.transform = "rotate(0deg)";
        spinButton.disabled = false;
    }, 4000);
});



const showCategory = () => {
    const textCurrentCategory = document.getElementById("categoria-seleccionada");
    textCurrentCategory.innerHTML = game.currentCategory.name;
    preguntaContainer.style.backgroundColor = game.currentCategory.color;
    showQuestion(); 
    createOptions(); 
}

const showQuestion = () => {
    
    const pregunta = document.getElementById("pregunta");

    //hacer math random para la pregunta
    game.currentQuestionIndex = Math.floor(Math.random() * game.currentCategory.questions.length);

    if(preguntaContainer && game.currentCategory){ //verifica que exista el contenedor de preguntas y que currentCategory tenga valor válido
        preguntaContainer.style.display = "flex";
        const currentQuestion = game.currentCategory.questions[game.currentQuestionIndex].question;
        pregunta.innerHTML = currentQuestion;
    };
};

let currentQuestion;
let newCorrectIndex;
let currentOptions;

const createOptions = () => {
    options.innerHTML = "";

    currentQuestion = game.currentCategory.questions[game.currentQuestionIndex];

    // crea una copia del array de opciones para no modificar la original
    currentOptions = currentQuestion.options.slice();

    // guarda la opción correcta
    const correctOption = currentQuestion.options[currentQuestion.correctIndex];

    // mezcla las opciones
    shuffle(currentOptions);


    // calcula el índice correcto después del shuffle
    newCorrectIndex = currentOptions.indexOf(correctOption);


    // renderiza botones con las opciones mezcladas
    for (let i = 0; i < currentOptions.length; i++) {
        buttonOption = document.createElement("button");
        buttonOption.innerHTML = currentOptions[i];
        buttonOption.setAttribute("data-option", i);
        options.appendChild(buttonOption);
    }
};

function shuffle(object) { //fisher yates
    for (let i = object.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [object[i], object[j]] = [object[j], object[i]]; // intercambia las posiciones
    }
    return object;
}

const drawState = () => {
    scoreContent.innerHTML = "";
    for(let i = 0; i < game.jugadores; i++){
        
        const playerScore = document.createElement("p");
        playerScore.style.borderRadius = "30px";
        playerScore.style.padding = "0.6em";
        playerScore.style.border = "2px solid black";
        
        playerScore.innerHTML = "Jugador "+[i + 1]+": "+ game.score[i];
        if (i === game.turno - 1) {
            playerScore.style.backgroundColor = "#FFECC1"; // color de fondo para el jugador en turno
        }
        scoreContent.appendChild(playerScore);
    }
    document.getElementById("intento").innerHTML = game.moves;
    document.getElementById("round-preg").innerHTML = game.round;
}

const changePlayer = () => {
    if (game.turno > game.jugadores) {
        game.turno = 1;  // si pasa el último jugador, vuelve al primero
        game.round++;
    }
}

const selectOption = (event) => {
    const selectedOptionIndex = event.target.getAttribute("data-option");
    if (selectedOptionIndex === null) return;

    if (game.round <= 3) {
        if (parseInt(selectedOptionIndex) === newCorrectIndex) {
            clearInterval(timer);
            const pointsEarned = Math.max(game.minPoints, Math.ceil((game.timer / 20) * game.maxPoints));
            game.score[game.turno - 1] += pointsEarned;
            showModal(`Correcto, sumaste ${pointsEarned} puntos! Seguí jugando`, true, false);

            game.moves++;
            if (game.moves > 3) { 
                game.turno++;
                game.moves = 1;
            }
        } else {
            clearInterval(timer);
            game.moves = 1;
            game.turno++;
            showModal(`Incorrecto, la respuesta correcta era: ${currentOptions[newCorrectIndex]}`, false, false);
        }

        if (game.round === 3 && game.turno > game.jugadores) {
            determinarGanador();
            return;
        }
        reloj.innerHTML = 20;
        changePlayer();
        drawState();
    }
};

const determinarGanador = () => {
    let winner;
        let winningScore;
        
    if(game.score[0] === game.score[1]){
            showModal(`Empate! no gano ninguno`, false, true);
    }else if(game.score[0] !== game.score[1]){
        if(game.score[0] >= game.score[1]){
            winningScore = game.score[0];
            winner = "1";
        }else{
            winningScore = game.score[1];
            winner = "2";
        }
        showModal(`J${winner + 1} ganó con ${winningScore} puntos!`, false, true);
    }
            
        clearInterval(timer);
        console.log(winner, winningScore);
        
        initGame();
};

document.addEventListener("DOMContentLoaded", () => {
    initGame();
    options.addEventListener("click", selectOption);
});