<script lang="ts">
    import { T } from '@threlte/core';
    import * as THREE from 'three';
    
    // Define props with proper types
    let { position = [0, 0, 0], rotation = [0, 0, 0], landingGearDeployed = false, thrustersActive = false } = $props<{
        position?: [number, number, number];
        rotation?: [number, number, number];
        landingGearDeployed?: boolean;
        thrustersActive?: boolean;
    }>();
    
    // Create flame texture
    const textureLoader = new THREE.TextureLoader();
    let flameTexture: THREE.Texture | undefined = $state(undefined);
    
    try {
        flameTexture = textureLoader.load('/flame.png');
    } catch (e) {
        console.error('Failed to load flame texture:', e);
        // Create a fallback texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create a radial gradient for the flame
        if (ctx) {
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 0, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 128, 0, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
        }
        
        flameTexture = new THREE.CanvasTexture(canvas);
    }
</script>

<!-- Space Shuttle model with landing gear and rocket effects -->
<T.Group {position} {rotation}>
    <!-- Main body -->
    <T.Mesh position={[0, 0, 0]}>
        <T.CylinderGeometry args={[0.5, 1, 4, 16]} />
        <T.MeshStandardMaterial color="#ffffff" />
    </T.Mesh>
    
    <!-- Cockpit -->
    <T.Mesh position={[0, 0.5, 1.5]}>
        <T.SphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <T.MeshStandardMaterial color="#88ccff" transparent={true} opacity={0.7} />
    </T.Mesh>
    
    <!-- Left wing -->
    <T.Mesh position={[-1.5, 0, 0]}>
        <T.BoxGeometry args={[2, 0.2, 1.5]} />
        <T.MeshStandardMaterial color="#ffffff" />
    </T.Mesh>
    
    <!-- Right wing -->
    <T.Mesh position={[1.5, 0, 0]}>
        <T.BoxGeometry args={[2, 0.2, 1.5]} />
        <T.MeshStandardMaterial color="#ffffff" />
    </T.Mesh>
    
    <!-- Tail fin -->
    <T.Mesh position={[0, 1, -1.5]}>
        <T.BoxGeometry args={[0.2, 1.5, 1]} />
        <T.MeshStandardMaterial color="#ffffff" />
    </T.Mesh>
    
    <!-- Main engines -->
    <T.Mesh position={[0, 0, -2]}>
        <T.CylinderGeometry args={[0.7, 0.7, 0.5, 16]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- Side engines -->
    <T.Mesh position={[-0.8, 0, -2]}>
        <T.CylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <T.Mesh position={[0.8, 0, -2]}>
        <T.CylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- NASA logo -->
    <T.Mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <T.PlaneGeometry args={[1, 0.5]} />
        <T.MeshStandardMaterial color="#0b3d91" />
    </T.Mesh>
    
    <!-- Landing gear (only visible when deployed) -->
    {#if landingGearDeployed}
        <!-- Front landing gear -->
        <T.Mesh position={[0, -1.2, 1.5]}>
            <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Front landing gear wheels -->
        <T.Mesh position={[0, -1.6, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <T.CylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <T.MeshStandardMaterial color="#333333" />
        </T.Mesh>
        
        <!-- Left landing gear -->
        <T.Mesh position={[-1, -1.2, -0.5]}>
            <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Left landing gear wheels -->
        <T.Mesh position={[-1, -1.6, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <T.CylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <T.MeshStandardMaterial color="#333333" />
        </T.Mesh>
        
        <!-- Right landing gear -->
        <T.Mesh position={[1, -1.2, -0.5]}>
            <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Right landing gear wheels -->
        <T.Mesh position={[1, -1.6, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <T.CylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <T.MeshStandardMaterial color="#333333" />
        </T.Mesh>
    {/if}
    
    <!-- Rocket flames (only visible when thrusters active) -->
    {#if thrustersActive}
        <!-- Main engine flame -->
        <T.Sprite position={[0, 0, -2.5]} scale={[1.5, 1.5, 1.5]}>
            <T.SpriteMaterial map={flameTexture} color="#ff9900" transparent={true} />
        </T.Sprite>
        
        <!-- Side engine flames -->
        <T.Sprite position={[-0.8, 0, -2.5]} scale={[0.8, 0.8, 0.8]}>
            <T.SpriteMaterial map={flameTexture} color="#ff9900" transparent={true} />
        </T.Sprite>
        
        <T.Sprite position={[0.8, 0, -2.5]} scale={[0.8, 0.8, 0.8]}>
            <T.SpriteMaterial map={flameTexture} color="#ff9900" transparent={true} />
        </T.Sprite>
        
        <!-- Engine glow light -->
        <T.PointLight position={[0, 0, -2.5]} color="#ff6600" intensity={2} distance={10} />
    {/if}
    
    <!-- Navigation lights -->
    <T.PointLight position={[-2, 0, 0]} color="#ff0000" intensity={0.5} distance={10} />
    <T.PointLight position={[2, 0, 0]} color="#00ff00" intensity={0.5} distance={10} />
    <T.PointLight position={[0, 1, -1.5]} color="#ffffff" intensity={0.5} distance={5} />
</T.Group>