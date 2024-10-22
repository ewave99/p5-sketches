/* SNAKE GAME */

let Game = (function() {
    const GAME_STATES = ["start", "play", "end", "pause"];
    const CELLS_ACROSS = 32;
    const CELLS_DOWN = 32;

    let game_state;
    let snake;
    let snake_direction;
    let apple;
    let score;

    game_state = 0;

    function newApple() {
        let x = Math.trunc(random(CELLS_ACROSS));
        let y = Math.trunc(random(CELLS_DOWN));
        return [x, y];
    }

    function newGame() {
        game_state = 1;
        snake = [[0, 0]];
        snake_direction = "right";
        apple = newApple();
        score = 0;
    }

    function togglePlayPause() {
        game_state = (game_state === 1) ? 3 : 1;
    }

    function snakeEatingApple() {
        let head = snake[0];
        if (head[0] != apple[0]) return false;
        if (head[1] != apple[1]) return false;
        return true;
    }

    function moveSnake() {
        let head = snake[0];
        let new_coord;
        if (snake_direction === "right") {
            new_coord = [head[0] + 1, head[1]];
        }
        else if (snake_direction === "down") {
            new_coord = [head[0], head[1] + 1];
        }
        else if (snake_direction === "left") {
            new_coord = [head[0] - 1, head[1]];
        }
        else if (snake_direction === "up") {
            new_coord = [head[0], head[1] - 1];
        }
        snake.unshift(new_coord);
        if (!snakeEatingApple()) {
            snake.pop();
        }
    }

    function snakeEatingSelf() {
        if (snake.length <= 1) return false;
        let head = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (head[0] === snake[i][0] && head[1] === snake[i][1])
                return true;
        }
        return false;
    }

    function update() {
        moveSnake();
        if (snakeEatingApple()) {
            score += 1;
            apple = newApple();
        }
        if (snakeEatingSelf()) {
            console.log(snake);
            game_state = 2;
        }
    }

    function setSnakeDirectionRight() {
        if (snake_direction !== "left")
            snake_direction = "right";
    }
    function setSnakeDirectionDown() {
        if (snake_direction !== "up")
            snake_direction = "down";
    }
    function setSnakeDirectionLeft() {
        if (snake_direction !== "right")
            snake_direction = "left";
    }
    function setSnakeDirectionUp() {
        if (snake_direction !== "down")
            snake_direction = "up";
    }

    return {
        getGameState: () => game_state,
        getGameStateName: () => GAME_STATES[game_state],
        nextState: () => {
            game_state++;
            game_state %= GAME_STATES.length;
        },
        newGame: newGame,
        getScore: () => score,
        getSnakeArray: () => snake,
        getCellsAcross: () => CELLS_ACROSS,
        getCellsDown: () => CELLS_DOWN,
        getAppleCoord: () => apple,
        setSnakeDirectionRight: setSnakeDirectionRight,
        setSnakeDirectionDown: setSnakeDirectionDown,
        setSnakeDirectionLeft: setSnakeDirectionLeft,
        setSnakeDirectionUp: setSnakeDirectionUp,
        togglePlayPause: togglePlayPause,
        update: update
    }
})();

let Display = (function () {
    function showStartScreen() {
        background(200);
        fill(0);
        text("Click to start.", 200, 200);
    }

    function drawScore() {
        let score = Game.getScore();
        fill(255);
        text(`Score: ${score}`, 0, 10);
    }

    function drawCell(coord, r, g, b) {
        let cells_across = Game.getCellsAcross();
        let cells_down = Game.getCellsDown();
        let cell_width = width / cells_across;
        let cell_height = height / cells_down;

        let cell_x = coord[0] * cell_width;
        let cell_y = coord[1] * cell_height;

        fill(r, g ,b);
        rect(cell_x, cell_y, cell_width, cell_height);
    }

    function drawSnake() {
        let snake_array = Game.getSnakeArray();
        for (let i = 0; i < snake_array.length; i++) {
            let coord = snake_array[i];
            drawCell(coord, 0, 255, 0);
        }
    }

    function drawApple() {
        let coord = Game.getAppleCoord();
        drawCell(coord, 255, 0, 0);
    }

    function showNextFrame() {
        background(0);

        drawScore();
        drawSnake();
        drawApple();
    }

    function showEndScreen() {
        background(200);
        fill(0);
        text("You lost the game!", 200, 200);
    }

    function showPauseScreen() {
        background(0);
        fill(255);
        text("Paused.", 200, 200);
    }

    return {
        showStartScreen: showStartScreen,
        showNextFrame: showNextFrame,
        showEndScreen: showEndScreen,
        showPauseScreen: showPauseScreen
    }
})();

function setup() {
    createCanvas(400, 400);
    frameRate(7);
    background(0);
}

function draw() {
    if (Game.getGameState() === 0) {
        Display.showStartScreen();
    }
    else if (Game.getGameState() === 1) {
        Game.update();
        Display.showNextFrame();
    }
    else if (Game.getGameState() === 2) {
        Display.showEndScreen();
    }
    else if (Game.getGameState() === 3) {
        Display.showPauseScreen();
    }
}

function mouseClicked() {
    if (Game.getGameState() === 0) {
        Game.newGame();
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW)
        Game.setSnakeDirectionUp();
    else if (keyCode === RIGHT_ARROW)
        Game.setSnakeDirectionRight();
    else if (keyCode === DOWN_ARROW)
        Game.setSnakeDirectionDown();
    else if (keyCode === LEFT_ARROW)
        Game.setSnakeDirectionLeft();
    else if (key === " ") {
        Game.togglePlayPause();
    }
}