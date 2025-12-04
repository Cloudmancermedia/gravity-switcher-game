# Technology Stack

## Core Technologies
- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Runtime**: Browser-based (client-side)
- **Server**: Express.js (static file serving only)
- **Module System**: CommonJS

## Dependencies
- `express` (^5.2.1) - Static file server for local development

## Project Structure
- Single-page application with no build step
- Direct script loading (no bundler)
- Static assets served from root directory

## Common Commands

### Development
```bash
npm start        # Start development server on port 3000
npm run dev      # Alias for npm start
```

### Running the Game
1. Start server: `npm start`
2. Open browser: `http://localhost:3000`
3. Game runs entirely in browser - no compilation needed

## Code Conventions
- Use `const` for constants and immutable references
- Canvas context stored in `ctx` variable
- Game loop uses `requestAnimationFrame` for 60 FPS
- Event listeners for keyboard (Space) and mouse (click) input
- Color constants defined in `COLORS` object using Kiro brand palette
- Game state managed with string literals: 'start', 'playing', 'gameOver'

## Performance Targets
- 60 FPS gameplay
- Immediate input response
- Smooth animations using requestAnimationFrame
