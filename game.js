class StateAgent {
    constructor(onChangeCallback) {
        this.onChange = onChangeCallback;
        this.states = {
            MENU: 'MENU',
            PLAYING: 'PLAYING',
            GAMEOVER: 'GAMEOVER'
        };
        this.currentState = this.states.MENU;

        this.screens = {
            MENU: document.getElementById('start-screen'),
            PLAYING: document.getElementById('hud'),
            GAMEOVER: document.getElementById('death-screen')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.screens.MENU.addEventListener('click', () => this.changeState(this.states.PLAYING));
        this.screens.GAMEOVER.addEventListener('click', () => this.changeState(this.states.MENU));
    }

    changeState(newState) {
        this.currentState = newState;
        this.updateUI();
        if (this.onChange) {
            this.onChange(newState);
        }
    }

    updateUI() {
        for (const key in this.screens) {
            this.screens[key].classList.remove('active');
        }
        if (this.screens[this.currentState]) {
            this.screens[this.currentState].classList.add('active');
        }
    }
}

class BSPNode {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.left = null; this.right = null;
        this.room = null;
    }
}

class MapAgent {
    constructor() {
        this.tileSize = 40;
        this.cols = 50;
        this.rows = 30;
        this.grid = [];
        this.rooms = [];
    }

    generate() {
        if (this.grid.length > 0) return; // Only generate once per transition

        this.grid = [];
        this.rooms = [];

        // Fill grid with walls (1)
        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = new Array(this.cols).fill(1);
        }

        // Leave 1 tile padding around edges
        let root = new BSPNode(1, 1, this.cols - 2, this.rows - 2);

        this.splitNode(root, 4);
        this.createRooms(root);
        this.createCorridors(root);

        console.log(`Map generated with ${this.rooms.length} rooms.`);
    }

    splitNode(node, iter) {
        if (iter <= 0) return;

        let splitH = Math.random() > 0.5;
        if (node.w > node.h * 1.25) splitH = false;
        else if (node.h > node.w * 1.25) splitH = true;

        let minSize = 6;
        if (splitH) {
            if (node.h < minSize * 2) return;
            let splitPos = Math.floor(Math.random() * (node.h - minSize * 2)) + minSize;
            node.left = new BSPNode(node.x, node.y, node.w, splitPos);
            node.right = new BSPNode(node.x, node.y + splitPos, node.w, node.h - splitPos);
        } else {
            if (node.w < minSize * 2) return;
            let splitPos = Math.floor(Math.random() * (node.w - minSize * 2)) + minSize;
            node.left = new BSPNode(node.x, node.y, splitPos, node.h);
            node.right = new BSPNode(node.x + splitPos, node.y, node.w - splitPos, node.h);
        }

        this.splitNode(node.left, iter - 1);
        this.splitNode(node.right, iter - 1);
    }

    createRooms(node) {
        if (node.left || node.right) {
            if (node.left) this.createRooms(node.left);
            if (node.right) this.createRooms(node.right);
        } else {
            let rw = Math.floor(Math.random() * (node.w - 3)) + 3;
            let rh = Math.floor(Math.random() * (node.h - 3)) + 3;
            let rx = node.x + Math.floor(Math.random() * (node.w - rw));
            let ry = node.y + Math.floor(Math.random() * (node.h - rh));

            node.room = { x: rx, y: ry, w: rw, h: rh, centerX: Math.floor(rx + rw / 2), centerY: Math.floor(ry + rh / 2) };
            this.rooms.push(node.room);

            for (let y = ry; y < ry + rh; y++) {
                for (let x = rx; x < rx + rw; x++) {
                    this.grid[y][x] = 0; // 0 is floor
                }
            }
        }
    }

    createCorridors(node) {
        if (node.left && node.right) {
            this.createCorridors(node.left);
            this.createCorridors(node.right);

            let lc = this.getCenter(node.left);
            let rc = this.getCenter(node.right);
            this.carveCorridor(lc.x, lc.y, rc.x, rc.y);
        }
    }

    getCenter(node) {
        if (node.room) return { x: node.room.centerX, y: node.room.centerY };
        return this.getCenter(node.left || node.right);
    }

    carveCorridor(x1, y1, x2, y2) {
        let x = x1; let y = y1;
        while (x !== x2) {
            this.grid[y][x] = 0;
            x += Math.sign(x2 - x);
        }
        while (y !== y2) {
            this.grid[y][x] = 0;
            y += Math.sign(y2 - y);
        }
        this.grid[y2][x2] = 0;
    }

    draw(ctx) {
        if (this.grid.length === 0) return;

        // Draw floors
        ctx.fillStyle = '#0a0a0f';
        ctx.shadowBlur = 0;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 0) {
                    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }

        // Draw neon walls (lines between floor and walls)
        ctx.strokeStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    let ts = this.tileSize;
                    let px = x * ts;
                    let py = y * ts;

                    // Top edge
                    if (y > 0 && this.grid[y - 1][x] === 0) { ctx.moveTo(px, py); ctx.lineTo(px + ts, py); }
                    // Bottom edge
                    if (y < this.rows - 1 && this.grid[y + 1][x] === 0) { ctx.moveTo(px, py + ts); ctx.lineTo(px + ts, py + ts); }
                    // Left edge
                    if (x > 0 && this.grid[y][x - 1] === 0) { ctx.moveTo(px, py); ctx.lineTo(px, py + ts); }
                    // Right edge
                    if (x < this.cols - 1 && this.grid[y][x + 1] === 0) { ctx.moveTo(px + ts, py); ctx.lineTo(px + ts, py + ts); }
                }
            }
        }
        ctx.stroke();
    }
}

