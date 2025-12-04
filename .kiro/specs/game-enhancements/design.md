# Design Document: Game Enhancements

## Overview

This design document outlines the implementation approach for adding persistent game history, visual particle effects, and sprite customization to the Gravity Switcher game. The enhancements maintain the existing vanilla JavaScript architecture while introducing a particle system, localStorage integration, and a sprite selection UI.

## Architecture

### High-Level Components

1. **Storage Manager**: Handles all localStorage operations for scores and preferences
2. **Particle System**: Manages creation, update, and rendering of all particle effects
3. **Sprite Manager**: Handles sprite loading, selection UI, and preference persistence
4. **Enhanced Game Loop**: Integrates particle updates and rendering into existing game loop

### Data Flow

```
Game Events → Particle System → Render Queue
     ↓
Storage Manager ↔ localStorage
     ↓
Game State Updates
```

## Components and Interfaces

### 1. Storage Manager

**Purpose**: Centralize all localStorage operations for game data persistence

**Interface**:
```javascript
const StorageManager = {
    // Score management
    getHighScore: () => number,
    setHighScore: (score: number) => void,
    saveGameHistory: (score: number) => void,
    
    // Sprite preference
    getSavedSprite: () => string,
    setSavedSprite: (spriteName: string) => void
}
```

**Storage Keys**:
- `gravity-switcher-high-score`: Stores the highest score achieved
- `gravity-switcher-sprite`: Stores the selected sprite filename

### 2. Particle System

**Purpose**: Manage all particle effects with a unified update and render pipeline

**Particle Base Structure**:
```javascript
{
    x: number,
    y: number,
    vx: number,        // velocity x
    vy: number,        // velocity y
    size: number,
    opacity: number,
    color: string,
    life: number,      // frames remaining
    maxLife: number,
    type: string       // 'trail', 'explosion', 'sparkle', 'confetti'
}
```

**Interface**:
```javascript
const ParticleSystem = {
    particles: [],
    
    // Creation methods
    createTrailParticle: (x, y) => void,
    createExplosion: (x, y) => void,
    createSparkles: (x, y, gapSize) => void,
    createConfetti: () => void,
    
    // System methods
    update: () => void,
    render: (ctx) => void,
    clear: () => void
}
```

### 3. Sprite Manager

**Purpose**: Handle sprite loading, selection UI, and user preferences

**Available Sprites**:
- kiro-classic.png (default)
- kiro-boo.png
- kiro-bow.png
- kiro-flower.png
- kiro-glasses.png
- kiro-tophat.png

**Interface**:
```javascript
const SpriteManager = {
    sprites: {},           // Loaded image objects
    currentSprite: string,
    
    // Loading
    loadAllSprites: () => Promise,
    
    // Selection
    showSpriteSelector: () => void,
    selectSprite: (spriteName: string) => void,
    
    // Rendering
    getCurrentSpriteImage: () => Image
}
```

## Data Models

### High Score Data
```javascript
{
    highScore: number  // Stored in localStorage as integer
}
```

### Sprite Preference Data
```javascript
{
    selectedSprite: string  // Filename without path (e.g., "kiro-bow.png")
}
```

### Particle Data Model
```javascript
{
    x: number,           // Position x
    y: number,           // Position y
    vx: number,          // Velocity x (-2 to 2)
    vy: number,          // Velocity y (-5 to 5)
    size: number,        // Radius in pixels (2-8)
    opacity: number,     // 0.0 to 1.0
    color: string,       // Hex color code
    life: number,        // Current life in frames
    maxLife: number,     // Maximum life in frames (30-60)
    type: string,        // Particle type identifier
    rotation: number     // For confetti (0-360 degrees)
}
```

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Storage and Persistence Properties

**Property 1: Score persistence on game end**
*For any* game session with a final score, when the game ends, the score should be stored in localStorage immediately.
**Validates: Requirements 1.1**

**Property 2: High score retrieval on startup**
*For any* value stored in localStorage as high score, when the Game System starts, the displayed high score should match the stored value.
**Validates: Requirements 1.2**

