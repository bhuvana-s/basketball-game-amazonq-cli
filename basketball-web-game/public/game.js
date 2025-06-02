// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menuScreen = document.getElementById('menu');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const gameTimeElement = document.getElementById('game-time');

// Game settings
let gameTime = 60; // Default game time in seconds
let level = 1;
let score = 0;
let attempts = 0;
let gameActive = false;
let startTime = 0;
let elapsedTime = 0;

// Ball properties
const ballRadius = 30;
let ballPos = { x: canvas.width / 4, y: canvas.height - 100 };
let ballVelocity = { x: 0, y: 0 };
let shooting = false;
let power = 50;
let angle = 45;

// Level settings
const levelSettings = {
    1: { hoopWidth: 100, gravity: 0.5, wind: 0 },
    2: { hoopWidth: 80, gravity: 0.6, wind: 0.1 },
    3: { hoopWidth: 60, gravity: 0.7, wind: 0.2 }
};

// Hoop properties
let hoopWidth = levelSettings[level].hoopWidth;
let hoopHeight = 10;
let hoopPos = { x: canvas.width - 150, y: canvas.height / 2 };

// Colors
const ORANGE = '#FF8C00'; // Basketball color
const RED = '#FF0000';    // Hoop color
const WHITE = '#FFFFFF';  // Net color
const BLACK = '#000000';  // Text color
const BLUE = '#87CEEB';   // Sky blue background
const GREEN = '#008000';  // Level indicator

// Sound effects
let bounceSound = new Audio();
let swishSound = new Audio();
let buzzerSound = new Audio();

// Try to load sound files
try {
    bounceSound.src = 'bounce.wav';
    swishSound.src = 'swish.wav';
    buzzerSound.src = 'buzzer.wav';
} catch (e) {
    console.log('Sound files not found. Creating game without sound effects.');
}

// Net points
let netPoints = [];

// Generate net points based on hoop width
function generateNetPoints() {
    netPoints = [];
    for (let i = 0; i < 6; i++) {
        netPoints.push({ x: hoopPos.x + 10 + i * (hoopWidth / 6), y: hoopPos.y });
        netPoints.push({ x: hoopPos.x + 10 + i * (hoopWidth / 6), y: hoopPos.y + 60 });
    }
}

// Reset ball position
function resetBall() {
    ballPos = { x: canvas.width / 4, y: canvas.height - 100 };
    ballVelocity = { x: 0, y: 0 };
    shooting = false;
}

// Check if ball passes through the hoop
function checkScore() {
    if (hoopPos.x <= ballPos.x && ballPos.x <= hoopPos.x + hoopWidth &&
        hoopPos.y <= ballPos.y && ballPos.y <= hoopPos.y + 10 &&
        ballVelocity.y > 0) {
        score++;
        try {
            swishSound.play();
        } catch (e) {
            console.log('Error playing sound');
        }
        return true;
    }
    return false;
}

// Set level and adjust game settings
function setLevel(newLevel) {
    level = newLevel;
    const settings = levelSettings[level];
    hoopWidth = settings.hoopWidth;
    
    // Adjust hoop position based on level
    if (level === 1) {
        hoopPos = { x: canvas.width - 150, y: canvas.height / 2 };
    } else if (level === 2) {
        hoopPos = { x: canvas.width - 150, y: canvas.height / 2 - 50 };
    } else {
        hoopPos = { x: canvas.width - 150, y: canvas.height / 2 - 100 };
    }
    
    generateNetPoints();
}

// Start the game
function startGame() {
    gameActive = true;
    menuScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    startTime = Date.now();
    score = 0;
    attempts = 0;
    resetBall();
    gameLoop();
}

// End the game
function endGame() {
    gameActive = false;
    gameOverScreen.style.display = 'flex';
    finalScoreElement.textContent = `Final Score: ${score}/${attempts}`;
    try {
        buzzerSound.play();
    } catch (e) {
        console.log('Error playing sound');
    }
}

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Draw power meter
function drawPowerMeter() {
    ctx.fillStyle = RED;
    ctx.fillRect(50, 50, power * 2, 20);
    ctx.strokeStyle = BLACK;
    ctx.strokeRect(50, 50, 200, 20);
}

