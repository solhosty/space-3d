<script lang="ts">
    import { gameState } from '$lib/stores/gameState.svelte';
    
    // External props
    let { hovering, stabilizeAltitude } = $props();
</script>

<div class="hud">
    <div class="top-bar">
        <div class="health">
            <div class="label">SHIELDS</div>
            <div class="bar">
                <div class="fill" style="width: {gameState.health}%"></div>
            </div>
        </div>
        <div class="score">
            <div class="label">SCORE</div>
            <div class="value">{gameState.score}</div>
        </div>
        {#if gameState.selectedShip === 'shuttle'}
            <div class="fuel">
                <div class="label">FUEL</div>
                <div class="bar">
                    <div class="fill" style="width: {gameState.fuel}%"></div>
                </div>
            </div>
        {/if}
    </div>
    
    <!-- Targeting reticle -->
    <div class="reticle">
        <div class="inner"></div>
        <div class="outer"></div>
    </div>
    
    <!-- Ship status indicators -->
    <div class="status-panel">
        <div class="ship-indicator">
            {gameState.selectedShip === 'xwing' ? 'X-WING FIGHTER' : 'SPACE SHUTTLE'}
        </div>
        <div class="camera-mode">
            CAMERA: {gameState.cameraView === 'first-person' ? 'COCKPIT' : 'EXTERNAL'}
        </div>
        <div class="landing-gear">
            LANDING GEAR: {gameState.landingGearDeployed ? 'DEPLOYED' : 'RETRACTED'}
        </div>
        <div class="flight-mode">
            MODE: {gameState.flightMode.toUpperCase()}
            {#if hovering}
                <span class="hover-tag">HOVER</span>
            {/if}
            {#if stabilizeAltitude}
                <span class="stabilize-tag">ALT-LOCK</span>
            {/if}
        </div>
        {#if gameState.isNearMoon}
            <div class="landing-alert">
                MOON LANDING ZONE DETECTED
            </div>
        {/if}
        {#if gameState.flightMode === 'landed'}
            <div class="landed-message">
                LANDED SUCCESSFULLY - REFUELING
            </div>
        {/if}
    </div>
    
    <!-- Controls reminder -->
    <div class="controls">
        <div>W/S - Forward/Back</div>
        <div>A/D - Turn Left/Right</div>
        <div>Q/E - Up/Down</div>
        <div>G - Toggle Landing Gear</div>
        <div>C - Switch Camera</div>
        <div>H - Toggle Hover Mode</div>
        <div>Z - Toggle Altitude Lock</div>
        <div>SPACE - Thrusters (Shuttle)</div>
    </div>
</div>

<style>
    .hud {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        color: rgba(0, 255, 200, 0.8);
        font-family: monospace;
        user-select: none;
    }

    .top-bar {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        gap: 20px;
    }

    .health, .fuel {
        margin-bottom: 10px;
    }

    .label {
        font-size: 14px;
        margin-bottom: 5px;
    }

    .bar {
        width: 200px;
        height: 15px;
        background: rgba(0, 255, 200, 0.2);
        border: 1px solid rgba(0, 255, 200, 0.5);
        border-radius: 2px;
        overflow: hidden;
    }

    .health .fill {
        background: rgba(0, 255, 200, 0.5);
    }
    
    .fuel .fill {
        background: rgba(255, 165, 0, 0.7);
    }

    .fill {
        height: 100%;
        transition: width 0.3s;
    }

    .score {
        display: flex;
        flex-direction: column;
    }

    .value {
        font-size: 24px;
        font-weight: bold;
    }

    .reticle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .inner {
        width: 5px;
        height: 5px;
        background: rgba(0, 255, 200, 0.8);
        border-radius: 50%;
    }

    .outer {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        border: 1px solid rgba(0, 255, 200, 0.8);
        border-radius: 50%;
    }

    .status-panel {
        position: absolute;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 200, 0.5);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .landing-alert {
        color: #ffff00;
        font-weight: bold;
        animation: blink 1s infinite;
    }
    
    .landed-message {
        color: #00ff00;
        font-weight: bold;
    }
    
    .hover-tag {
        margin-left: 8px;
        padding: 2px 5px;
        background: rgba(0, 255, 255, 0.3);
        color: cyan;
        border-radius: 3px;
        font-size: 0.8em;
    }
    
    .stabilize-tag {
        margin-left: 8px;
        padding: 2px 5px;
        background: rgba(255, 255, 0, 0.3);
        color: yellow;
        border-radius: 3px;
        font-size: 0.8em;
    }
    
    .controls {
        position: absolute;
        bottom: 20px;
        left: 20px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 200, 0.5);
        border-radius: 4px;
        font-size: 12px;
    }
    
    @keyframes blink {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
    }
</style>