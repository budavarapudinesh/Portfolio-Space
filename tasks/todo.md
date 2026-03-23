# World Monitor Globe — Task Checklist

- [x] Study existing codebase and integration points
- [x] Create `globe-data.ts` (continent polygons, locations, routes, utilities)
- [x] Understand requirements for "free in background" vs structured flex canvas.
- [x] Check `chip.tsx` and `page.tsx` for pointer-events, z-index, and container structure.
- [x] Remove `Chip` from the flex flow (right-side column) in `page.tsx`.
- [x] Implement `Chip` as a true background layer (`inset: 0`, `position: absolute`, low `z-index`), alongside `ProfileScene` but distinct.
- [x] Ensure Main UI elements (Sidebar, NavBar) have `pointer-events: auto` and are styled independently over the background. into `page.tsx` flex layout to perfectly align below the NavBar without hacky offsets.
- [x] Fix: Zoom out globe camera to fov=48, z=17.

# Earth3DMap Aesthetic Refinements (Phase 2)

- [x] Switch globe material to use the daylight `earth-blue-marble.jpg` texture globally to match the reference.
- [x] Add `<Stars>` component from `@react-three/drei` for the space background.
- [x] Adjust `Atmosphere` shader to produce a tighter, whitish-blue rim glow.
- [x] Implement ambient/directional lighting adjustments to ensure the entire globe is brightly visible like the reference.

# Run Portfolio Space
- [x] Ensure dev server is not hanging.
- [x] Start development server cleanly.
- [x] Verify functionality.

# Fix Email Service
- [x] Investigate missing configuration
- [x] Add new `RESEND_API_KEY` and `CONTACT_EMAIL` to `.env.local`
- [x] Restart dev server if needed
- [x] Verify email configuration is resolved
