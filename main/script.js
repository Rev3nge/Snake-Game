const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 40; 
const foodBoxSize = 40; 
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "";
let score = 0;
let food = generateFood();
let gamePaused = false; 
let game;

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / foodBoxSize)) * foodBoxSize;
        y = Math.floor(Math.random() * (canvas.height / foodBoxSize)) * foodBoxSize;
    } while (snake.some(segment => segment.x === x && segment.y === y)); 
    return { x, y };
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === " ") {
        gamePaused = !gamePaused; 
        document.getElementById("pauseMessage").style.display = gamePaused ? "block" : "none"; 
        if (!gamePaused) game = setInterval(draw, 200); 
        else clearInterval(game); 
    }
});

const appleImage = new Image();
appleImage.src = "https://png.pngtree.com/png-vector/20220826/ourmid/pngtree-pixel-art-apple-icon-design-vector-png-image_6122194.png"; // Замените на путь к вашему изображению яблока

const snakeImage = new Image();
snakeImage.src = "https://img2.freepng.ru/20180706/ygc/aaxxo5yhq.webp"; 

function draw() {
    if (gamePaused) return; 
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(appleImage, food.x, food.y, foodBoxSize, foodBoxSize); 

    
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImage, snake[i].x, snake[i].y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;

    
    if (snakeX === food.x && snakeY === food.y) {
        food = generateFood(); 
        score++;
        document.getElementById("score").innerText = "Собрано яблок: " + score;
    } else {
        snake.pop(); 
    }

    const newHead = { x: snakeX, y: snakeY };

    
    if (collision(newHead, snake)) {
        restartGame("Вы столкнулись с собой!");
        return;
    }

    snake.unshift(newHead); 
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function restartGame(message) {
    clearInterval(game);
    alert(message + " Игра начнется заново.");
    score = 0;
    direction = "";
    snake = [{ x: 9 * box, y: 9 * box }];
    food = generateFood();
    document.getElementById("score").innerText = "Собрано яблок: " + score;
    gamePaused = false; 
    document.getElementById("pauseMessage").style.display = "none";
    game = setInterval(draw, 200);
}

game = setInterval(draw, 200);