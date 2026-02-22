# Neon Labyrinth

A procedural 2D Roguelike Dungeon Crawler featuring a dark mode aesthetic with neon cyan and hot pink accents.

![Live Demo](https://img.shields.io/badge/Play-Live_Demo-brightgreen?style=for-the-badge&logo=github)

**Play the game here:** [https://tetsu.github.io/neon-labyrinth](https://tetsu.github.io/neon-labyrinth)

## How to Play

1. Clone or download this repository to your local machine.
2. Open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Safari).
3. Click on the "Click to Start" text on the title screen to begin the game.
4. **Controls:**
   - **W, A, S, D**: Move your character (the hot pink circle).
   - **Mouse Left-Click / Spacebar**: Shoot neon cyan projectiles towards your cursor (or last known cursor position).
5. **Gameplay Loop & Progression**:
   - Survive as long as you can against the chasing enemies (red circles).
   - Once you finish exploring a level, look for the **pulsing green Goal tile**.
   - Step on the Goal to transport to the **next stage**.
   - The game becomes progressively harder; expect more enemies rolling towards you at higher speeds with each new stage!

## About

This game was proudly created using **Antigravity**, Google Deepmind's advanced agentic coding assistant. Antigravity designed the architecture, implemented the Binary Space Partitioning (BSP) map generation, coded the combat and physics agents, and applied the signature "neon glow" and "hit-stop" game feel effects.

## Prompt

1

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

1.

```
Add following logics. Please make a task list first, and proceed with development.

- Fire also with space key
- each stage has a goal, and when the main character arrives the goal, it moves to the next stage.
- it becomes harder as it goes to next stages.
- show stage number before starting each stage
```
