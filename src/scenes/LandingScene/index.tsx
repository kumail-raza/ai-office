import {
  Background,
  LandingLayout,
  ProfileCard,
  SmartDoor,
  VisitorPanel,
} from "@/features/landing/components";

export function LandingScene() {
  return (
    <LandingLayout>
      <Background />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          minHeight: "100dvh",
          padding: "2rem",
        }}
      >
        <ProfileCard />
        <SmartDoor />
        <VisitorPanel />
      </div>
    </LandingLayout>
  );
}
