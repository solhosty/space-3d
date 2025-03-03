<script lang="ts">
    import { T } from '@threlte/core';
    
    let { position = [0, 0, 0], radius = 50, color = '#c0c0c0' } = $props<{
        position?: [number | undefined, number | undefined, number | undefined];
        radius?: number;
        color?: string;
    }>();
</script>

<T.Group {position}>
    <T.Mesh>
        <T.SphereGeometry args={[radius, 32, 32]} />
        <T.MeshStandardMaterial {color} />
    </T.Mesh>
    
    <!-- Add a point light to make the moon glow slightly -->
    <T.PointLight color="#ffffff" intensity={0.5} distance={radius * 3} />
</T.Group>