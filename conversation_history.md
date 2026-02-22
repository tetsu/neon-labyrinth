# Neon Labyrinth - Conversation History

This file documents the prompts used with the Antigravity agent to create the Neon Labyrinth game.

## Prompt 1: Initial Generation

```
🛠 The Master Prompt: "Neon Labyrinth"
Role: You are a Senior Game Architect and Creative Director.

Objective: Build a procedurally generated 2D Roguelike Dungeon Crawler called "Neon Labyrinth" using HTML5 Canvas, JavaScript (ES6+), and CSS.

Core Architecture (Delegate to Specialized Agents):

Map Agent: Implement a Binary Space Partitioning (BSP) algorithm to generate a layout of connected rooms and hallways for each "run."

Physics Agent: Create a top-down movement system for the player (WASD) with smooth collision detection against walls.

Combat Agent: Implement a simple projectile system (Mouse Click to fire) and basic "Chasing AI" for enemies.

State Agent: Manage the game flow (Start Menu -> Gameplay -> Death Screen -> Restart).

The "Vibe" Specifications:

Visuals: Dark mode aesthetic with neon cyan and hot pink accents. Add a "bloom" effect to projectiles using Canvas shadowBlur.

Feel: When an enemy is hit, implement a 50ms "hit-stop" (freeze frame) and a slight screen shake to provide tactile feedback.

UI: Use a minimalist HUD showing "HP" and "Rooms Cleared."

Execution Steps:

Start by creating the index.html and a basic game.js to verify the rendering loop in the Integrated Browser.

Iteratively build the Map Generation, then the Player, then the Enemies.

Self-Correct: Use the Browser Agent to check for console errors or "infinite loop" bugs in the procedural generation after every major change.

Acknowledge and provide an initial Task List before writing code.
```

## Prompt 2: Feature Expansion

```
Add following logics. Please make a task list first, and proceed with development.

- Fire also with space key
- each stage has a goal, and when the main character arrives the goal, it moves to the next stage.
- it becomes harder as it goes to next stages.
- show stage number before starting each stage
```

## Prompt 3: Documentation

```
in README, please write how to start this game, add description how I created with Antigravity.
```

## Prompt 4: Save Conversation

```
Make a file to save this conversation.
```
