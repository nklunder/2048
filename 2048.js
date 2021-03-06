const readline = require('readline');
const colors = require('colors');



let testScore = 0;
let testTable2 = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let colorTest = [
  [0, 0, 0, 0],
  [0, 0, 2, 4],
  [8, 16, 32, 64],
  [128, 256, 512, 2048]
];



function zeroPrecedesNonZero(arr) {
  let lastNonZeroIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) lastNonZeroIndex = i;  
  }

  return arr.indexOf(0) < lastNonZeroIndex;
}

function _addTile(table) {
  let emptyCells = [];
  let cellValues = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table.length; j++) {
      if (table[i][j] === 0) {
        emptyCells.push([i, j]);
      } 
    }      
  }

  if (emptyCells.length) {
    let [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    table[x][y] = cellValues[Math.floor(Math.random() * cellValues.length)];
  } else {
    process.stdout.write('\u001B[2J\u001B[0;0f');    
    console.log("Game over!");
  }
}

function updateTableAndScore(table, score = 0) {
  let newScore = score;
  let shouldAddTile = false;
  let updatedTable = table.map(row => {
    if (zeroPrecedesNonZero(row)) shouldAddTile = true;

    let newArray = [];
    let filtered = row.filter(n => n !== 0);
    let padCount = row.length - filtered.length;

    while (filtered.length) {
      let [a, b] = filtered;

      if (a === b) {
        let val = a + b;
        newArray.push(val);
        filtered = filtered.slice(2);
        newScore += val;
        padCount++;
        shouldAddTile = true;
      } else {
        newArray.push(a);
        filtered = filtered.slice(1);
      }
    }

    return [...newArray, ...Array(padCount).fill(0)];
  });

  if (shouldAddTile) _addTile(updatedTable);

  return [updatedTable, newScore];
}

function _swapElements(table) {
  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < i; j++) {
      [table[i][j], table[j][i]] = [table[j][i], table[i][j]];
    }
  }
}

function rotate90CW(table) {
  table = table.map(row => row.slice()).reverse();
  _swapElements(table);
  return table;
}

function rotate90CCW(table) {
  table = table.map(row => row.slice().reverse());
  _swapElements(table);
  return table;
}



function leftPush(table, score) {
  return updateTableAndScore(table, score);
}

function rightPush(table, score) {
  let [newTable, newScore] = updateTableAndScore(
    table.map(row => row.slice().reverse()),
    score
  );

  return [newTable.map(row => row.reverse()), newScore];
}


function upPush(table, score) {
  let [newTable, newScore] = updateTableAndScore(
    rotate90CCW(table),
    score
  );
  return [rotate90CW(newTable), newScore];
}

function downPush(table, score) {
  let [newTable, newScore] = updateTableAndScore(
    rotate90CW(table),
    score
  );
  return [rotate90CCW(newTable), newScore];
}




readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  process.stdout.write('\u001B[2J\u001B[0;0f');
  
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }

  if (key.name === 'left') {
    [testTable2, testScore] = leftPush(testTable2, testScore) 
    printGameState()
  }
  if (key.name === 'right') {
    [testTable2, testScore] = rightPush(testTable2, testScore)
    printGameState()
  }
  if (key.name === 'up') {
    [testTable2, testScore] = upPush(testTable2, testScore)
    printGameState()
  }
  if (key.name === 'down') {
    [testTable2, testScore] = downPush(testTable2, testScore)
    printGameState()
  }

})

function printGameState() {
  let formatted = testTable2
    .map(row => row.map(n => {
      // anything larger than 2048
      let color = "magenta";

      switch (n) {
        case 0:
          color = "grey"; break;
        case 2:
          color = "white"; break;
        case 4:
          color = "white"; break; 
        case 8:
          color = "white"; break;
        case 16:
          color = "cyan"; break;
        case 32:
          color = "cyan"; break;
        case 64:
          color: "cyan"; break;
        case 128:
          color: "yellow"; break;
        case 256:
          color: "yellow"; break;
        case 512:
          color: "yellow"; break;
        case 1024:
          color: "green"; break;
        case 2048:
          color: "green"; break;
      }

      return colors[color](n.toString().padEnd(5))
    }).join("")).join("\n\n")
  
  console.log(`
score: ${testScore}

${formatted}
  `);
}

process.stdout.write('\u001B[2J\u001B[0;0f');
_addTile(testTable2)
printGameState()