**Property 3: High score update when exceeded**
*For any* current score that exceeds the stored high score, the high score in localStorage should be updated to the current score.
**Validates: Requirements 1.3**

**Property 4: High score display completeness**
*For any* game over state, the rendered screen should contain both the current score and the high score.
**Validates: Requirements 1.5**

### Particle System Properties

**Property 5: Trail particle generation rate**
*For any* N consecutive frames in playing state, the system should generate N trail particles at the player position.
**Validates: Requirements 2.1**

**Property 6: Particle initialization completeness**
*For any* particle created (trail, explosion, sparkle, or confetti), it should have all required properties: x, y, vx, vy, size, opacity, color, life, maxLife, and type.
**Validates: Requirements 2.2, 3.3, 4.2, 5.3**

**Property 7: Particle aging behavior**
*For any* particle in the system, after each update cycle, its life should decrease and its opacity should be reduced proportionally to its remaining life.
**Validates: Requirements 2.3, 3.4, 4.4, 5.4**

**Property 8: Particle cleanup on completion**
*For any* particle with life <= 0 or opacity <= 0, it should be removed from the particle array.
**Validates: Requirements 2.4, 3.5, 4.5, 5.5**

**Property 9: Trail particle color consistency**
*For any* trail particle, its color should be from the Kiro purple color palette (#790ECB or #9d3ef0).
**Validates: Requirements 2.5**

### Collision and Effect Properties

**Property 10: Explosion creation on collision**
*For any* collision event (wall or obstacle), an explosion effect should be created at the collision coordinates.
**Validates: Requirements 3.1**

**Property 11: Explosion particle count**
*For any* explosion effect created, it should generate between 15 and 30 particles radiating from the collision point.
**Validates: Requirements 3.2**

**Property 12: Explosion velocity distribution**
*For any* explosion effect, the generated particles should have velocities distributed across all 360 degrees (full circle).
**Validates: Requirements 3.3**

**Property 13: Sparkle creation on obstacle pass**
*For any* obstacle that transitions from not-passed to passed state, sparkle particles should be created at the gap location.
**Validates: Requirements 4.1**

**Property 14: Sparkle position bounds**
*For any* sparkle particle created for an obstacle gap, its y-position should be within the gap boundaries (gapY <= y <= gapY + gapSize).
**Validates: Requirements 4.2**

**Property 15: Confetti trigger on new high score**
*For any* score update where the new score exceeds the previous high score, a confetti effect should be triggered exactly once.
**Validates: Requirements 5.1**

**Property 16: Confetti horizontal distribution**
*For any* confetti effect, the generated particles should have x-positions distributed across the full canvas width (0 to canvas.width).
**Validates: Requirements 5.2**

**Property 17: Confetti physics application**
*For any* confetti particle, each update should apply positive y-velocity (gravity) and increment rotation.
**Validates: Requirements 5.4**

### Sprite Management Properties

**Property 18: Sprite selection persistence**
*For any* sprite selected by the player, the sprite filename should be stored in localStorage immediately.
**Validates: Requirements 6.3**

**Property 19: Sprite preference loading**
*For any* sprite filename stored in localStorage, when the Game System starts, the player character should use that sprite image.
**Validates: Requirements 6.4**

**Property 20: Sprite selection immediate update**
*For any* sprite selected from the sprite selector, the player character image should update to the selected sprite before the next frame renders.
**Validates: Requirements 6.2**

**Property 21: Sprite selector highlight accuracy**
*For any* currently active sprite, when the sprite selector is displayed, that sprite should be visually highlighted.
**Validates: Requirements 6.7**

## Error Handling

### localStorage Errors

**Quota Exceeded**:
- Catch `QuotaExceededError` when writing to localStorage
- Fall back to in-memory storage for the current session
- Display a warning message to the player

**localStorage Unavailable**:
- Check for localStorage availability on startup
- If unavailable (private browsing, disabled), use in-memory fallback
- Game functionality continues without persistence

**Corrupted Data**:
- Validate data types when reading from localStorage
- If invalid, reset to defaults (high score = 0, sprite = kiro-classic.png)
- Log errors to console for debugging

### Sprite Loading Errors

**Missing Sprite Files**:
- If a sprite fails to load, fall back to kiro-classic.png
- If kiro-classic.png fails, use colored rectangle placeholder
- Log missing sprite names to console

**Invalid Sprite Selection**:
- Validate sprite filename against available sprites list
- If invalid, default to kiro-classic.png
- Update localStorage with valid default

### Particle System Errors

**Memory Management**:
- Limit total particle count to 500 particles maximum
- Remove oldest particles first when limit is reached
- Prevents memory issues from particle accumulation

**Invalid Particle Data**:
- Validate particle properties before rendering
- Skip rendering particles with invalid coordinates
- Remove invalid particles from array

## Testing Strategy

### Unit Testing

We will use **Vitest** as our testing framework for unit tests. Unit tests will cover:

**Storage Manager Tests**:
- Test getHighScore with various localStorage states
- Test setHighScore updates localStorage correctly
- Test getSavedSprite with valid and invalid data
- Test setSavedSprite stores correct filename

**Particle System Tests**:
- Test particle creation functions return valid particle objects
- Test particle update reduces life and opacity
- Test particle cleanup removes completed particles
- Test particle array size limits

**Sprite Manager Tests**:
- Test sprite loading handles missing files
- Test sprite selection updates player image
- Test sprite selector UI generation

### Property-Based Testing

We will use **fast-check** as our property-based testing library. Each property-based test will run a minimum of 100 iterations.

**Property Test Requirements**:
- Each property-based test MUST be tagged with a comment referencing the correctness property
- Tag format: `// Feature: game-enhancements, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test

**Property Test Coverage**:

1. **Storage Properties** (Properties 1-4):
   - Generate random scores and verify persistence
   - Generate random localStorage states and verify retrieval
   - Test high score update logic with random score sequences

2. **Particle System Properties** (Properties 5-9):
   - Generate random game states and verify particle generation
   - Generate random particles and verify property completeness
   - Test particle aging with random initial states
   - Verify cleanup with random particle lifetimes

3. **Effect Properties** (Properties 10-17):
   - Generate random collision points and verify explosions
   - Test sparkle creation with random obstacle positions
   - Test confetti with random score sequences
   - Verify particle distributions with statistical analysis

4. **Sprite Properties** (Properties 18-21):
   - Generate random sprite selections and verify persistence
   - Test sprite loading with random localStorage states
   - Verify UI updates with random sprite changes

### Integration Testing

Integration tests will verify:
- Complete game loop with particles and storage
- Sprite selection flow from UI to persistence
- High score update flow from game end to display
- Particle effects triggered by actual gameplay events

### Manual Testing Checklist

- Visual verification of all particle effects
- Sprite selector UI usability
- High score persistence across browser sessions
- Performance with maximum particle count
- localStorage quota handling

## Implementation Notes

### Performance Considerations

**Particle Rendering Optimization**:
- Use `ctx.globalAlpha` for particle transparency instead of rgba colors
- Batch particles by type to minimize context state changes
- Consider using `requestIdleCallback` for particle cleanup

**localStorage Access**:
- Cache high score in memory to avoid repeated localStorage reads
- Debounce localStorage writes during rapid score updates
- Use try-catch blocks to handle localStorage errors gracefully

### Browser Compatibility

**localStorage**:
- Supported in all modern browsers
- Fallback to sessionStorage if localStorage unavailable
- In-memory storage as final fallback

**Canvas API**:
- All particle effects use basic canvas 2D context methods
- No WebGL or advanced features required
- Compatible with all browsers supporting HTML5 Canvas

### Accessibility Considerations

**Visual Effects**:
- Particle effects are purely decorative
- Core gameplay remains accessible without effects
- Consider adding "reduce motion" preference for users with vestibular disorders

**Sprite Selection**:
- Ensure sprite selector is keyboard navigable
- Provide clear focus indicators
- Support Enter/Space for sprite selection

## Future Enhancements

- Add sound effects for particle events
- Implement particle effect intensity settings
- Add more sprite customization options (colors, accessories)
- Export/import game statistics
- Leaderboard integration with backend service
