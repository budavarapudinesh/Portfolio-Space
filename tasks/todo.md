# World Monitor Globe — Task Checklist

- [x] Study existing codebase and integration points
- [x] Create `globe-data.ts` (continent polygons, locations, routes, utilities)
- [x] Create `globe.tsx` (Three.js globe with all sub-components)
- [x] Update `profile-scene.tsx` (import Globe instead of MindMap)
- [x] Delete `mind-map.tsx`
- [x] Clean up unused CSS in `globals.css`
- [x] Fix: Address WebGL Context Lost rendering bugs (retina scaling, heavy bloom)
- [x] Refactor: Extract `<Globe>` out of absolute background into `page.tsx` flex layout to perfectly align below the NavBar without hacky offsets.
- [x] Fix: Zoom out globe camera to fov=48, z=17.

# Earth3DMap Aesthetic Refinements (Phase 2)

- [x] Switch globe material to use the daylight `earth-blue-marble.jpg` texture globally to match the reference.
- [x] Add `<Stars>` component from `@react-three/drei` for the space background.
- [x] Adjust `Atmosphere` shader to produce a tighter, whitish-blue rim glow.
- [x] Implement ambient/directional lighting adjustments to ensure the entire globe is brightly visible like the reference.
