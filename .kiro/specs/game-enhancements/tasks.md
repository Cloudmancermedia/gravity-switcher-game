# Implementation Plan

- [x] 1. Implement Storage Manager for game history and preferences
  - Create StorageManager object with methods for high score and sprite preference persistence
  - Add localStorage read/write operations with error handling
  - Integrate high score display on game over screen
  - Update game loop to save scores on game end
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for score persistence
  - **Property 1: Score persistence on game end**
  - **Validates: Requirements 1.1**

- [ ]* 1.2 Write property test for high score retrieval
  - **Property 2: High score retrieval on startup**
  - **Validates: Requirements 1.2**

- [ ]* 1.3 Write property test for high score updates
  - **Property 3: High score update when exceeded**
  - **Validates: Requirements 1.3**

- [ ]* 1.4 Write property test for high score display
  - **Property 4: High score display completeness**
  - **Validates: Requirements 1.5**

 - [x] 2. Create particle system with trail effects
  - Implement ParticleSystem object with particle array and update/render methods
  - Add trail particle generation in game loop during playing state
  - Implement particle aging logic (opacity and size reduction)
  - Add particle cleanup when life reaches zero
  - Render trail particles with purple color and transparency
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 2.1 Write property test for trail particle generation rate
  - **Property 5: Trail particle generation rate**
  - **Validates: Requirements 2.1**

- [ ]* 2.2 Write property test for particle initialization
  - **Property 6: Particle initialization completeness**
  - **Validates: Requirements 2.2, 3.3, 4.2, 5.3**

- [ ]* 2.3 Write property test for particle aging
  - **Property 7: Particle aging behavior**
  - **Validates: Requirements 2.3, 3.4, 4.4, 5.4**

- [ ]* 2.4 Write property test for particle cleanup
  - **Property 8: Particle cleanup on completion**
  - **Validates: Requirements 2.4, 3.5, 4.5, 5.5**

- [ ]* 2.5 Write property test for trail color consistency
  - **Property 9: Trail particle color consistency**
  - **Validates: Requirements 2.5**

- [x] 3. Add explosion, sparkle, and confetti particle effects
  - Implement explosion effect on collision with radiating particles
  - Add sparkle effect when passing through obstacles
  - Create confetti effect when achieving new high score
  - Apply physics (gravity, rotation) to different particle types
  - Ensure particles are cleaned up appropriately
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 3.1 Write property test for explosion creation
  - **Property 10: Explosion creation on collision**
  - **Validates: Requirements 3.1**

- [ ]* 3.2 Write property test for explosion particle count
  - **Property 11: Explosion particle count**
  - **Validates: Requirements 3.2**

- [ ]* 3.3 Write property test for explosion velocity distribution
  - **Property 12: Explosion velocity distribution**
  - **Validates: Requirements 3.3**

- [ ]* 3.4 Write property test for sparkle creation
  - **Property 13: Sparkle creation on obstacle pass**
  - **Validates: Requirements 4.1**

- [ ]* 3.5 Write property test for sparkle position bounds
  - **Property 14: Sparkle position bounds**
  - **Validates: Requirements 4.2**

- [ ]* 3.6 Write property test for confetti trigger
  - **Property 15: Confetti trigger on new high score**
  - **Validates: Requirements 5.1**

- [ ]* 3.7 Write property test for confetti distribution
  - **Property 16: Confetti horizontal distribution**
  - **Validates: Requirements 5.2**

- [ ]* 3.8 Write property test for confetti physics
  - **Property 17: Confetti physics application**
  - **Validates: Requirements 5.4**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement sprite selection system with persistence
  - Create SpriteManager object to load all available Kiro sprites
  - Build sprite selector UI on start screen with thumbnail previews
  - Add click handlers for sprite selection
  - Integrate sprite preference with StorageManager
  - Load saved sprite on game startup with fallback to kiro-classic.png
  - Highlight currently selected sprite in selector UI
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ]* 5.1 Write property test for sprite selection persistence
  - **Property 18: Sprite selection persistence**
  - **Validates: Requirements 6.3**

- [ ]* 5.2 Write property test for sprite preference loading
  - **Property 19: Sprite preference loading**
  - **Validates: Requirements 6.4**

- [ ]* 5.3 Write property test for sprite selection update
  - **Property 20: Sprite selection immediate update**
  - **Validates: Requirements 6.2**

- [ ]* 5.4 Write property test for sprite selector highlight
  - **Property 21: Sprite selector highlight accuracy**
  - **Validates: Requirements 6.7**

- [x] 6. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
