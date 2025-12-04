// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.12;
const FLIP_POWER = -4;
const OBSTACLE_SPEED = 1.5;
const OBSTACLE_SPAWN_RATE = 240;
const GAP_SIZE = 200;

// Colors (Kiro brand)
const COLORS = {
    background: '#0a0a0a',
    purple: '#790ECB',
    purpleLight: '#9d3ef0',
    white: '#ffffff',
    prey300: '#a0a0a0'
};

// Storage Manager
const StorageManager = {
    // Storage keys
    HIGH_SCORE_KEY: 'gravity-switcher-high-score',
    SPRITE_KEY: 'gravity-switcher-sprite',
    
    // Check if localStorage is available
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available, using in-memory storage');
            return false;
        }
    },
    
    // High score management
    getHighScore() {
        try {
            if (!this.isAvailable()) return 0;
            const stored = localStorage.getItem(this.HIGH_SCORE_KEY);
            const highScore = stored ? parseInt(stored, 10) : 0;
            return isNaN(highScore) ? 0 : highScore;
        } catch (e) {
            console.error('Error reading high score:', e);
            return 0;
        }
    },
    
    setHighScore(score) {
        try {
            if (!this.isAvailable()) return;
            localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
        } catch (e) {
            console.error('Error saving high score:', e);
        }
    },
    
    saveGameHistory(score) {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            this.setHighScore(score);
        }
    },
    
    // Sprite preference management
    getSavedSprite() {
        try {
            if (!this.isAvailable()) return 'kiro-classic.png';
            const stored = localStorage.getItem(this.SPRITE_KEY);
            return stored || 'kiro-classic.png';
        } catch (e) {
            console.error('Error reading sprite preference:', e);
            return 'kiro-classic.png';
        }
    },
    
    setSavedSprite(spriteName) {
        try {
            if (!this.isAvailable()) return;
            localStorage.setItem(this.SPRITE_KEY, spriteName);
        } catch (e) {
            console.error('Error saving sprite preference:', e);
        }
    }
};

