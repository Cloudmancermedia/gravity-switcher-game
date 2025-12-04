# User Context - Gravity Switcher Game

## Game Preferences

### Language & Framework
- **Language**: Vanilla JavaScript
- **Rendering**: HTML5 Canvas
- **Target**: Browser-based game

### Game Mechanics (Inspired by VVVVVV + Flappy Bird)
- **Gravity System**: True gravity flip - press SPACE/click to reverse gravity direction completely
- **Character**: Kiro logo (kiro-logo.png) as player sprite
- **Obstacles**: Gaps between top/bottom barriers moving right-to-left (Flappy Bird style)
- **Scoring**: +1 point for each obstacle successfully passed
- **Difficulty**: Balanced physics for fair gameplay

### Physics Parameters
- Gravity: 0.3
- Jump/Flip Power: -6
- Obstacle Speed: 1.5 pixels per frame
- Obstacle Spawn Rate: Every 180 frames

### Game States
1. **start**: Shows "Press SPACE or click to start!"
2. **playing**: Active gameplay
3. **gameOver**: Shows score and restart option

### Visual Style (Kiro Brand Colors)
- Primary: Purple-500 (#790ECB) for UI elements
- Background: Dark theme (Black-900)
- Text: White on dark backgrounds
- Obstacles: Purple accent colors

### MVP Features
- Start screen
- Gravity flip mechanic
- Moving obstacles with gaps
- Collision detection
- Score counter
- Game over screen
- Restart functionality
- Responsive controls (SPACE key or mouse click)