class PhysicsAgent {
    constructor(mapAgent) {
        this.mapAgent = mapAgent;
        this.x = 0;
        this.y = 0;
        this.w = 16;
        this.h = 16;
        this.speed = 250;
        this.keys = {};

        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
    }

    update(dt) {
        let dx = 0;
        let dy = 0;

        if (this.keys['w']) dy -= 1;
        if (this.keys['s']) dy += 1;
        if (this.keys['a']) dx -= 1;
        if (this.keys['d']) dx += 1;

        if (dx !== 0 && dy !== 0) {
            let len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
        }

        let vx = dx * this.speed * (dt / 1000);
        let vy = dy * this.speed * (dt / 1000);

        this.x += vx;
        if (this.checkCollision()) this.x -= vx;

        this.y += vy;
        if (this.checkCollision()) this.y -= vy;
    }

    checkCollision() {
        let ts = this.mapAgent.tileSize;
        let pL = this.x - this.w;
        let pR = this.x + this.w;
        let pT = this.y - this.h;
        let pB = this.y + this.h;

        let startCol = Math.max(0, Math.floor(pL / ts));
        let endCol = Math.min(this.mapAgent.cols - 1, Math.floor(pR / ts));
        let startRow = Math.max(0, Math.floor(pT / ts));
        let endRow = Math.min(this.mapAgent.rows - 1, Math.floor(pB / ts));

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (this.mapAgent.grid[r][c] === 1) return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = '#ff00ff';
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fill();
    }
}

class CombatAgent {
    constructor(engine) {
        this.engine = engine;
        this.projectiles = [];
        this.enemies = [];

        window.addEventListener('mousedown', (e) => this.shoot(e));
    }

    spawnEnemies(count) {
        this.enemies = [];
        let rooms = this.engine.mapAgent.rooms;
        for (let i = 0; i < count; i++) {
            let room = rooms[Math.floor(Math.random() * (rooms.length - 1)) + 1]; // Skip first room
            let ex = room.centerX * this.engine.mapAgent.tileSize;
            let ey = room.centerY * this.engine.mapAgent.tileSize;
            this.enemies.push({ x: ex, y: ey, w: 16, hp: 3, speed: 100 });
        }
    }

    shoot(e) {
        if (this.engine.stateAgent.currentState !== this.engine.stateAgent.states.PLAYING) return;

        let camX = this.engine.canvas.width / 2 - this.engine.physicsAgent.x;
        let camY = this.engine.canvas.height / 2 - this.engine.physicsAgent.y;

        let worldX = e.clientX - camX;
        let worldY = e.clientY - camY;

        let dx = worldX - this.engine.physicsAgent.x;
        let dy = worldY - this.engine.physicsAgent.y;
        let angle = Math.atan2(dy, dx);

        this.projectiles.push({
            x: this.engine.physicsAgent.x,
            y: this.engine.physicsAgent.y,
            vx: Math.cos(angle) * 500,
            vy: Math.sin(angle) * 500,
            radius: 4,
            life: 2000
        });
    }

    update(dt) {
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let p = this.projectiles[i];
            p.x += p.vx * (dt / 1000);
            p.y += p.vy * (dt / 1000);
            p.life -= dt;

            // Wall collision
            if (this.isWall(p.x, p.y)) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Enemy collision
            let hit = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                let e = this.enemies[j];
                let dist = Math.hypot(p.x - e.x, p.y - e.y);
                if (dist < p.radius + e.w) {
                    e.hp -= 1;
                    hit = true;
                    this.engine.triggerHitStop(50);
                    this.engine.triggerScreenShake(200, 8);
                    if (e.hp <= 0) {
                        this.enemies.splice(j, 1);
                    }
                    break;
                }
            }

