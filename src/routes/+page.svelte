<script lang="ts">
    import { Canvas } from '@threlte/core';
    import { ShipSelector, GameController } from '$lib/components';
    import { gameState } from '$lib/stores/gameState.svelte';
</script>

<div class="game-container h-full w-full bg-black relative">
    {#if gameState.state === 'menu'}
        <ShipSelector />
    {:else}
        <Canvas>
            <GameController />
        </Canvas>
    {/if}
</div>