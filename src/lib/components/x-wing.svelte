<script lang="ts">
    import { T } from '@threlte/core';
    
    // Define props with proper types
    let { position = [0, 0, 0], rotation = [0, 0, 0], landingGearDeployed = false } = $props<{
        position?: [number, number, number];
        rotation?: [number, number, number];
        landingGearDeployed?: boolean;
    }>();
</script>

<!-- X-Wing model with cockpit positioned for first-person view -->
<T.Group {position} {rotation}>
    <!-- Main body -->
    <T.Mesh position={[0, 0, 0]}>
        <T.BoxGeometry args={[1, 0.5, 3]} />
        <T.MeshStandardMaterial color="#cccccc" />
    </T.Mesh>
    
    <!-- Cockpit -->
    <T.Mesh position={[0, 0.4, 0.5]}>
        <T.SphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <T.MeshStandardMaterial color="#88ccff" transparent={true} opacity={0.7} />
    </T.Mesh>
    
    <!-- Nose cone -->
    <T.Mesh position={[0, 0, 1.7]}>
        <T.ConeGeometry args={[0.5, 1, 16]} />
        <T.MeshStandardMaterial color="#cccccc" />
    </T.Mesh>
    
    <!-- Wings -->
    <!-- Top-left wing -->
    <T.Mesh position={[-1.2, 0.3, 0]}>
        <T.BoxGeometry args={[2, 0.1, 1.5]} />
        <T.MeshStandardMaterial color="#ff3333" />
    </T.Mesh>
    
    <!-- Top-right wing -->
    <T.Mesh position={[1.2, 0.3, 0]}>
        <T.BoxGeometry args={[2, 0.1, 1.5]} />
        <T.MeshStandardMaterial color="#ff3333" />
    </T.Mesh>
    
    <!-- Bottom-left wing -->
    <T.Mesh position={[-1.2, -0.3, 0]}>
        <T.BoxGeometry args={[2, 0.1, 1.5]} />
        <T.MeshStandardMaterial color="#ff3333" />
    </T.Mesh>
    
    <!-- Bottom-right wing -->
    <T.Mesh position={[1.2, -0.3, 0]}>
        <T.BoxGeometry args={[2, 0.1, 1.5]} />
        <T.MeshStandardMaterial color="#ff3333" />
    </T.Mesh>
    
    <!-- Wing cannons -->
    <!-- Top-left cannon -->
    <T.Mesh position={[-2.1, 0.3, 0.5]}>
        <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- Top-right cannon -->
    <T.Mesh position={[2.1, 0.3, 0.5]}>
        <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- Bottom-left cannon -->
    <T.Mesh position={[-2.1, -0.3, 0.5]}>
        <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- Bottom-right cannon -->
    <T.Mesh position={[2.1, -0.3, 0.5]}>
        <T.CylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- Engine glow -->
    <T.PointLight position={[0, 0, -1.6]} color="#ff6600" intensity={0.8} distance={5} />
    
    <!-- Engines -->
    <T.Mesh position={[0, 0, -1.6]}>
        <T.CylinderGeometry args={[0.4, 0.5, 0.5, 16]} />
        <T.MeshStandardMaterial color="#333333" />
    </T.Mesh>
    
    <!-- Landing gear (only visible when deployed) -->
    {#if landingGearDeployed}
        <!-- Front landing gear -->
        <T.Mesh position={[0, -0.5, 1]}>
            <T.CylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Front landing gear foot -->
        <T.Mesh position={[0, -0.7, 1]}>
            <T.SphereGeometry args={[0.1, 8, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Left landing gear -->
        <T.Mesh position={[-0.5, -0.5, -0.5]}>
            <T.CylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Left landing gear foot -->
        <T.Mesh position={[-0.5, -0.7, -0.5]}>
            <T.SphereGeometry args={[0.1, 8, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Right landing gear -->
        <T.Mesh position={[0.5, -0.5, -0.5]}>
            <T.CylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
        
        <!-- Right landing gear foot -->
        <T.Mesh position={[0.5, -0.7, -0.5]}>
            <T.SphereGeometry args={[0.1, 8, 8]} />
            <T.MeshStandardMaterial color="#666666" />
        </T.Mesh>
    {/if}
    
    <!-- Navigation lights -->
    <T.PointLight position={[-2.2, 0.3, 0.5]} color="#ff0000" intensity={0.5} distance={10} />
    <T.PointLight position={[2.2, 0.3, 0.5]} color="#00ff00" intensity={0.5} distance={10} />
</T.Group>