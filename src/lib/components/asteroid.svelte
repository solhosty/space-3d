<script lang="ts">
    import { T } from '@threlte/core';
    import { RigidBody } from '@threlte/rapier';
    
    let { position = { x: 0, y: 0, z: 0 }, size = 10 } = $props<{
        position?: { x: number, y: number, z: number };
        size?: number;
    }>();
    
    // Random scale
    const scale = Math.random() * 2 + 0.5;
    
    // Random rotation
    const rotation = {
        x: Math.random() * Math.PI,
        y: Math.random() * Math.PI,
        z: Math.random() * Math.PI
    };
</script>

<RigidBody type="fixed">
    <T.Group position={[position.x, position.y, position.z]} 
             rotation={[rotation.x, rotation.y, rotation.z]} 
             scale={scale}>
        <T.Mesh>
            <T.DodecahedronGeometry args={[size, 0]} />
            <T.MeshStandardMaterial color="#555555" />
        </T.Mesh>
    </T.Group>
</RigidBody>