            if (hit || p.life <= 0) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update enemies
        let px = this.engine.physicsAgent.x;
        let py = this.engine.physicsAgent.y;
        for (let e of this.enemies) {
            let dx = px - e.x;
            let dy = py - e.y;
            let len = Math.hypot(dx, dy);
            if (len > 0) {
                let vx = (dx / len) * e.speed * (dt / 1000);
                let vy = (dy / len) * e.speed * (dt / 1000);

                e.x += vx;
                if (this.checkEnemyWallCollision(e)) e.x -= vx;

                e.y += vy;
                if (this.checkEnemyWallCollision(e)) e.y -= vy;
            }
        }
    }

    isWall(x, y) {
        let ts = this.engine.mapAgent.tileSize;
        let c = Math.floor(x / ts);
        let r = Math.floor(y / ts);
        if (r >= 0 && r < this.engine.mapAgent.rows && c >= 0 && c < this.engine.mapAgent.cols) {
            return this.engine.mapAgent.grid[r][c] === 1;
        }
        return true;
    }

    checkEnemyWallCollision(e) {
        let ts = this.engine.mapAgent.tileSize;
        let c = Math.floor(e.x / ts);
        let r = Math.floor(e.y / ts);
        if (r >= 0 && r < this.engine.mapAgent.rows && c >= 0 && c < this.engine.mapAgent.cols) {
            return this.engine.mapAgent.grid[r][c] === 1;
        }
        return true;
    }

    draw(ctx) {
        // Draw enemies
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 15;
        for (let e of this.enemies) {
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.w, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw projectiles
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        for (let p of this.projectiles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
}

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.mapAgent = new MapAgent();
        this.physicsAgent = new PhysicsAgent(this.mapAgent);
        this.combatAgent = new CombatAgent(this);
        this.stateAgent = new StateAgent((state) => this.onStateChange(state));

        this.lastTime = 0;
        this.hitStopDuration = 0; // Remaining hit stop time
        this.shakeDuration = 0;
        this.shakeIntensity = 0;

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    onStateChange(state) {
        if (state === this.stateAgent.states.PLAYING) {
            this.mapAgent.generate();
            let startRoom = this.mapAgent.rooms[0];
            let ts = this.mapAgent.tileSize;
            this.physicsAgent.spawn(startRoom.centerX * ts, startRoom.centerY * ts);
            this.combatAgent.spawnEnemies(this.mapAgent.rooms.length * 2); // 2 per room roughly
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    triggerHitStop(duration = 50) {
        this.hitStopDuration = duration;
    }

    triggerScreenShake(duration = 100, intensity = 5) {
        this.shakeDuration = duration;
        this.shakeIntensity = intensity;
    }

    loop(time) {
        requestAnimationFrame(this.loop);

        if (this.lastTime === 0) {
            this.lastTime = time;
        }
        const dt = time - this.lastTime;
        this.lastTime = time;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background grid (temporarily just a dark fill, handled by CSS mostly, but let's do a faint grid)
        this.drawFaintGrid();

        if (this.hitStopDuration > 0) {
            this.hitStopDuration -= dt;
            // Skip update logic during hit stop, but continue drawing
        } else {
            this.update(dt);
        }

        this.draw();
    }

    drawFaintGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
        }
    }

    update(dt) {
        if (this.stateAgent.currentState === this.stateAgent.states.PLAYING) {
            this.physicsAgent.update(dt);
            this.combatAgent.update(dt);

            // UI
            document.getElementById('hp-value').innerText = "100"; // Placeholder for actual HP
            document.getElementById('rooms-value').innerText = this.mapAgent.rooms.length - this.combatAgent.enemies.length > 0 ? this.mapAgent.rooms.length - this.combatAgent.enemies.length : 0;
        }
    }

    draw() {
        if (this.stateAgent.currentState === this.stateAgent.states.PLAYING) {
            this.ctx.save();

            // Screen Shake
            let sx = 0, sy = 0;
            if (this.shakeDuration > 0) {
                sx = (Math.random() - 0.5) * this.shakeIntensity;
                sy = (Math.random() - 0.5) * this.shakeIntensity;
                this.shakeDuration -= 16;
            }

            // Camera follow player
            let camX = this.canvas.width / 2 - this.physicsAgent.x;
            let camY = this.canvas.height / 2 - this.physicsAgent.y;
            this.ctx.translate(camX + sx, camY + sy);

            this.mapAgent.draw(this.ctx);
            this.physicsAgent.draw(this.ctx);
            this.combatAgent.draw(this.ctx);

            this.ctx.restore();
        }
    }
}

// Initialize on load
window.onload = () => {
    const engine = new GameEngine();
};
