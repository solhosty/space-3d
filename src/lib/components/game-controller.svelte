<script lang="ts">
    import { T } from '@threlte/core';
    import { World } from '@threlte/rapier';
    import { gameState } from '$lib/stores/gameState.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { Stars, Shuttle, XWing, Planet, Moon, Asteroid, HUD } from '.';
    
    // Mobile controls state
    let touchControls = $state(false);
    let touchThrust = $state(0);
    let touchYaw = $state(0);
    let touchPitch = $state(0);
    let touchAltitude = $state(0);
    
    // Ship movement controls
    let thrust = 0;
    let keys = new Set<string>();
    let gravity = 0.01;
    let hovering = $state(false);
    let stabilizeAltitude = $state(true); // Default to altitude stabilization
    
    // Camera controls
    let cameraOffset = { x: 0, y: 5, z: -15 }; // Third-person camera offset
    
    // Collision detection
    let collisionDetected = $state(false);
    let nearbyObjects: Array<{
        type: string;
        distance: number;
        object: {
            id: number;
            position: {x: number; y: number; z: number};
            radius: number;
            color: string;
        }
    }> = [];
    
    // World generation - use regular variables, not reactive state
    const worldSeed = Math.floor(Math.random() * 1000000);
    
    // Simple seeded random function
    function seedRandom(seed: number) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
    
    // Generate random celestial bodies
    function generateCelestialBodies(count: number, type: string, seed: number) {
    const bodies = [];
    const random = seedRandom(seed);
    
    // Minimum distance between celestial bodies to prevent overlap
    const minDistance = type === 'planet' ? 300 : 150;
    
    for (let i = 0; i < count; i++) {
        let validPosition = false;
        let newPosition;
        
        // Keep trying positions until we find one that doesn't overlap
        while (!validPosition) {
            // Generate a new position with wider spread
            newPosition = {
                x: (random() * 2 - 1) * 800,
                y: (random() * 2 - 1) * 200, // Reduced height range
                z: (random() * 2 - 1) * 800
            };
            
            // Check distance from all existing bodies
            validPosition = true;
            for (const body of bodies) {
                if (!body?.position) continue;
                const dx = newPosition.x - body?.position?.x;
                const dy = newPosition.y - body?.position?.y;
                const dz = newPosition.z - body?.position?.z;
                
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // If too close to another body, try again
                if (distance < minDistance) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        bodies.push({
            id: i,
            position: newPosition,
            radius: type === 'planet' ? 
                100 + random() * 150 : // Planets are larger
                40 + random() * 60,    // Moons are smaller
            color: type === 'planet' ? 
                ['#3498db', '#e74c3c', '#9b59b6', '#2ecc71'][Math.floor(random() * 4)] : // Brighter planet colors
                ['#f1c40f', '#bdc3c7', '#ecf0f1'][Math.floor(random() * 3)]   // Brighter moon colors
        });
    }
    return bodies;
}
    
    // Generate celestial bodies once at initialization
    const moons = generateCelestialBodies(10, 'moon', worldSeed);
    const planets = generateCelestialBodies(5, 'planet', worldSeed + 100);
    
    // Handle keyboard input
    function handleKeyDown(e: KeyboardEvent) {
        keys.add(e.key.toLowerCase());
        
        // Camera toggle with 'c' key - fixed implementation
        if (e.key.toLowerCase() === 'c' && !e.repeat) {
            console.log("Toggling camera view from", gameState.cameraView);
            if (gameState.cameraView === 'first-person') {
                gameState.cameraView = 'third-person';
            } else {
                gameState.cameraView = 'first-person';
            }
            console.log("Camera view now:", gameState.cameraView);
        }
        
        // Landing gear toggle
        if (e.key.toLowerCase() === 'g') {
            gameState.toggleLandingGear();
        }
        
        // Activate thrusters for shuttle
        if (e.key === ' ' && gameState.selectedShip === 'shuttle') {
            gameState.activateThrusters();
        }
        
        // Toggle hover mode with H key
        if (e.key.toLowerCase() === 'h') {
            hovering = !hovering;
        }
        
        // Toggle altitude stabilization with Z key
        if (e.key.toLowerCase() === 'z') {
            stabilizeAltitude = !stabilizeAltitude;
        }
    }
    
    function handleKeyUp(e: KeyboardEvent) {
        keys.delete(e.key.toLowerCase());
        
        // Deactivate thrusters when space is released
        if (e.key === ' ' && gameState.selectedShip === 'shuttle') {
            gameState.deactivateThrusters();
        }
    }
    
    // Update camera position for both camera views
    function updateCameraPosition() {
        if (gameState.cameraView === 'third-person') {
            // Third-person: Position camera behind and above the ship
            const cameraDistance = 20;
            const cameraHeight = 8;
            
            // Position camera at fixed offset
            gameState.cameraPosition.x = gameState.position.x;
            gameState.cameraPosition.y = gameState.position.y + cameraHeight;
            gameState.cameraPosition.z = gameState.position.z + cameraDistance; // Position camera BEHIND the ship
            
            // Always look at the ship
            gameState.cameraTarget.x = gameState.position.x;
            gameState.cameraTarget.y = gameState.position.y;
            gameState.cameraTarget.z = gameState.position.z;
        } else {
            // First-person: Position camera inside the cockpit
            // Calculate forward direction based on ship rotation
            const cosY = Math.cos(gameState.rotation.y);
            const sinY = Math.sin(gameState.rotation.y);
            const cosX = Math.cos(gameState.rotation.x);
            const sinX = Math.sin(gameState.rotation.x);
            
            // Position camera at cockpit position (slightly forward from ship center)
            gameState.cameraPosition.x = gameState.position.x + sinY * 1.0;
            gameState.cameraPosition.y = gameState.position.y + 0.8; // Slightly above center for cockpit view
            gameState.cameraPosition.z = gameState.position.z + cosY * 1.0;
            
            // Look in the direction the ship is facing
            gameState.cameraTarget.x = gameState.position.x + sinY * 10;
            gameState.cameraTarget.y = gameState.position.y + sinX * 10;
            gameState.cameraTarget.z = gameState.position.z + cosY * 10;
        }
    }
    
    // Game loop
    let animationFrame: number | undefined;
    
    function gameLoop() {
        // Process keyboard input
        processInput();
        
        // Apply physics
        applyPhysics();
        
        // Check for collisions
        checkCollisions();
        
        // Update camera position for third-person view
        updateCameraPosition();
        
        // Request next frame
        animationFrame = requestAnimationFrame(gameLoop);
    }
    
    // Process keyboard input
    function processInput() {
        // Reset thrust
        thrust = 0;
        
        // Combine keyboard and touch inputs
        // Forward/backward movement
        if (keys.has('w')) thrust += 1;
        if (keys.has('s')) thrust -= 1;
        thrust += touchThrust;
        
        // Rotation controls
        if (keys.has('a')) gameState.rotation.y += 0.02;
        if (keys.has('d')) gameState.rotation.y -= 0.02;
        gameState.rotation.y += touchYaw * 0.02;
        
        if (keys.has('arrowup')) gameState.rotation.x += 0.02;
        if (keys.has('arrowdown')) gameState.rotation.x -= 0.02;
        gameState.rotation.x += touchPitch * 0.02;
        
        // Altitude control
        if (keys.has('q')) gameState.position.y += 0.5;
        if (keys.has('e')) gameState.position.y -= 0.5;
        gameState.position.y += touchAltitude * 0.5;
    }
    
    // Apply physics to ship movement
    function applyPhysics() {
        // Calculate movement based on ship's rotation
        const cosY = Math.cos(gameState.rotation.y);
        const sinY = Math.sin(gameState.rotation.y);
        
        // Apply thrust in the direction the ship is facing
        gameState.position.x += thrust * sinY;
        gameState.position.z += thrust * cosY;
        
        // Apply gravity if not hovering
        if (!hovering) {
            gameState.position.y -= gravity;
        }
        
        // Stabilize altitude if enabled
        if (stabilizeAltitude && !keys.has('q') && !keys.has('e')) {
            // Find the closest celestial body below
            let closestGroundDistance = Infinity;
            let groundY = -100; // Default ground level
            
            for (const body of [...planets, ...moons]) {
                if (!body?.position) continue;
                const dx = gameState.position.x - body.position.x;
                const dy = gameState.position.y - body.position.y;
                const dz = gameState.position.z - body.position.z;
                
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (distance < body.radius + 50 && distance > body.radius) {
                    // We're above a celestial body
                    const surfaceY = body.position.y + body.radius;
                    const distanceToSurface = Math.abs(gameState.position.y - surfaceY);
                    
                    if (distanceToSurface < closestGroundDistance) {
                        closestGroundDistance = distanceToSurface;
                        groundY = surfaceY;
                    }
                }
            }
            
            // Stabilize at 10 units above the ground
            const targetY = groundY + 10;
            const diff = targetY - gameState.position.y;
            
            // Smoothly adjust height
            if (Math.abs(diff) > 0.1) {
                gameState.position.y += diff * 0.05;
            }
        }
        
        // Limit maximum altitude to prevent flying too high
        const maxAltitude = 1000; // Increased max altitude
        if (gameState.position.y > maxAltitude) {
            gameState.position.y = maxAltitude;
        }
    }
    
    // Check for collisions with celestial bodies
    function checkCollisions() {
        // Reset collision flag
        collisionDetected = false;
        nearbyObjects = [];
        
        // Check collisions with planets and moons
        for (const body of [...planets, ...moons]) {
            if (!body?.position) continue;
            const dx = gameState.position.x - body.position.x;
            const dy = gameState.position.y - body.position.y;
            const dz = gameState.position.z - body.position.z;
            
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            // Add to nearby objects if within detection range
            if (distance < body.radius * 3) {
            nearbyObjects.push({
                type: body.radius > 100 ? 'planet' : 'moon',
                distance: distance - body.radius,
                object: {
                    id: body.id,
                    position: { ...body.position }, // Create a new object to ensure it's defined
                    radius: body.radius,
                    color: body.color
                }
            });
        }
            
            // Check for collision
            if (distance < body.radius + 5) {
                collisionDetected = true;
                
                // Bounce back from collision
                const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const nx = dx / length;
                const ny = dy / length;
                const nz = dz / length;
                
                // Position ship on surface
                gameState.position.x = body.position.x + nx * (body.radius + 5);
                gameState.position.y = body.position.y + ny * (body.radius + 5);
                gameState.position.z = body.position.z + nz * (body.radius + 5);
                
                // Reduce speed on collision
                thrust *= 0.5;
            }
        }
    }
    
    // Start game loop on component mount
    onMount(() => {
        // Remove any existing listeners to prevent duplicates
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        
        // Add our listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Generate asteroids
        asteroids = generateAsteroids(50, worldSeed);
        
        // Start game loop
        gameLoop();
        
        // Check if this is likely a mobile device
        touchControls = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            
            // Cancel animation frame
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    });
    let asteroids: Array<{
        id: number;
        position: { x: number; y: number; z: number };
        size: number;
    }> = $state([]);

    function generateAsteroids(count: number, seed: number) {
    const random = seedRandom(seed);
    
    for (let i = 0; i < count; i++) {
        asteroids.push({
            id: i,
            position: {
                x: (random() * 2 - 1) * 300,
                y: (random() * 2 - 1) * 100,
                z: (random() * 2 - 1) * 300
            },
            size: 5 + random() * 15
        });
    }
    
    return asteroids;
}
    
    onDestroy(() => {
        // Clean up event listeners
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        
        // Cancel animation frame
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });

    // Handle touch controls
    function handleTouchStart(e: TouchEvent, control: string) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        updateTouchControl(control, x, y, centerX, centerY);
    }
    
    function handleTouchMove(e: TouchEvent, control: string) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        updateTouchControl(control, x, y, centerX, centerY);
    }
    
    function handleTouchEnd(e: TouchEvent, control: string) {
        e.preventDefault();
        // Reset the control when touch ends
        if (control === 'movement') {
            touchThrust = 0;
            touchYaw = 0;
        } else if (control === 'altitude') {
            touchAltitude = 0;
        } else if (control === 'camera') {
            touchPitch = 0;
        }
    }
    
    function updateTouchControl(control: string, x: number, y: number, centerX: number, centerY: number) {
        // Calculate normalized values (-1 to 1)
        const normalizedX = (x - centerX) / centerX;
        const normalizedY = (y - centerY) / centerY;
        
        if (control === 'movement') {
            // Left joystick controls thrust and yaw
            touchThrust = -normalizedY; // Forward/backward
            touchYaw = -normalizedX;    // Left/right rotation
        } else if (control === 'altitude') {
            // Right joystick vertical controls altitude
            touchAltitude = -normalizedY;
        } else if (control === 'camera') {
            // Right joystick horizontal controls pitch
            touchPitch = normalizedY;
        }
    }
