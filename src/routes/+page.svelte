<script lang="ts">
    import { Canvas } from '@threlte/core';
    import { ShipSelector, GameController } from '$lib/components';
    import { gameState } from '$lib/stores/gameState.svelte';
</script>

<div class="game-container">
    {#if gameState.state === 'menu'}
        <ShipSelector />
    {:else}
        <Canvas>
            <GameController />
        </Canvas>
    {/if}
</div>

<style>
    .game-container {
        width: 100vw;
        height: 100vh;
        position: relative;
        background: black;
    }
</style> 