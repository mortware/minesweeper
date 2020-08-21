
const $grid = document.getElementById("grid");
let width = 10;
let height = 10;
let grid = create2DArray(width, height);
let bombCount = 10;

function createBoard() {

    const bombsArray = Array(bombCount).fill(true);
    const emptyArray = Array(width * height - bombCount).fill(false);
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {

            let index = coordsToIndex(x, y);
            let coords = indexToCoords(index);

            const $cell = document.createElement('div');
            $cell.classList.add('cell');
            $cell.setAttribute('data-index', index);

            let cell = new Cell(x, y, shuffledArray[index], $cell);

            cell.x = coords.x;
            cell.y = coords.y;
            grid[y][x] = cell;

            $cell.addEventListener('click', onCellClicked);
            $grid.appendChild($cell);

        }
    }

    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
            cell = grid[y][x];
            if (cell.isBomb)
                continue;

            cell.neighbours = getNeighbours(cell);
        }
    }
}

function coordsToIndex(x, y) {
    return x + width * y;
}

function indexToCoords(index) {
    let coords = {
        x: index % width,
        y: Math.floor(index / width)
    }
    return coords;
}

function onCellClicked(evt) {
    let $cell = evt.currentTarget;

    let i = $cell.getAttribute('data-index');
    let coords = indexToCoords(i);
    let cell = grid[coords.y][coords.x];
    let neighbours = getNeighbours(cell);

    cell.reveal(neighbours);

    if (!cell.isBomb) {
        updateGameState();
    } else {
        handleGameOver();
    }
}

function getNeighbours(cell) {
    let neighbours = [];
    let xBounds = width - 1;
    let yBounds = height - 1;
    if (cell.x > 0 && cell.y > 0) // NW
        neighbours.push(grid[cell.y - 1][cell.x - 1]);

    if (cell.y > 0) // N
        neighbours.push(grid[cell.y - 1][cell.x]);

    if (cell.x < xBounds && cell.y > 0) // NE
        neighbours.push(grid[cell.y - 1][cell.x + 1]);

    if (cell.x < xBounds) // E
        neighbours.push(grid[cell.y][cell.x + 1]);

    if (cell.x < xBounds && cell.y < yBounds) // SE
        neighbours.push(grid[cell.y + 1][cell.x + 1]);

    if (cell.y < yBounds) // S
        neighbours.push(grid[cell.y + 1][cell.x]);

    if (cell.x > 0 && cell.y < yBounds) // SW
        neighbours.push(grid[cell.y + 1][cell.x - 1]);

    if (cell.x > 0) // W
        neighbours.push(grid[cell.y][cell.x - 1]);

    return neighbours;
}

createBoard();

function updateGameState() {

    let revealedCells = 0;
    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
            if (grid[y][x].isRevealed)
                revealedCells++;
        }
    }
    console.log(revealedCells);

    if (revealedCells >= width * height - bombCount)
        handleWin();
}

function handleGameOver() {
    let $gameoverScreen = document.getElementById('gameover-screen');
    $gameoverScreen.classList.add('show');
    handleRestart();
}

function handleWin() {
    let $winScreen = document.getElementById('win-screen');
    $winScreen.classList.add('show');
    handleRestart();
}

function handleRestart() {
    let $restartScreen = document.getElementById('restart-screen');
    $restartScreen.classList.add('show');

    let $restartBtn = document.getElementById('btn-restart');
    $restartBtn.addEventListener('click', () => {
        location.reload();
    });
}

function create2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}