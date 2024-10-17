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
        dados = [0, 0, 0, 0, 0];
        dadosSeleccionados = [false, false, false, false, false];
    };

    const drawDices = () => {
        dados.forEach((dado, i) => {
            document.getElementById(`dado-${i + 1}`).innerHTML = dado; 
        });
    };

    const rollDices = () => {
        for (let i = 0; i < dados.length; i++) {
            if(dadosSeleccionados){
                dados[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        dadosSeleccionados = [false, false, false, false, false];
        drawDices();
    };

    document.getElementById("roll-btn").addEventListener("click", rollDices);

    document.addEventListener("DOMContentLoaded", () => { initGame(); });