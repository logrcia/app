const categories = document.getElementById("categorias");
const options = document.getElementById("opciones");
let buttonCategories;
let buttonOption;
let timer;
const reloj = document.getElementById("reloj");

const scoreContent = document.getElementById("score-preg");

const modalContent = document.getElementById("modal-content-preg");
const modalMessage = document.getElementById("modal-message-preg");
const correctButton = document.getElementById("correct-btn-preg");
const incorrectButton = document.getElementById("incorrect-btn-preg");
const restartButton = document.getElementById("restart-btn-preg");
const backToMain = document.getElementById("back-to-main-preg");
const overlay = document.getElementById("overlay-preg");


const preguntaContainer = document.getElementById("pregunta-container");


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
               /* { question: "¿En qué continente se encuentra el desierto del Sahara?", options: ["Asia", "América", "África", "Oceanía"], correctIndex: 2 },
                { question: "¿Cuál es el país más grande del mundo por superficie?", options: ["Canadá", "China", "Rusia", "Brasil"], correctIndex: 2 },
                { question: "¿Qué país tiene la mayor cantidad de islas?", options: ["Indonesia", "Suecia", "Filipinas", "Japón"], correctIndex: 1 },
                { question: "¿Qué océano es el más grande del mundo?", options: ["Pacífico", "Atlántico", "Índico", "Ártico"], correctIndex: 0 },
                { question: "¿Qué cordillera es la más larga del mundo?", options: ["Himalaya", "Andes", "Alpes", "Montañas Rocosas"], correctIndex: 1 },
                { question: "¿Qué país tiene el mayor número de habitantes?", options: ["India", "Estados Unidos", "China", "Brasil"], correctIndex: 2 },
                { question: "¿Qué isla es la más grande del mundo?", options: ["Madagascar", "Nueva Guinea", "Borneo", "Groenlandia"], correctIndex: 3 },
                { question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Brisbane"], correctIndex: 2 },
                 */
            ],
            color: "#3475D3"
        },
        {
            name: "Entretenimiento",
            questions: [
                { question: "¿Cuál es la película más taquillera de la historia?", options: ["Avatar", "Avengers: Endgame", "Titanic", "El Rey León"], correctIndex: 0 },
                { question: "¿Qué banda cantó Bohemian Rhapsody?", options: ["The Beatles", "Queen", "Pink Floyd", "The Rolling Stones"], correctIndex: 1 },
                /*{ question: "¿Qué serie tiene el récord de mayor cantidad de premios Emmy ganados?", options: ["Game of Thrones", "Friends", "The Simpsons", "Breaking Bad"], correctIndex: 0 },
                { question: "¿Qué banda lanzó el álbum The Dark Side of the Moon?", options: ["Led Zeppelin", "Queen", "Pink Floyd", "The Rolling Stones"], correctIndex: 2 },
                { question: "¿Quién protagonizó la película Forrest Gump?", options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Tom Hanks"], correctIndex: 3 },
                { question: "¿Qué videojuego se convirtió en el más vendido de todos los tiempos?", options: ["Tetris", "Minecraft", "GTA", "Mario Kart 8"], correctIndex: 1 },
                { question: "¿Cómo se llama el villano principal en Los Vengadores: Infinity War?", options: ["Loki", "Thanos", "Ultron", "Red Skull"], correctIndex: 1 },
                { question: "¿Cuál es la película animada con mayor recaudación en la historia?", options: ["Intensamente 2", "Frozen II", "El Rey León", "Toy Story 4"], correctIndex: 0 },
                { question: "¿Qué álbum de la famosa cantante Taylor Swift contiene la canción 22", options: ["1989", "Reputation", "Fearless", "Red"], correctIndex: 3 },
                { question: "¿En qué año se emitió el primer episodio de Los Simpson?", options: ["1985", "1987", "1989", "1990"], correctIndex: 2 },
                 */
            ],
            color: "#FA9BD1"
        },
        {
            name: "Arte",
            questions: [
                { question: "¿Quién pintó la famosa obra La última cena?", options: ["Leonardo da Vinci", "Miguel Ángel", "Vincent van Gogh", "Salvador Dalí"], correctIndex: 0 },
                { question: "¿De qué país es originario el arte del origami?", options:["China", "Corea", "Japón", "Tailandia"], correctIndex: 2 },
               /* { question: "¿A qué movimiento artístico pertenece Salvador Dalí?", options: ["Impresionismo", "Cubismo", "Surrealismo", "Expresionismo"], correctIndex: 2 },
                { question: "¿Quién esculpió el David?", options: ["Donatello", "Miguel Ángel", "Rodin", "Bernini"], correctIndex: 1 },
                { question: "¿Quién pintó La noche estrellada?", options: ["Vincent van Gogh", "Claude Monet", "Edgar Degas", "Paul Gauguin"], correctIndex: 0 },
                { question: "¿Qué famoso pintor español es conocido por su Guernica?", options: ["Salvador Dalí", "Joan Miró", "Francisco de Goya", "Pablo Picasso"], correctIndex: 3 },
                { question: "¿Quién pintó Las Meninas?", options: ["Diego Velázquez", "El Greco", "Francisco de Goya", "Joaquín Sorolla"], correctIndex: 0 },
                { question: "¿Quién pintó el techo de la Capilla Sixtina?", options: ["Rafael", "Miguel Ángel", "Leonardo da Vinci", "Caravaggio"], correctIndex: 1 },
                { question: "¿Quién es el autor del famoso cuadro El grito?", options: ["Edvard Munch", "Gustav Klimt", "Paul Cézanne", "Henri Matisse"], correctIndex: 0 },
                { question: "¿En qué ciudad se encuentra el Museo del Prado?", options: ["París", "Barcelona", "Roma", "Madrid"], correctIndex: 3 },
                 */
            ],
            color: "#F62633"
        },
        {
            name: "Historia",
            questions: [
                { question: "¿En qué año se descubrió América?", options: ["1452", "1492", "1512", "1482"], correctIndex: 1 },
                { question: "¿En qué país comenzó la Revolución Industrial?", options: ["Inglaterra", "Francia", "Alemania", "Argentina"], correctIndex: 0 },
               /* { question: "¿En qué año comenzó la Primera Guerra Mundial?", options: ["1912", "1914", "1916", "1918"], correctIndex: 1 },
                { question: "¿Quién fue el primer presidente de los Estados Unidos?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correctIndex: 2 },
                { question: "¿Qué civilización construyó la ciudad de Machu Picchu?", options: ["Azteca", "Inca", "Maya", "Olmeca"], correctIndex: 1 },
                { question: "¿Qué tratado puso fin a la Primera Guerra Mundial?", options: ["Tratado de París", "Tratado de Tordesillas", "Tratado de Versalles", "Tratado de Westfalia"], correctIndex: 2 },
                { question: "¿Cuál fue el primer país en abolir la esclavitud?", options: ["Estados Unidos", "Francia", "Haití", "Inglaterra"], correctIndex: 2 },
                { question: "¿Qué mujer francesa lideró tropas durante la Guerra de los Cien Años?", options: ["María Antonieta", "Juana de Arco", "Catalina de Médici", "Leonor de Aquitania"], correctIndex: 1 },
                { question: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2 },
                { question: "¿Quién fue el líder de la campaña libertadora del sur de América?", options: ["Simón Bolívar", "Manuel Belgrano", "Juan Manuel de Rosas", "José de San Martín"], correctIndex: 3 },
                 */
            ],
            color: "#F1CC37"
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
    createCategories();
    options.addEventListener("click", selectOption);
    drawState();
};

