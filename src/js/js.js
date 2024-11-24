const statusDisplay = document.querySelector(".ganador"); //<p> del ganador
const cells = document.querySelectorAll(".celda");
const resetButton = document.getElementById("reset");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]; 

let jugador = "X";
let gameOver = false;
let turno = document.getElementById("turno");


function changeTurn() {
    jugador = jugador === "X" ? "O" : "X";
}

function tirarMoneda() {
    return Math.random() > 0.5 ? 'X' : 'O' 
}

cells.forEach(cell => { // bucle que recorre cada celda y les asigna el evento
    cell.addEventListener("click", handleCellClick); 
});

resetButton.addEventListener("click", resetGame); 

function handleCellClick(event) { // funcion que se ejecuta al clickear la celda
    const cell = event.target; // representa el elemento específico que se clickeo
    if (gameOver || cell.textContent !== "") { // chequea si el juego termino o si la celda se ocupo
        return; // si se cumple la condicion, termina
    }
    cell.textContent = jugador; 
    changeColor(cell);
    cell.classList.add('bloqueada'); // una vez q se clickea queda bloqueada
    document.getElementById("btn-g1-back").setAttribute("disabled", "disabled");

    if (checkWin()) { 
        gameOver = true; 
        turno.style.display = "none";
        mostrarMensaje(`¡${jugador} es el ganador!`); 
        resetButton.disabled = false; // habilita el boton de reseteo
    } else if (checkTie()) { 
        gameOver = true; 
        turno.style.display = "none";
        mostrarMensaje("¡Empate!"); 
        resetButton.disabled = false; // reseteo
    } else { // si no hay victoria ni empate, el juego sigue
        jugador = jugador === "X" ? "O" : "X"; 
    }
    document.getElementById("jugador").textContent = jugador;
  }

function checkWin() {
  let isWin = false; 

  winConditions.forEach(condition => { // recorre cada combinacion de 'winConditions' usando 'forEach'. 
      if (cells[condition[0]].textContent === jugador && 
          cells[condition[1]].textContent === jugador && 
          cells[condition[2]].textContent === jugador) { 
          isWin = true; // si las tres celdas coinciden con el valor de 'jugador' gana
          marcarCeldasGanadoras(condition); 
      }
  });

  return isWin; // devuelve 'true' si se encontro una victoria, o 'false' si no.
}

function marcarCeldasGanadoras(condition) {
  condition.forEach(index => {
      cells[index].style.backgroundColor = "#FFECC1"; 
  });
}


function checkTie() { 
    return Array.from(cells).every(cell => { // convierte el objeto cells en un array y aplica el metodo every() al array
        return cell.textContent !== ""; //si todas las casillas tienen un símbolo y ninguna está vacía, entonces ya no hay más lugares para jugar
    });
}


function mostrarMensaje(mensaje) { 
    statusDisplay.textContent = mensaje; 
    statusDisplay.style.display = 'block'; 
}

// reinicia el juego
function resetGame() { 
    cells.forEach(cell => { 
        cell.textContent = ""; 
        cell.style.backgroundColor = ""; // restaura el color de fondo al original
        cell.style.color = "";
        cell.classList.remove('bloqueada'); // elimina la clase 'bloqueada' para desbloquear las celdas
    });
    turno.style.display = 'flex';
    statusDisplay.style.display = 'none';
    jugador = tirarMoneda(); 
    gameOver = false; 
    resetButton.disabled = true; // boton deshabilitado
    document.getElementById("btn-g1-back").removeAttribute("disabled", "disabled");
}
function changeColor(element) {
    if (jugador === "X") {
        element.style.color = "#1C77C3";
    } else {
        element.style.color = "#E7919D";
    }
}

// inicializa el juego
resetButton.disabled = true;