// Particle System
const ParticleSystem = {
    particles: [],
    MAX_PARTICLES: 500,
    
    // Create trail particle at player position
    createTrailParticle(x, y) {
        // Limit total particle count
        if (this.particles.length >= this.MAX_PARTICLES) {
            this.particles.shift(); // Remove oldest particle
        }
        
        const particle = {
            x: x + player.width / 2, // Center of player
            y: y + player.height / 2,
            vx: (Math.random() - 0.5) * 0.5, // Small random horizontal velocity
            vy: (Math.random() - 0.5) * 0.5, // Small random vertical velocity
            size: Math.random() * 3 + 2, // Size between 2-5
            opacity: 1.0,
            color: Math.random() > 0.5 ? COLORS.purple : COLORS.purpleLight,
            life: Math.random() * 20 + 20, // Life between 20-40 frames
            maxLife: 40,
            type: 'trail',
            rotation: 0
        };
        
        this.particles.push(particle);
    },
    
    // Create explosion effect at collision point
    createExplosion(x, y) {
        const particleCount = Math.floor(Math.random() * 16) + 15; // 15-30 particles
        
        for (let i = 0; i < particleCount; i++) {
            // Limit total particle count
            if (this.particles.length >= this.MAX_PARTICLES) {
                this.particles.shift();
            }
            
            // Random angle for full 360-degree distribution
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 3 + 2; // Speed between 2-5
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 3, // Size between 3-7
                opacity: 1.0,
                color: Math.random() > 0.5 ? COLORS.purple : COLORS.purpleLight,
                life: Math.random() * 30 + 30, // Life between 30-60 frames
                maxLife: 60,
                type: 'explosion',
                rotation: 0
            };
            
            this.particles.push(particle);
        }
    },
    
    // Create sparkle effect when passing through obstacles
    createSparkles(x, y, gapSize) {
        const sparkleCount = Math.floor(Math.random() * 6) + 5; // 5-10 sparkles
        
        for (let i = 0; i < sparkleCount; i++) {
            // Limit total particle count
            if (this.particles.length >= this.MAX_PARTICLES) {
                this.particles.shift();
            }
            
            const particle = {
                x: x + (Math.random() - 0.5) * 40, // Random x near gap
                y: y + Math.random() * gapSize, // Random y within gap
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 2, // Size between 2-5
                opacity: 1.0,
                color: '#FFD700', // Gold color for sparkles
                life: Math.random() * 20 + 20, // Life between 20-40 frames
                maxLife: 40,
                type: 'sparkle',
                rotation: 0
            };
            
            this.particles.push(particle);
        }
    },
    
    // Create confetti effect for new high score
    createConfetti() {
        const confettiCount = Math.floor(Math.random() * 21) + 30; // 30-50 confetti pieces
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
        
        for (let i = 0; i < confettiCount; i++) {
            // Limit total particle count
            if (this.particles.length >= this.MAX_PARTICLES) {
                this.particles.shift();
            }
            
            const particle = {
                x: Math.random() * canvas.width, // Random x across screen
                y: -20, // Start above screen
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2 + 1, // Falling velocity between 1-3
                size: Math.random() * 4 + 3, // Size between 3-7
                opacity: 1.0,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: Math.random() * 60 + 60, // Life between 60-120 frames
                maxLife: 120,
                type: 'confetti',
                rotation: Math.random() * 360 // Random initial rotation
            };
            
            this.particles.push(particle);
        }
    },
    
    // Update all particles
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Apply physics based on particle type
            if (particle.type === 'explosion') {
                // Apply gravity to explosion particles
                particle.vy += 0.15; // Gravity effect
            } else if (particle.type === 'confetti') {
                // Apply gravity and rotation to confetti
                particle.vy += 0.1; // Gravity effect
                particle.rotation += 5; // Rotate confetti
            } else if (particle.type === 'sparkle') {
                // Sparkles have twinkling effect (scale animation)
                const twinkle = Math.sin(particle.life * 0.3) * 0.5 + 0.5;
                particle.size = (particle.life / particle.maxLife) * (particle.size) * (0.5 + twinkle);
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Age particle
            particle.life--;
            
            // Reduce opacity based on remaining life
            particle.opacity = particle.life / particle.maxLife;
            
            // Remove dead particles or particles that fell off screen
            if (particle.life <= 0 || particle.opacity <= 0 || particle.y > canvas.height + 50) {
                this.particles.splice(i, 1);
            }
        }
    },
    
    // Render all particles
    render(ctx) {
        for (const particle of this.particles) {
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            
            if (particle.type === 'confetti') {
                // Render confetti as rotated rectangles
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation * Math.PI / 180);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size, -particle.size / 2, particle.size * 2, particle.size);
            } else {
                // Render other particles as circles
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    },
    
    // Clear all particles
    clear() {
        this.particles = [];
    }
};

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let highScore = StorageManager.getHighScore(); // Load high score on startup
let frameCount = 0;
let screenShake = 0;
let previousHighScore = highScore; // Track previous high score for confetti trigger

// Player
const player = {
    x: 150,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    velocityY: 0,
    gravityDirection: 1, // 1 = down, -1 = up
    image: null,
    imageLoaded: false
};

