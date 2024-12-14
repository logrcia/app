const categories = document.getElementById("categorias");
const options = document.getElementById("opciones");
let buttonCategories;
let buttonOption;
let timer;


const preguntaContainer = document.getElementById("pregunta-container");


const game = {
    score: [0, 0],
    currentCategory: null,
    currentQuestionIndex: 0,
    categories: [
        {
            name: "Geografía",
            questions: [
                { question: "¿En qué año ocurrió la Segunda Guerra Mundial?", options: ["1939", "1945", "1914", "1929"], correctIndex: 0 },
                { question: "¿Cuál es la capital de Argentina", options: ["San Luis", "Neuquén", "La Pampa", "Buenos Aires"], correctIndex: 3 }
            ]
        },
        {
            name: "Entretenimiento",
            questions: [
                { question: "¿Cuál es la película más taquillera de la historia?", options: ["Avatar", "Avengers: Endgame", "Titanic", "El Rey León"], correctIndex: 0 },
                { question: "¿Qué banda cantó *Bohemian Rhapsody*?", options: ["The Beatles", "Queen", "Pink Floyd", "The Rolling Stones"], correctIndex: 1 }
            ]
        },
        {
            name: "Arte",
            questions: [
                { question: "¿Quién pintó la famosa obra La última cena?", options: ["Leonardo da Vinci", "Miguel Ángel", "Vincent van Gogh", "Salvador Dalí"], correctIndex: 0 },
                { question: "¿De qué país es originario el arte del origami?", options:["China", "Corea", "Japón", "Tailandia"], correctIndex: 2 }
            ]
        },
        {
            name: "Historia",
            questions: [
                { question: "¿En qué año se descubrió América?", options: ["1452", "1492", "1512", "1482"], correctIndex: 1 },
                { question: "¿En qué país comenzó la Revolución Industrial?", options: ["Inglaterra", "Francia", "Alemania", "Argentina"], correctIndex: 0 }
            ]
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
    //shuffleCategories();
    createCategories();
    options.addEventListener("click", selectOption);
    drawState();
};

const startTimer = () => {
    const reloj = document.getElementById("reloj");
    
    timer = setInterval(() => {
        game.timer--;
        reloj.innerHTML = game.timer;

        if (game.timer <= 0) {
            clearInterval(timer);
            console.log("¡Tiempo agotado!"); // Mensaje de tiempo agotado
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
        
        showCategory(); 
        startTimer(game.timer = 20);
        
    });
    
};


const showCategory = () => {
    const textCurrentCategory = document.getElementById("categoria-seleccionada");
    textCurrentCategory.innerHTML = game.currentCategory.name;
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

const createOptions = () => {
    options.innerHTML = "";

    const currentQuestion = game.currentCategory.questions[game.currentQuestionIndex];
    
    // crea una copia del array de opciones para no modificar la original
    let currentOptions = currentQuestion.options.slice(); 
    
    // antes de mezclar guarda el índice de la opción correcta
    const correctOption = currentQuestion.options[currentQuestion.correctIndex];
    
    // mezcla las opciones (fisher-yates)
    shuffle(currentOptions);

    // busca el index correcto dp de mezclar
    const newCorrectIndex = currentOptions.indexOf(correctOption);

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
    for(let i = 0; i < game.jugadores; i++){
        const player = document.getElementById(`puntaje-j${i}`);
        player.innerHTML = game.score[i];
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
    if(game.round <= 3){
        
        const correctIndex = game.currentCategory.questions[game.currentQuestionIndex].correctIndex;
        if (parseInt(selectedOptionIndex) === correctIndex) {
            console.log("¡Correcto!");

            clearInterval(timer);
            const pointsEarned = Math.max(game.minPoints, Math.ceil((game.timer / 20) * game.maxPoints));
            game.score[game.turno - 1] += pointsEarned; // Suma puntaje basado en el tiempo restante
            alert(`¡Correcto! +${pointsEarned} puntos`);

            game.moves++;
            if (game.moves > 3) {    // si el jugador ya hizo tres tiradas
                game.turno++;    // cambia al siguiente jugador
                game.moves = 1;
            }
        } else {
            console.log("Incorrecto.");
            clearInterval(timer);
            game.moves = 1;
            game.turno++;
            //alert("contestaste mal, le toca al otro jugador");
        }
        changePlayer();
        drawState(); 
        
    }else{
        let winner;
        let winningScore;
        
            if(game.score[0] >= game.score[1]){
                winningScore = game.score[0];
                winner = "1";
            }else{
                winningScore = game.score[1];
                winner = "2";
            }
        alert(`J${winner + 1} ganó con ${winningScore} puntos!`);
        clearInterval(timer);
        console.log(winner, winningScore);
        
        initGame();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initGame();
    options.addEventListener("click", selectOption);
});