</script>

<World>
    <!-- Background stars -->
    <Stars />
    
    <!-- Celestial bodies -->
    {#each planets as planet}
        <Planet 
            position={[planet?.position?.x, planet?.position?.y, planet?.position?.z]} 
            radius={planet?.radius} 
            color={planet?.color} 
        />
    {/each}
    
    {#each moons as moon}
        <Moon 
            position={[moon?.position?.x, moon?.position?.y, moon?.position?.z]} 
            radius={moon?.radius} 
            color={moon?.color} 
        />
    {/each}
    
    <!-- Asteroids - generate more of them -->
    {#each asteroids as asteroid}
    <Asteroid 
        position={asteroid.position}
        size={asteroid.size}
    />
    {/each}
    
    <!-- Player ship -->
    {#if gameState.selectedShip === 'xwing'}
        <XWing 
            position={[gameState.position.x, gameState.position.y, gameState.position.z]} 
            rotation={[gameState.rotation.x, gameState.rotation.y, gameState.rotation.z]} 
            landingGearDeployed={gameState.landingGearDeployed}
        />
    {:else}
        <Shuttle 
            position={[gameState.position.x, gameState.position.y, gameState.position.z]} 
            rotation={[gameState.rotation.x, gameState.rotation.y, gameState.rotation.z]} 
            landingGearDeployed={gameState.landingGearDeployed}
            thrustersActive={gameState.thrusterActive}
        />
    {/if}
    
    <!-- Camera -->
    <T.PerspectiveCamera 
    makeDefault 
    position={[
        gameState.cameraPosition.x,
        gameState.cameraPosition.y,
        gameState.cameraPosition.z
    ]}
    lookAt={[
        gameState.cameraTarget.x,
        gameState.cameraTarget.y,
        gameState.cameraTarget.z
    ]}
    fov={gameState.cameraView === 'first-person' ? 90 : 75} 
    near={0.1}
    far={10000}
/>
    
    <!-- Lighting -->
    <T.AmbientLight intensity={0.5} />
    <T.DirectionalLight 
        position={[100, 100, 100]} 
        intensity={1} 
        castShadow
    />
</World>

<!-- HUD overlay -->
<HUD hovering={hovering} stabilizeAltitude={stabilizeAltitude} />

<!-- Mobile controls - only shown on touch devices -->
{#if touchControls}
    <div class="mobile-controls">
        <!-- Left joystick for movement -->
        <div class="touch-joystick left-joystick"
            ontouchstart={(e) => handleTouchStart(e, 'movement')}
            ontouchmove={(e) => handleTouchMove(e, 'movement')}
            ontouchend={(e) => handleTouchEnd(e, 'movement')}>
            <div class="joystick-thumb" style="transform: translate({touchYaw * 30}px, {touchThrust * 30}px)"></div>
        </div>
        
        <!-- Right joystick for altitude and camera -->
        <div class="touch-joystick right-joystick"
            ontouchstart={(e) => handleTouchStart(e, 'altitude')}
            ontouchmove={(e) => handleTouchMove(e, 'altitude')}
            ontouchend={(e) => handleTouchEnd(e, 'altitude')}>
            <div class="joystick-thumb" style="transform: translate(0px, {touchAltitude * 30}px)"></div>
        </div>
        
        <!-- Action buttons -->
        <div class="touch-buttons">
            <button class="touch-button" ontouchstart={() => { 
                if (gameState.cameraView === 'first-person') {
                    gameState.cameraView = 'third-person';
                } else {
                    gameState.cameraView = 'first-person';
                }
            }}>
                <span>C</span>
            </button>
            <button class="touch-button" ontouchstart={() => { gameState.toggleLandingGear(); }}>
                <span>G</span>
            </button>
            <button class="touch-button" ontouchstart={() => { hovering = !hovering; }}>
                <span>H</span>
            </button>
            {#if gameState.selectedShip === 'shuttle'}
                <button class="touch-button" ontouchstart={() => { gameState.activateThrusters(); }}>
                    <span>🚀</span>
                </button>
            {/if}
        </div>
    </div>
{/if}

<!-- Hover mode indicator -->
{#if hovering}
    <div class="hover-indicator">
        HOVER MODE ACTIVE
    </div>
{/if}

<!-- Altitude stabilization indicator -->
{#if stabilizeAltitude}
    <div class="stabilize-indicator">
        ALTITUDE STABILIZATION ACTIVE
    </div>
{/if}

<!-- Collision warning -->
{#if collisionDetected}
    <div class="collision-warning">
        COLLISION DETECTED
    </div>
{/if}

<style>
    .hover-indicator {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 255, 255, 0.2);
        color: cyan;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        border: 1px solid cyan;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
    
    .stabilize-indicator {
        position: fixed;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 0, 0.2);
        color: yellow;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        border: 1px solid yellow;
        box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
    }
    
    .collision-warning {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.3);
        color: red;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        border: 1px solid red;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        animation: blink 0.5s infinite;
    }
    
    @keyframes blink {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
    
    /* Mobile controls styling */
    .mobile-controls {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 200px;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        z-index: 100;
    }
    
    .touch-joystick {
        width: 120px;
        height: 120px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 60px;
        margin: 20px;
        position: relative;
        pointer-events: auto;
    }
    
    .left-joystick {
        align-self: flex-end;
    }
    
    .right-joystick {
        align-self: flex-end;
    }
    
    .joystick-thumb {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 25px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-left: -25px;
        margin-top: -25px;
    }
    
    .touch-buttons {
        display: flex;
        flex-direction: row;
        align-self: flex-end;
        margin: 20px;
        gap: 10px;
    }
    
    .touch-button {
        width: 60px;
        height: 60px;
        background: rgba(0, 100, 255, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 20px;
        pointer-events: auto;
    }
</style>