<script lang="ts">
    import { T } from '@threlte/core';
    import * as THREE from 'three';
    
    // Create a star field
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
</script>

<T.Points>
    <T.BufferGeometry instance={geometry} />
    <T.PointsMaterial color="#ffffff" size={1} sizeAttenuation={false} />
</T.Points>