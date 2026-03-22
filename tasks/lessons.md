# Technical Lessons

## 1. React-Three-Fiber Raycasting Performance
**Issue:** Attaching pointer events (`onPointerDown`, `onPointerOver`, etc.) to a parent `<group>` that contains high-polygon meshes (like a 64x64 SphereGeometry) forces R3F to run Raycasting against all those vertices on every single mouse movement over the canvas. This causes severe CPU spikes and framerate drops ("glitches") when the user tries to drag or orbit the camera.
**Solution:** Avoid putting pointer events directly on large environment meshes. For auto-rotation that pauses on interaction, either use `OrbitControls`'s built-in `autoRotate` prop, or rely on `controls.addEventListener('start')` instead of canvas-level raycasting.

## 2. Decal Z-Fighting on Spheres
**Issue:** Flat geometries (circles, rings) placed very close to a sphere's surface (e.g., at `radius * 1.002`) will Z-fight and flicker wildly when the camera zooms in and out due to WebGL depth buffer precision limits at different distances.
**Solution:** Always use `polygonOffset: true`, `polygonOffsetFactor: -4`, and `polygonOffsetUnits: -4` on the material of the decals/markers to programmatically push them slightly closer to the camera in the depth buffer without physically moving them away from the surface.

## 3. WebGL Context Lost (GPU Crashes) on Retina Displays
**Issue:** When the globe was dragged or scrolled aggressively, the renderer would sometimes flash black and permanently glitch. The browser console reported `THREE.WebGLRenderer: Context Lost.`. This was a silent GPU crash caused by the R3F `<Canvas>` combined with `<EffectComposer>` on Mac Retina displays. Because Retina screens have a high `devicePixelRatio` (2.0 or 3.0), the post-processing engine was silently creating massive 6K/8K ping-pong render targets. Updating these targets while uploading BufferGeometry color arrays during drag interactions completely maxed out the VRAM limits.
**Solution:** 
1. Always cap the canvas pixel ratio using `<Canvas dpr={1}>` (or max 1.5) when using heavy post-processing or high-res textures to prevent exponential internal resolution scaling.
2. Remove `mipmapBlur` from post-processing effects, as regenerating mipmaps on 6K render targets 60 times a second forces driver timeouts.
3. Remove continuous CPU `BufferAttribute` updates inside `useFrame`, as they flood the GPU memory bus.

## 4. Real-Time Day/Night Globe Shader
**Approach:** Instead of using a static `MeshStandardMaterial` with a single texture, a custom `ShaderMaterial` was created that accepts both `dayTexture` (Blue Marble satellite) and `nightTexture` (city lights) as uniforms. A `sunDirection` uniform is computed each frame from the current UTC time using solar declination and hour angle formulas. The fragment shader uses `smoothstep` near the terminator to blend between lit daytime satellite imagery and glowing nighttime city lights. This gives a realistic, always-updating day/night cycle that matches the real world.
**Key Gotcha:** The `nightIntensity` uniform must be high enough (1.5+ for light mode, 2.5+ for dark mode) so the night side isn't pitch black when the dark hemisphere happens to face the camera.
