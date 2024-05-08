document.addEventListener("DOMContentLoaded", function() {            //Dentro de la funcion documemto se ejecutan generar tabla y los botones
  generarTablero();
  
  var botonResolver = document.getElementById("botonResolver");
  botonResolver.addEventListener("click", resolverSudoku);

  var botonReiniciar = document.getElementById("botonReiniciar");
  botonReiniciar.addEventListener("click", reiniciarSudoku);
});

function generarTablero() {
  var tabla = document.getElementById("sudoku");
  var rompecabezas = generarSudoku();
  
  for (var i = 0; i < 9; i++) {
    var fila = tabla.insertRow();
    for (var j = 0; j < 9; j++) {               //Genera el tablero llamando la tabla y hace que el tablero sea solo lectura y no editable
      var celda = fila.insertCell();
      if (rompecabezas[i][j] !== 0) {
        celda.textContent = rompecabezas[i][j];
        celda.classList.add("sololectura"); 
      } else {
        celda.setAttribute("contenteditable", true); 
        celda.setAttribute("oninput", "verificarCelda(this)");
      }
    }
  }
}

function generarSudoku() {
  var rompecabezas = [];
  for (var i = 0; i < 9; i++) {
    rompecabezas[i] = [];
    for (var j = 0; j < 9; j++) {     //Genera el sudoku haciendo una matriz con numeros unicamente del 1-9
      rompecabezas[i][j] = 0;
    }
  }
  llenarSudoku(rompecabezas);
  return rompecabezas;
}

function llenarSudoku(rompecabezas) {
  var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  barajarArray(numeros);
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {   
      var numIndex = (i * 3 + Math.floor(i / 3) + j) % 9;       //son las reglas del sudoku, tambien llama mas funciones para seguir las reglas
      var num = numeros[numIndex];
      if (esValido(rompecabezas, i, j, num)) {
        rompecabezas[i][j] = num;
      }
    }
  }
  eliminarCeldasAleatorias(rompecabezas);
}

function barajarArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));    //Esta funcion toma una array para barajarlo aleatoriamente
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function eliminarCeldasAleatorias(rompecabezas) {
  var numEliminar = Math.floor(Math.random() * 10) + 40; 
  for (var k = 0; k < numEliminar; k++) {
    var fila = Math.floor(Math.random() * 9);             //Toma celdas de el sudoku generado aleatoriamente para borrarles
    var columna = Math.floor(Math.random() * 9);
    rompecabezas[fila][columna] = 0;
  }
}
function resolverSudoku() {
  var tabla = document.getElementById("sudoku");
  var rompecabezas = [];
  var sudokuCompleto = true; 
  for (var i = 0; i < 9; i++) {
    rompecabezas[i] = [];                                 //Es la funcion que verifica si se completo el sudoku y arroja alertas de que se gano
    for (var j = 0; j < 9; j++) {
      var celda = tabla.rows[i].cells[j];
      var valor = parseInt(celda.textContent) || 0;
      rompecabezas[i][j] = valor;
      if (valor === 0) {
        sudokuCompleto = false; 
      }
    }
  }
  
  if (sudokuCompleto) { 
    if (resolver(rompecabezas)) {
      actualizarTablero(rompecabezas);
      if (esValido(rompecabezas, 0, 0, rompecabezas[0][0])) { 
        alert("¡Felicidades! Has ganado el Sudoku.");
      } else {
        alert("El Sudoku resuelto no es válido.");
      }
    } else {
      alert("¡No existe solución para este rompecabezas de Sudoku!");
    }
  } else {
    alert("El sudoku está incompleto. Por favor, llénelo antes de intentar resolverlo.");
  }
}


function verificarSudokuCompleto(rompecabezas) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (rompecabezas[i][j] === 0) {             //Verifica que los valores del usuario sean validos
        return false; 
      }
    }
  }
  return true; 
}


function resolver(rompecabezas) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (rompecabezas[i][j] === 0) {
        for (var num = 1; num <= 9; num++) {
          if (esValido(rompecabezas, i, j, num)) {
            rompecabezas[i][j] = num;
            if (resolver(rompecabezas)) {                   //es la funcion que resuelve el sudoku automaticamente
              return true;
            }
            rompecabezas[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function esValido(rompecabezas, fila, columna, num) {
  for (var i = 0; i < 9; i++) {
    if (rompecabezas[fila][i] === num || rompecabezas[i][columna] === num || rompecabezas[Math.floor(fila / 3) * 3 + Math.floor(i / 3)][Math.floor(columna / 3) * 3 + i % 3] === num) {
      return false;
    }                             //determina si el numero en la celda es valido para el sudoku
  }
  return true;
}

function verificarCelda(celda) {
  var fila = celda.parentNode.rowIndex;
  var columna = celda.cellIndex;
  var valor = parseInt(celda.textContent);
  
  if (isNaN(valor) || valor < 1 || valor > 9) {                         // Verificar si el valor es un número válido entre 1 y 9

    celda.textContent = ""; 
    return;
  }
  celda.classList.add("numero-ingresado");

  celda.classList.remove("resaltar");
  for (var i = 0; i < 9; i++) {
    if (i !== columna && celda.parentNode.parentNode.rows[fila].cells[i].textContent === celda.textContent) {
      celda.classList.add("resaltar");
      return;
    }
    if (i !== fila && celda.parentNode.parentNode.rows[i].cells[columna].textContent === celda.textContent) {
      celda.classList.add("resaltar");
      return;
    }
  }

  var filaInicio = Math.floor(fila / 3) * 3;
  var columnaInicio = Math.floor(columna / 3) * 3;
  for (var m = filaInicio; m < filaInicio + 3; m++) {
    for (var n = columnaInicio; n < columnaInicio + 3; n++) {
      if ((m !== fila || n !== columna) && celda.parentNode.parentNode.rows[m].cells[n].textContent === celda.textContent) {
        celda.classList.add("resaltar");
        return;
      }
    }
  }
}

  
  function reiniciarSudoku() {
    var tabla = document.getElementById("sudoku");
    while (tabla.rows.length > 0) {                          //Reinicia todas las celdas del sudoku
      tabla.deleteRow(0);
    }
    generarTablero();
  }

  
  function incrementarPuntuacion() {
    puntuacionJugador++;                                      //Incompleto
    elementoPuntuacionJugador.textContent = puntuacionJugador;
  }

  
  