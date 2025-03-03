<script lang="ts">
    import { T } from '@threlte/core';
    
    let { position = [0, 0, 0], radius = 100, color = '#a3e2f5' } = $props<{
        position?: [number, number, number];
        radius?: number;
        color?: string;
    }>();
</script>

<T.Group {position}>
    <T.Mesh>
        <T.SphereGeometry args={[radius, 64, 64]} />
        <T.MeshStandardMaterial {color} />
    </T.Mesh>
    
    <!-- Add a point light to make the planet glow slightly -->
    <T.PointLight color="#ffffff" intensity={0.8} distance={radius * 4} />
</T.Group>