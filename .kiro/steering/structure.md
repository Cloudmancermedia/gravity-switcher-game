# Project Structure

## Root Files
- `index.html` - Main HTML entry point with canvas element and inline styles
- `game.js` - Core game logic, rendering, and game loop
- `server.js` - Express server for local development (static file serving)
- `package.json` - Project metadata and dependencies
- `README.md` - Project documentation

## Asset Directories
- `kiro-bodies/` - Character sprite images
  - `kiro-classic.png` - Default player sprite
  - `kiro-boo.png`, `kiro-bow.png`, `kiro-flower.png`, etc. - Alternative sprites

## Configuration
- `.gitignore` - Git exclusions
- `.kiro/steering/` - AI assistant steering rules and context
- `.vscode/` - VS Code workspace settings

## Architecture Pattern

### Single-File Game Structure (game.js)
1. **Canvas Setup** - Initialize canvas and 2D context
2. **Constants** - Physics values, colors, game parameters
3. **Game State** - Current state, score, frame counter
4. **Player Object** - Position, velocity, gravity direction, sprite
5. **Obstacles Array** - Dynamic list of moving obstacles
6. **Input Handlers** - Keyboard and mouse event listeners
7. **Game Logic Functions**:
   - `flipGravity()` - Reverse gravity direction
   - `resetGame()` - Initialize new game
   - `createObstacle()` - Spawn new obstacle
   - `update()` - Physics and game state updates
   - `checkCollisions()` - Collision detection
8. **Rendering Functions**:
   - `draw()` - Main render dispatcher
   - `drawStartScreen()` - Start screen UI
   - `drawGame()` - Active gameplay rendering
   - `drawGameOver()` - Game over overlay
9. **Game Loop** - `gameLoop()` with requestAnimationFrame

## Code Organization Principles
- All game logic in single `game.js` file (no modules)
- Separation of update and render logic
- State machine pattern for game states
- Object-based entity management (player, obstacles)
- Event-driven input handling