// Sprite Manager
const SpriteManager = {
    sprites: {},
    currentSprite: 'kiro-classic.png',
    availableSprites: [
        'kiro-classic.png',
        'kiro-boo.png',
        'kiro-bow.png',
        'kiro-flower.png',
        'kiro-glasses.png',
        'kiro-tophat.png'
    ],
    spritesLoaded: false,
    selectedSpriteUI: null, // Track which sprite is being hovered/selected in UI
    
    // Load all available sprites
    loadAllSprites() {
        return Promise.all(
            this.availableSprites.map(spriteName => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = `kiro-bodies/${spriteName}`;
                    img.onload = () => {
                        this.sprites[spriteName] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load sprite: ${spriteName}`);
                        resolve(); // Continue even if one sprite fails
                    };
                });
            })
        ).then(() => {
            this.spritesLoaded = true;
            // Load saved sprite preference or default
            const savedSprite = StorageManager.getSavedSprite();
            this.selectSprite(savedSprite);
        });
    },
    
    // Select a sprite and update player
    selectSprite(spriteName) {
        // Validate sprite exists
        if (!this.availableSprites.includes(spriteName)) {
            console.warn(`Invalid sprite: ${spriteName}, defaulting to kiro-classic.png`);
            spriteName = 'kiro-classic.png';
        }
        
        this.currentSprite = spriteName;
        
        // Update player image
        if (this.sprites[spriteName]) {
            player.image = this.sprites[spriteName];
            player.imageLoaded = true;
        } else {
            // Fallback to classic if sprite not loaded
            if (this.sprites['kiro-classic.png']) {
                player.image = this.sprites['kiro-classic.png'];
                player.imageLoaded = true;
            }
        }
        
        // Save preference to localStorage
        StorageManager.setSavedSprite(spriteName);
    },
    
    // Get current sprite image
    getCurrentSpriteImage() {
        return this.sprites[this.currentSprite] || null;
    },
    
    // Check if a point is inside a sprite selector thumbnail
    isPointInSprite(x, y, spriteIndex) {
        const startX = canvas.width / 2 - 180;
        const startY = canvas.height / 2 + 120;
        const thumbnailSize = 50;
        const spacing = 10;
        
        const col = spriteIndex % 3;
        const row = Math.floor(spriteIndex / 3);
        
        const thumbX = startX + col * (thumbnailSize + spacing);
        const thumbY = startY + row * (thumbnailSize + spacing);
        
        return x >= thumbX && x <= thumbX + thumbnailSize &&
               y >= thumbY && y <= thumbY + thumbnailSize;
    },
    
    // Handle click on sprite selector
    handleSpriteClick(x, y) {
        if (gameState !== 'start') return false;
        
        for (let i = 0; i < this.availableSprites.length; i++) {
            if (this.isPointInSprite(x, y, i)) {
                this.selectSprite(this.availableSprites[i]);
                return true;
            }
        }
        return false;
    },
    
    // Draw sprite selector UI on start screen
    drawSpriteSelector(ctx) {
        const startX = canvas.width / 2 - 180;
        const startY = canvas.height / 2 + 120;
        const thumbnailSize = 50;
        const spacing = 10;
        
        // Title
        ctx.fillStyle = COLORS.white;
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Choose Your Character:', canvas.width / 2, startY - 20);
        
        // Draw sprite thumbnails in a grid (3 columns)
        this.availableSprites.forEach((spriteName, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);
            
            const x = startX + col * (thumbnailSize + spacing);
            const y = startY + row * (thumbnailSize + spacing);
            
            // Highlight currently selected sprite
            if (spriteName === this.currentSprite) {
                ctx.strokeStyle = COLORS.purple;
                ctx.lineWidth = 4;
                ctx.strokeRect(x - 4, y - 4, thumbnailSize + 8, thumbnailSize + 8);
            } else {
                // Border for non-selected sprites
                ctx.strokeStyle = COLORS.prey300;
                ctx.lineWidth = 2;
                ctx.strokeRect(x - 2, y - 2, thumbnailSize + 4, thumbnailSize + 4);
            }
            
            // Draw sprite thumbnail
            if (this.sprites[spriteName]) {
                ctx.drawImage(this.sprites[spriteName], x, y, thumbnailSize, thumbnailSize);
            } else {
                // Placeholder if sprite not loaded
                ctx.fillStyle = COLORS.prey300;
                ctx.fillRect(x, y, thumbnailSize, thumbnailSize);
            }
        });
    }
};

// Initialize sprite manager
SpriteManager.loadAllSprites();

// Obstacles array
let obstacles = [];

// Input handling
function handleInput() {
    if (gameState === 'start') {
        gameState = 'playing';
        resetGame();
    } else if (gameState === 'playing') {
        flipGravity();
    } else if (gameState === 'gameOver') {
        gameState = 'start';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
    }
});

canvas.addEventListener('click', (e) => {
    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on sprite selector (only on start screen)
    if (gameState === 'start' && SpriteManager.handleSpriteClick(x, y)) {
        return; // Sprite was selected, don't start game
    }
    
    handleInput();
});

// Flip gravity
function flipGravity() {
    player.gravityDirection *= -1;
    player.velocityY = FLIP_POWER * player.gravityDirection;
}

// Reset game
function resetGame() {
    score = 0;
    frameCount = 0;
    obstacles = [];
    player.y = canvas.height / 2;
    player.velocityY = 0;
    player.gravityDirection = 1;
    previousHighScore = highScore; // Update previous high score
    ParticleSystem.clear(); // Clear all particles on reset
}

// Create obstacle
function createObstacle() {
    const gapY = Math.random() * (canvas.height - GAP_SIZE - 100) + 50;
    obstacles.push({
        x: canvas.width,
        gapY: gapY,
        gapSize: GAP_SIZE,
        width: 60,
        passed: false
    });
}

// Update game
function update() {
    if (gameState !== 'playing') return;

    frameCount++;

    // Update player
    player.velocityY += GRAVITY * player.gravityDirection;
    player.y += player.velocityY;

    // Generate trail particles during playing state
    ParticleSystem.createTrailParticle(player.x, player.y);

    // Spawn obstacles
    if (frameCount % OBSTACLE_SPAWN_RATE === 0) {
        createObstacle();
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= OBSTACLE_SPEED;

        // Check if passed
        if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            obstacle.passed = true;
            score++;
            
            // Create sparkle effect when passing through obstacle
            ParticleSystem.createSparkles(obstacle.x + obstacle.width / 2, obstacle.gapY, obstacle.gapSize);
            
            // Check if new high score achieved and trigger confetti
            if (score > previousHighScore) {
                ParticleSystem.createConfetti();
                previousHighScore = score; // Update to prevent multiple confetti triggers
            }
        }

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Update particle system
    ParticleSystem.update();

    // Collision detection
    checkCollisions();
}

// Check collisions
function checkCollisions() {
    // Wall collision
    if (player.y < 0 || player.y + player.height > canvas.height) {
        // Create explosion at collision point
        const explosionY = player.y < 0 ? 0 : canvas.height;
        ParticleSystem.createExplosion(player.x + player.width / 2, explosionY);
        
        gameState = 'gameOver';
        screenShake = 20;
        // Save game history on game end
        StorageManager.saveGameHistory(score);
        highScore = StorageManager.getHighScore();
        return;
    }

    // Obstacle collision
    for (const obstacle of obstacles) {
        if (player.x + player.width > obstacle.x &&
            player.x < obstacle.x + obstacle.width) {
            // Check if player is in the gap
            if (player.y < obstacle.gapY || 
                player.y + player.height > obstacle.gapY + obstacle.gapSize) {
                // Create explosion at collision point
                const explosionX = player.x + player.width / 2;
                const explosionY = player.y < obstacle.gapY ? 
                    obstacle.gapY : obstacle.gapY + obstacle.gapSize;
                ParticleSystem.createExplosion(explosionX, explosionY);
                
                gameState = 'gameOver';
                screenShake = 20;
                // Save game history on game end
                StorageManager.saveGameHistory(score);
                highScore = StorageManager.getHighScore();
                return;
            }
        }
    }
}

// Draw game
function draw() {
    // Apply screen shake
    ctx.save();
    if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
        screenShake *= 0.9; // Decay shake
        if (screenShake < 0.5) screenShake = 0;
    }

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        drawGame();
    } else if (gameState === 'gameOver') {
        drawGame();
        drawGameOver();
    }

    ctx.restore();
}

// Draw start screen
function drawStartScreen() {
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GRAVITY SWITCHER', canvas.width / 2, canvas.height / 2 - 100);

    ctx.fillStyle = COLORS.purple;
    ctx.font = '24px sans-serif';
    ctx.fillText('Press SPACE or click to start!', canvas.width / 2, canvas.height / 2 - 30);

    ctx.fillStyle = COLORS.prey300;
    ctx.font = '18px sans-serif';
    ctx.fillText('Press SPACE to flip gravity', canvas.width / 2, canvas.height / 2 + 10);
    
    // Draw sprite selector
    if (SpriteManager.spritesLoaded) {
        SpriteManager.drawSpriteSelector(ctx);
    }
}

// Draw game
function drawGame() {
    // Draw trail particles (behind everything)
    ParticleSystem.render(ctx);
    
    // Draw obstacles
    for (const obstacle of obstacles) {
        // Top obstacle
        ctx.fillStyle = COLORS.purple;
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.gapY);

        // Bottom obstacle
        ctx.fillRect(obstacle.x, obstacle.gapY + obstacle.gapSize, 
                     obstacle.width, canvas.height - (obstacle.gapY + obstacle.gapSize));

        // Gap indicators
        ctx.strokeStyle = COLORS.purpleLight;
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.gapY, obstacle.width, obstacle.gapSize);
    }

    // Draw player
    if (player.imageLoaded) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        // Fallback square
        ctx.fillStyle = COLORS.purpleLight;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw score
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);

    // Draw gravity indicator
    ctx.fillStyle = COLORS.prey300;
    ctx.font = '16px sans-serif';
    const gravityText = player.gravityDirection === 1 ? '↓ DOWN' : '↑ UP';
    ctx.fillText(`Gravity: ${gravityText}`, 20, 70);
}

// Draw game over screen
function drawGameOver() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);

    ctx.fillStyle = COLORS.purpleLight;
    ctx.font = '32px sans-serif';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);

    // Display high score
    ctx.fillStyle = COLORS.purple;
    ctx.font = '28px sans-serif';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.fillStyle = COLORS.prey300;
    ctx.font = '24px sans-serif';
    ctx.fillText('Press SPACE or click to restart', canvas.width / 2, canvas.height / 2 + 80);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();