// Draw angle indicator
function drawAngleIndicator() {
    const angleX = ballPos.x + 50 * Math.cos(angle * Math.PI / 180);
    const angleY = ballPos.y - 50 * Math.sin(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(ballPos.x, ballPos.y);
    ctx.lineTo(angleX, angleY);
    ctx.strokeStyle = BLACK;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw game stats
function drawGameStats() {
    ctx.fillStyle = BLACK;
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}/${attempts}`, 10, 30);
    
    const remaining = Math.max(0, gameTime - Math.floor(elapsedTime / 1000));
    ctx.fillText(`Time: ${formatTime(remaining)}`, 10, 60);
    
    ctx.fillStyle = GREEN;
    ctx.fillText(`Level: ${level}`, 10, 90);
}

// Draw instructions
function drawInstructions() {
    const instructions = [
        'SPACE: Shoot ball',
        'UP/DOWN: Adjust power',
        'LEFT/RIGHT: Adjust angle',
        'R: Reset ball',
        'ESC: Menu'
    ];
    
    ctx.fillStyle = BLACK;
    ctx.font = '16px Arial';
    
    for (let i = 0; i < instructions.length; i++) {
        ctx.fillText(instructions[i], canvas.width - 200, 30 + i * 25);
    }
}

// Draw the game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = BLUE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the basketball (orange)
    ctx.beginPath();
    ctx.arc(ballPos.x, ballPos.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ORANGE;
    ctx.fill();
    ctx.closePath();
    
    // Draw the hoop (red)
    ctx.fillStyle = RED;
    ctx.fillRect(hoopPos.x, hoopPos.y, hoopWidth, hoopHeight);
    
    // Draw the backboard
    ctx.fillStyle = WHITE;
    ctx.fillRect(hoopPos.x + hoopWidth, hoopPos.y - 50, 10, 100);
    
    // Draw the net (white)
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = 2;
    
    // Draw vertical net lines
    for (let i = 0; i < netPoints.length; i += 2) {
        if (i + 1 < netPoints.length) {
            ctx.beginPath();
            ctx.moveTo(netPoints[i].x, netPoints[i].y);
            ctx.lineTo(netPoints[i + 1].x, netPoints[i + 1].y);
            ctx.stroke();
        }
    }
    
    // Connect vertical net lines
    for (let i = 0; i < netPoints.length; i += 2) {
        if (i + 2 < netPoints.length) {
            ctx.beginPath();
            ctx.moveTo(netPoints[i].x, netPoints[i].y);
            ctx.lineTo(netPoints[i + 2].x, netPoints[i + 2].y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(netPoints[i + 1].x, netPoints[i + 1].y);
            ctx.lineTo(netPoints[i + 3].x, netPoints[i + 3].y);
            ctx.stroke();
        }
    }
    
    // Draw power meter
    drawPowerMeter();
    
    // Draw angle indicator
    drawAngleIndicator();
    
    // Draw game stats
    drawGameStats();
    
    // Draw instructions
    drawInstructions();
}

// Update game state
function update() {
    if (!gameActive) return;
    
    // Calculate elapsed time
    elapsedTime = Date.now() - startTime;
    
    // Check if time is up
    if (elapsedTime >= gameTime * 1000) {
        endGame();
        return;
    }
    
    // Ball physics when shooting
    if (shooting) {
        // Apply gravity and wind effect
        const gravity = levelSettings[level].gravity;
        const windEffect = levelSettings[level].wind * (Math.random() - 0.5);
        
        ballVelocity.x += windEffect;
        ballVelocity.y += gravity;
        
        ballPos.x += ballVelocity.x;
        ballPos.y += ballVelocity.y;
        
        // Check if ball scored
        checkScore();
        
        // Check for bounce on floor
        if (ballPos.y + ballRadius > canvas.height) {
            ballPos.y = canvas.height - ballRadius;
            ballVelocity.y = -ballVelocity.y * 0.7; // Bounce with energy loss
            if (Math.abs(ballVelocity.y) > 2) {
                try {
                    bounceSound.play();
                } catch (e) {
                    console.log('Error playing sound');
                }
            }
        }
        
        // Check for bounce on walls
        if (ballPos.x - ballRadius < 0) {
            ballPos.x = ballRadius;
            ballVelocity.x = -ballVelocity.x * 0.7;
            if (Math.abs(ballVelocity.x) > 2) {
                try {
                    bounceSound.play();
                } catch (e) {
                    console.log('Error playing sound');
                }
            }
        } else if (ballPos.x + ballRadius > canvas.width) {
            ballPos.x = canvas.width - ballRadius;
            ballVelocity.x = -ballVelocity.x * 0.7;
            if (Math.abs(ballVelocity.x) > 2) {
                try {
                    bounceSound.play();
                } catch (e) {
                    console.log('Error playing sound');
                }
            }
        }
        
        // Reset if ball stops moving
        if (Math.abs(ballVelocity.x) < 0.1 && Math.abs(ballVelocity.y) < 0.1 && 
            ballPos.y > canvas.height - ballRadius - 10) {
            resetBall();
        }
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    
    if (gameActive) {
        requestAnimationFrame(gameLoop);
    }
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (!gameActive) return;
    
    if (event.code === 'Space' && !shooting) {
        shooting = true;
        attempts++;
        
        // Calculate velocity based on power and angle
        const angleRad = angle * Math.PI / 180;
        ballVelocity.x = power * Math.cos(angleRad) * 0.2;
        ballVelocity.y = -power * Math.sin(angleRad) * 0.2;
    }
    
    if (event.code === 'KeyR') {
        resetBall();
    }
    
    if (event.code === 'Escape') {
        gameActive = false;
        menuScreen.style.display = 'flex';
    }
    
    // Power and angle control when not shooting
    if (!shooting) {
        if (event.code === 'ArrowUp' && power < 100) {
            power += 5;
        }
        if (event.code === 'ArrowDown' && power > 0) {
            power -= 5;
        }
        if (event.code === 'ArrowLeft' && angle < 90) {
            angle += 5;
        }
        if (event.code === 'ArrowRight' && angle > 0) {
            angle -= 5;
        }
    }
});

// Button event listeners
document.getElementById('level1').addEventListener('click', () => {
    setLevel(1);
    startGame();
});

document.getElementById('level2').addEventListener('click', () => {
    setLevel(2);
    startGame();
});

document.getElementById('level3').addEventListener('click', () => {
    setLevel(3);
    startGame();
});

document.getElementById('return-menu').addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
});

document.getElementById('time-up').addEventListener('click', () => {
    if (gameTime < 120) {
        gameTime += 10;
        gameTimeElement.textContent = gameTime;
    }
});

document.getElementById('time-down').addEventListener('click', () => {
    if (gameTime > 10) {
        gameTime -= 10;
        gameTimeElement.textContent = gameTime;
    }
});

// Initialize the game
generateNetPoints();
