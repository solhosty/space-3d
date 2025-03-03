<script lang="ts">
    import { Canvas, T } from '@threlte/core';
    import { OrbitControls } from '@threlte/extras';
    import { gameState } from '$lib/stores/gameState.svelte';
    import XWing from './x-wing.svelte';
    import Shuttle from './shuttle.svelte';
    
    let selectedShip = $state(gameState.selectedShip);
    
    function selectShip() {
        gameState.selectShip(selectedShip);
        gameState.setState('playing');
    }
</script>

<div class="ship-selector min-h-screen flex flex-col items-center justify-center p-8">
    <h1 class="text-5xl font-bold mb-12 text-white text-center">Select Your Ship</h1>
    
    <div class="ship-options grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-6xl">
        <div class="ship-option p-6 rounded-xl transition-all duration-300 {selectedShip === 'xwing' ? 'border-cyan-400 shadow-cyan-400/50' : 'border-gray-600'}">
            <h2 class="text-2xl font-bold mb-4 text-center">X-Wing</h2>
            
            <div class="h-64 mb-6">
                <Canvas>
                    <T.PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50}>
                        <OrbitControls enableZoom={false} />
                    </T.PerspectiveCamera>
                    <T.AmbientLight intensity={0.5} />
                    <T.DirectionalLight position={[10, 10, 5]} intensity={1} />
                    <T.Group rotation={[0, Math.PI / 4, 0]}>
                        <XWing />
                    </T.Group>
                </Canvas>
            </div>
            
            <div class="text-gray-300 mb-6 text-center">
                <p class="mb-4">Fast and agile fighter with balanced capabilities</p>
                <ul class="text-left mx-auto max-w-xs">
                    <li class="mb-2">• High top speed</li>
                    <li class="mb-2">• Excellent maneuverability</li>
                    <li class="mb-2">• Standard fuel capacity</li>
                </ul>
            </div>
            
            <button 
                onclick={() => selectedShip = 'xwing'}
                class="w-full py-3 rounded-lg transition-colors {selectedShip === 'xwing' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-700 hover:bg-gray-600'}"
            >
                Select X-Wing
            </button>
        </div>
        
        <div class="ship-option p-6 rounded-xl transition-all duration-300 {selectedShip === 'shuttle' ? 'border-cyan-400 shadow-cyan-400/50' : 'border-gray-600'}">
            <h2 class="text-2xl font-bold mb-4 text-center">Shuttle</h2>
            
            <div class="h-64 mb-6">
                <Canvas>
                    <T.PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50}>
                        <OrbitControls enableZoom={false} />
                    </T.PerspectiveCamera>
                    <T.AmbientLight intensity={0.5} />
                    <T.DirectionalLight position={[10, 10, 5]} intensity={1} />
                    <T.Group rotation={[0, Math.PI / 4, 0]}>
                        <Shuttle />
                    </T.Group>
                </Canvas>
            </div>
            
            <div class="text-gray-300 mb-6 text-center">
                <p class="mb-4">Slower but with powerful vertical thrusters for precise landings</p>
                <ul class="text-left mx-auto max-w-xs">
                    <li class="mb-2">• Moderate top speed</li>
                    <li class="mb-2">• Vertical thrusters (Spacebar)</li>
                    <li class="mb-2">• Larger fuel capacity</li>
                </ul>
            </div>
            
            <button 
                onclick={() => selectedShip = 'shuttle'}
                class="w-full py-3 rounded-lg transition-colors {selectedShip === 'shuttle' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-700 hover:bg-gray-600'}"
            >
                Select Shuttle
            </button>
        </div>
    </div>
    
    <button 
        onclick={selectShip}
        class="start-button bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 px-12 rounded-lg transition-colors"
    >
        Start Mission
    </button>
    
    <div class="mt-8 text-gray-400 max-w-2xl text-center">
        <h3 class="text-xl mb-2">Controls:</h3>
        <p class="mb-1">W/S - Forward/Backward | A/D - Turn Left/Right</p>
        <p class="mb-1">Q/E - Ascend/Descend | G - Toggle Landing Gear</p>
        <p class="mb-1">C - Toggle Camera View | Space - Activate Thrusters (Shuttle only)</p>
    </div>
</div>

<style>
    .ship-selector {
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('/stars-bg.jpg');
        background-size: cover;
        color: white;
    }
    
    h1 {
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
    }
    
    .ship-option {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }
    
    .ship-option :global(canvas) {
        width: 100%;
        height: 100%;
    }
    
    button {
        color: white;
        cursor: pointer;
    }
    
    .start-button {
        box-shadow: 0 0 15px rgba(0, 170, 255, 0.5);
    }
</style>