/*document.getElementById('roll-btn').addEventListener('click', rollDice);

function rollDice() {
  for (let i = 1; i <= 5; i++) {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById(`dado-${i}`).textContent = diceValue;
  }
}*/

let dados;
let dadosSeleccionados;

const initGame = () => {
    dados = ["", "", "", "", ""]; 
    dadosSeleccionados = [false, false, false, false, false];

    document.querySelectorAll(".dados-container .dados").forEach((diceElement, i) => {
        diceElement.addEventListener("click", () => toggleDiceSelection(i));
    });

    drawDices();
};

const drawDices = () => {
    dados.forEach((dado, i) => {
        const diceElement = document.querySelector(`.dados-container .dado-${i + 1}`);
        if (diceElement) {
            diceElement.innerHTML = dado;  // Muestra el valor del dado
        }
    });
};

const rollDices = () => {
    for (let i = 0; i < dados.length; i++) {
        if (!dadosSeleccionados[i]) {  // Solo lanza los dados que no están seleccionados
            dados[i] = Math.floor(Math.random() * 6) + 1;  // Genera un número entre 1 y 6
        }
    }
    drawDices();  // Después de tirar los dados, actualiza la interfaz
};

const toggleDiceSelection = diceNumber => {
    dadosSeleccionados[diceNumber] = !dadosSeleccionados[diceNumber];
    const diceElement = document.querySelector(`.dados-container .dado-${diceNumber + 1}`);
    if (dadosSeleccionados[diceNumber]) {
        diceElement.classList.add("dadosSeleccionados");
    } else {
        diceElement.classList.remove("dadosSeleccionados");
    }
    console.info("Dices selection " + dadosSeleccionados);
};

document.getElementById("roll-btn").addEventListener("click", rollDices);

document.addEventListener("DOMContentLoaded", () => {
    initGame();
});