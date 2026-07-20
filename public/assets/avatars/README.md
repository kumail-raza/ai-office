# Avatar model slot

Drop avatar `.glb` files here to replace the procedural placeholder figure.

## Expected files

| File | Registry id | Notes |
| --- | --- | --- |
| `kumail.glb` | `kumail` | The primary digital-twin avatar (Ready Player Me export recommended) |
| `ready-player-me.glb` | `ready-player-me` | Generic RPM avatar |
| `fallback-avatar.glb` | `fallback-avatar` | Tried when the active model is missing or broken |

## Activating a model

1. Place the file here with the exact name above (lowercase — case matters on
   deployed hosts).
2. In `src/features/avatar/services/AvatarRegistry.ts`, flip that entry's
   `shipped: false` → `true`.

Nothing else changes. The RigAdapter detects the rig convention from skeleton
naming (Ready Player Me / Mixamo / generic GLTF), animation clips play with
state-driven crossfades if the file carries any, and ARKit-style blend shapes
drive the full expression system when present.

## If a file is missing or broken

Nothing crashes. The loader resolves it to null and tries the fallback model;
if that also fails (or isn't shipped), the procedural figure renders. A model
that parses but throws while mounting is caught by the avatar error boundary
and swapped for the procedural figure too.

## Export tips (Ready Player Me)

- Full-body avatar, GLB format.
- Enable ARKit blend shapes (morph targets) for facial expressions and gaze.
- If your export's animation clip names are unusual, add a `clipOverrides` map
  to the avatar's registry entry rather than renaming clips.
