//Cacheando elementos
const board = document.querySelector("#board");
const scoreBoard = document.querySelector("#scoreBoard");
const startBtn = document.querySelector("#start");
const gameOver = document.querySelector("#gameOver");



//Game settings
const boardSize = 10;
const gameSpeed = 100;

const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

//Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

//Dibuja la culebrita
function drawSnake(){
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
}

//Rellena cada cuadrado del tablero
//@params
//Square: posición del cuadrado
//type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
function drawSquare(square, type) {
    //Separamos los datos que nos vienen en el array
    const [row, column] = square.split("");
    //Una vez que tenemos esos dos elementos rellenamos 
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            //Si existe un square entonces...
            emptySquares.splice(emptySquares.indexOf(square), 1);
            //Se elimina el empty a partir del index en el cual square empiece
            //El número 1 se refiere a la cantidad de elementos que se deben eliminar del array
        }
    }
}

const setDirection = newDirection => {
    direction = newDirection;
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        //Agarramos el último square del snake y le sumamos la dirección que nos dice en directions que le corresponde
        .padStart(2, '0');
        const [row, column] = newSquare.split('');
        //Tomamos de nuesta newSquare el elemento de row y column

    if( newSquare < 0 || 
        newSquare > boardSize * boardSize  ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snakeSquare) ) {
        gameOverGame();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOverGame = () => {
    gameOver.style.display = 'block';
    clearInterval(moveInterval)
    startBtn.disabled = false;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            //La culebra no puede dar reversa, entonces si no es arrowDown entonces si setea la nueva dirección y así para todas
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

function updateScore() {
    scoreBoard.innerHTML = score;
}

const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        //Itera cada array
        row.forEach( (column, columnndex) => {
            //Itera cada elemento del array
            const squareValue = `${rowIndex}${columnndex}`;
            //Le añadimos como valor a cada cuadrado, el num de la fila y el num de la columna
            const squareElement = document.createElement('div');
            //Creamos un div por cada elemento
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            //Le añadimos los atributos
            board.appendChild(squareElement);
            //Añadimos los cuadrados al tablero
            emptySquares.push(squareValue);
        })
    })
}

function setGame() {
    snake = ["00", "01", "02", "03"]; //La culebra ocupa 4 espacios
    score = snake.length; //Se irá aumentando el tamaño de la culebra, haremos que suba 1 el score
    direction = "ArrowRight"; //Empezamos con un movimiento a la derecha
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    //Creamos un array a partir del número que tengamos en boardSize, después a partir de los elementos creamos otros arrays de 10 elementos tambien, después los rellenamos de 0.
    // console.log(boardSquares); //Un cuadraro de 10x10
    board.innerHTML = "";
    emptySquares = [];
    createBoard();
}

function startGame() {
    //Lo primero que tenemos que hacer es darle valores a las variables del juego
    setGame();
    gameOver.style.display = "none";
    //Quitamos el div de gameOver
    startBtn.disabled = true;
    //Deshabilitamos el botón de start mientras el usuario juega
    drawSnake(); //Dibujamos a la culebra en la cuadrícula
    updateScore(); //Seteamos el score
    createRandomFood(); //Creamos donde se va a crear la comida aleatoriamente
    document.addEventListener('keydown', directionEvent); //Agregamos los eventListeners a las flechas del teclado
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

startBtn.addEventListener("click", startGame);

