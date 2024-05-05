document.addEventListener("DOMContentLoaded", function() {
    generateBoard();
    
    var solveButton = document.getElementById("solveButton");
    solveButton.addEventListener("click", solveSudoku);
  
    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetSudoku);
  });
  
  function generateBoard() {
    var table = document.getElementById("sudoku");
    var puzzle = generateSudoku();
    
    for (var i = 0; i < 9; i++) {
      var row = table.insertRow();
      for (var j = 0; j < 9; j++) {
        var cell = row.insertCell();
        cell.setAttribute("contenteditable", true);
        cell.setAttribute("oninput", "checkCell(this)");
        if (puzzle[i][j] !== 0) {
          cell.textContent = puzzle[i][j];
          cell.classList.add("readonly");
        }
      }
    }
  }
  
  
  function generateSudoku() {
    var puzzle = [];
    for (var i = 0; i < 9; i++) {
      puzzle[i] = [];
      for (var j = 0; j < 9; j++) {
        puzzle[i][j] = 0;
      }
    }
    fillSudoku(puzzle);
    return puzzle;
  }
  
  function fillSudoku(puzzle) {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(numbers);
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var numIndex = (i * 3 + Math.floor(i / 3) + j) % 9;
        var num = numbers[numIndex];
        if (isValid(puzzle, i, j, num)) {
          puzzle[i][j] = num;
        }
      }
    }
    removeRandomCells(puzzle);
  }
  
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function removeRandomCells(puzzle) {
    var numToRemove = Math.floor(Math.random() * 10) + 40; // Remove between 40 to 49 cells
    for (var k = 0; k < numToRemove; k++) {
      var row = Math.floor(Math.random() * 9);
      var col = Math.floor(Math.random() * 9);
      puzzle[row][col] = 0;
    }
  }
  
  function solveSudoku() {
    var table = document.getElementById("sudoku");
    var puzzle = [];
    for (var i = 0; i < 9; i++) {
      puzzle[i] = [];
      for (var j = 0; j < 9; j++) {
        var cell = table.rows[i].cells[j];
        puzzle[i][j] = parseInt(cell.textContent) || 0;
      }
    }
    if (solve(puzzle)) {
      updateBoard(puzzle);
    } else {
      alert("No solution exists for this Sudoku puzzle!");
    }
  }
  
  function solve(puzzle) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (puzzle[i][j] === 0) {
          for (var num = 1; num <= 9; num++) {
            if (isValid(puzzle, i, j, num)) {
              puzzle[i][j] = num;
              if (solve(puzzle)) {
                return true;
              }
              puzzle[i][j] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  function isValid(puzzle, row, col, num) {
    for (var i = 0; i < 9; i++) {
      if (puzzle[row][i] === num || puzzle[i][col] === num || puzzle[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + i % 3] === num) {
        return false;
      }
    }
    return true;
  }
  
  function checkCell(cell) {
    var row = cell.parentNode.rowIndex;
    var col = cell.cellIndex;
    var value = parseInt(cell.textContent);
    
    if (isNaN(value) || value < 1 || value > 9) {
      cell.textContent = "";
      return;
    }
  
    for (var i = 0; i < 9; i++) {
      if (i !== col && cell.parentNode.parentNode.rows[row].cells[i].textContent === cell.textContent) {
        cell.classList.add("highlight");
        return;
      }
    }
  
    for (var j = 0; j < 9; j++) {
      if (j !== row && cell.parentNode.parentNode.rows[j].cells[col].textContent === cell.textContent) {
        cell.classList.add("highlight");
        return;
      }
    }
  
    var startRow = Math.floor(row / 3) * 3;
    var startCol = Math.floor(col / 3) * 3;
    for (var m = startRow; m < startRow + 3; m++) {
      for (var n = startCol; n < startCol + 3; n++) {
        if ((m !== row || n !== col) && cell.parentNode.parentNode.rows[m].cells[n].textContent === cell.textContent) {
          cell.classList.add("highlight");
          return;
        }
      }
    }
  
    cell.classList.remove("highlight");
  }
  
  function resetSudoku() {
    var table = document.getElementById("sudoku");
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
    generateBoard();
  }

  function checkCell(cell) {
    var row = cell.parentNode.rowIndex;
    var col = cell.cellIndex;
    var value = parseInt(cell.textContent);
    
    if (isNaN(value) || value < 1 || value > 9) {
      cell.textContent = "";
      return;
    }
  
    for (var i = 0; i < 9; i++) {
      if (i !== col && cell.parentNode.parentNode.rows[row].cells[i].textContent === cell.textContent) {
        cell.classList.add("highlight");
        return;
      }
    }
  
    for (var j = 0; j < 9; j++) {
      if (j !== row && cell.parentNode.parentNode.rows[j].cells[col].textContent === cell.textContent) {
        cell.classList.add("highlight");
        return;
      }
    }
  
    var startRow = Math.floor(row / 3) * 3;
    var startCol = Math.floor(col / 3) * 3;
    for (var m = startRow; m < startRow + 3; m++) {
      for (var n = startCol; n < startCol + 3; n++) {
        if ((m !== row || n !== col) && cell.parentNode.parentNode.rows[m].cells[n].textContent === cell.textContent) {
          cell.classList.add("highlight");
          return;
        }
      }
    }
  
    cell.classList.remove("highlight");
  }
  
  function resetSudoku() {
    var table = document.getElementById("sudoku");
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
    generateBoard();
  }
  
  function incrementScore() {
    playerScore++;
    playerScoreElement.textContent = playerScore;
  }

  
  