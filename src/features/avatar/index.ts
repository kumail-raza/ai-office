export { OfficeAvatar, type AvatarFocusTarget } from "./components/OfficeAvatar";
export { AvatarPresenceDebugPanel } from "./components/AvatarPresenceDebugPanel";
export { AvatarRegistry, avatarEvents, type AvatarInteractionEventMap } from "./services";
export { useAvatarModel, useActiveAvatarModel, type ResolvedAvatar } from "./hooks";
export { presenceDebug, avatarStatus, VisitorFocus, type FocusTarget } from "./presence";
export { RigAdapter, ExpressionAdapter, EyeTargetAdapter, HeadTrackingAdapter, FocusTargetName, type AdaptedRig } from "./adapters";
export { AnimationController } from "./managers";
export {
  AvatarId,
  AvatarAssetType,
  AVATAR_ASSETS,
  DEFAULT_AVATAR_ID,
  type AvatarAsset,
} from "./config/avatarAssets";
export { rpmAvatarLoader, type RpmAvatarInstance } from "./loaders/RpmAvatarLoader";
export { FaceShape, type FaceRig } from "./face";
export * from "./types";