const showModal = (message, correct = false, reiniciar = false) => {
    //console.log(correct);
    modalContent.style.display = "flex";
    overlay.style.display = "block";
    modalMessage.innerHTML = message;

    //arrancan ocultos todos los botones
    correctButton.style.display = "none";
    incorrectButton.style.display = "none";
    restartButton.style.display = "none";
    backToMain.style.display = "none";

    if (reiniciar) {
        restartButton.style.display = "block";
        backToMain.style.display = "block";
    } else {
        correctButton.style.display = correct ? "block" : "none";
        incorrectButton.style.display = !correct ? "block" : "none";
    }
};


correctButton.addEventListener("click", () => {
    hideModal();
});

incorrectButton.addEventListener("click", () => {
    hideModal();
});

restartButton.addEventListener("click", () => {
    hideModal();
    initGame();
});

backToMain.addEventListener("click", () => {
    hideModal();
    initGame();
    document.getElementById("main").classList.remove("nodisp");
    document.getElementById("g3").classList.add("nodisp");
});


const hideModal = () => {
    modalContent.style.display = "none";
    overlay.style.display = "none";
    preguntaContainer.style.display = "none";
};


const startTimer = () => {
    
    timer = setInterval(() => {
        game.timer--;
        reloj.innerHTML = game.timer;

        if (game.timer <= 0) {
            clearInterval(timer);
            console.log("¡Tiempo agotado!"); // Mensaje de tiempo agotado
            showModal(`¡Se agotó el tiempo!`, false, false);
        }
    }, 1000);
};

