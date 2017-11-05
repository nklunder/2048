const readline = require('readline');


let game = [{
  score: 0,
  table: newTable()
}]

let testTable = [
  [2, 2, 0, 0],
  [0, 8, 0, 2],
  [2, 4, 4, 2],
  [2, 4, 8, 8]
]

let testScore = 0;
let testTable2 = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

function newTable() {
  let emptyTable = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  return _addTile(emptyTable);
}

function zeroPrecedesNonZero(arr) {
  let lastNonZeroIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) lastNonZeroIndex = i;  
  }

  return arr.indexOf(0) < lastNonZeroIndex;
}

function _addTile(table) {
  let emptyCells = [];

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table.length; j++) {
      if (table[i][j] === 0) {
        emptyCells.push([i, j]);
      } 
    }      
  }

  if (emptyCells.length) {
    let [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    table[x][y] = [2, 4][Math.round(Math.random())];
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
  console.log(`
score: ${testScore}
${testTable2.join("\n")}
  `)
}


process.stdout.write('\u001B[2J\u001B[0;0f');
_addTile(testTable2)
printGameState()