const shuffleCategories = () => {
    // mezcla las categorías
    const randomIndex = Math.floor(Math.random() * game.categories.length);
    game.currentCategory = game.categories[randomIndex];
};

const createCategories = () => {
    
    //asegura que el DOM del contenedor esté limpio antes de añadir el botón de categoría
    categories.innerHTML = "";

    const buttonCategories = document.createElement("button");
    buttonCategories.innerHTML = "juega!";

    categories.appendChild(buttonCategories);

    buttonCategories.addEventListener("click", () => {
    
        const randomIndex = Math.floor(Math.random() * game.categories.length);
        game.currentCategory = game.categories[randomIndex];
        preguntaContainer.style.display = "block";
        showCategory(); 
        startTimer(game.timer = 20);
        console.log("Índice correcto original:", currentQuestion.correctIndex);
        console.log("Índice correcto nuevo:", newCorrectIndex);
        console.log("Opciones mezcladas:", currentOptions);
        
    });
    
};


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
        preguntaContainer.style.display = "block";
        const currentQuestion = game.currentCategory.questions[game.currentQuestionIndex].question;
        pregunta.innerHTML = currentQuestion;
    };
};



let newCorrectIndex;
let currentOptions;
let currentQuestion;

const createOptions = () => {
    options.innerHTML = "";

    currentQuestion = game.currentCategory.questions[game.currentQuestionIndex];
    
    // crea una copia del array de opciones para no modificar la original
    currentOptions = currentQuestion.options.slice(); 
    
    // antes de mezclar guarda el índice de la opción correcta
    const correctOption = currentQuestion.options[currentQuestion.correctIndex];
    
    // mezcla las opciones (fisher-yates)
    shuffle(currentOptions);

    // busca el index correcto dp de mezclar
    newCorrectIndex = currentOptions.indexOf(correctOption);

    for(let i = 0; i < currentOptions.length; i++){
        buttonOption = document.createElement("button");
        buttonOption.innerHTML = currentOptions[i];
        buttonOption.setAttribute("data-option", i);
        options.appendChild(buttonOption);
    }

    // actualiza el correctIndex al ya mezclado
    currentQuestion.correctIndex = newCorrectIndex;
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
        
        playerScore.innerHTML = "Jugador "+[i + 1]+": "+ game.score[i];
        if (i === game.turno - 1) {
            playerScore.style.backgroundColor = "#62B273"; // color de fondo para el jugador en turno
        }
        scoreContent.appendChild(playerScore);
    }
    document.getElementById("turno-actual").innerHTML = game.turno;
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

    const correctIndex = game.currentCategory.questions[game.currentQuestionIndex].correctIndex;

    if(game.round <= 3){
        
        if (parseInt(selectedOptionIndex) === correctIndex) {
            //console.log("¡Correcto!");

            clearInterval(timer);
            const pointsEarned = Math.max(game.minPoints, Math.ceil((game.timer / 20) * game.maxPoints));
            game.score[game.turno - 1] += pointsEarned; //suma puntaje basado en el tiempo restante
            showModal(`Correcto, seguí jugando`, true, false);

            game.moves++;
            if (game.moves > 3) {    // si el jugador ya hizo tres tiradas
                game.turno++;    // cambia al siguiente jugador
                game.moves = 1;
            }
        } else {
            //console.log("Incorrecto.");
            clearInterval(timer);
            game.moves = 1;
            game.turno++;
            //alert("contestaste mal, le toca al otro jugador");
            showModal(`Incorrecto, la respuesta correcta era: ${currentOptions[newCorrectIndex]}`, false, false);
            
            //console.log(game.categories[currentCategory].questions[currentQuestion].options);
        }

        if (game.round === 3 && game.turno > game.jugadores) {
            determinarGanador(); // Llama a la función para finalizar el juego
            return; // Sale para evitar que pase al siguiente jugador/ronda
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
            alert("empate, no gano ninguno");
    }else if(game.score[0] !== game.score[1]){
        if(game.score[0] >= game.score[1]){
            winningScore = game.score[0];
            winner = "1";
        }else{
            winningScore = game.score[1];
            winner = "2";
        }
        //alert(`J${winner + 1} ganó con ${winningScore} puntos!`);
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