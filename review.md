diff --git a/.gitignore b/.gitignore
index baca0d0..d9f5599 100644
--- a/.gitignore
+++ b/.gitignore
@@ -17,3 +17,6 @@ out/
 *.log
 .DS_Store
 coverage/
+
+# local scratch
+tree.txt
diff --git a/package.json b/package.json
index a7cff46..160b24c 100644
--- a/package.json
+++ b/package.json
@@ -2,7 +2,21 @@
   "name": "ai-office",
   "version": "0.1.0",
   "private": true,
-  "scripts": {},
-  "dependencies": {},
-  "devDependencies": {}
+  "scripts": {
+    "dev": "next dev",
+    "build": "next build",
+    "start": "next start",
+    "typecheck": "tsc --noEmit"
+  },
+  "dependencies": {
+    "next": "^15.3.3",
+    "react": "^19.1.0",
+    "react-dom": "^19.1.0"
+  },
+  "devDependencies": {
+    "@types/node": "^22.15.0",
+    "@types/react": "^19.1.0",
+    "@types/react-dom": "^19.1.0",
+    "typescript": "^5.8.0"
+  }
 }
diff --git a/src/app/globals.css b/src/app/globals.css
index e69de29..4683bae 100644
--- a/src/app/globals.css
+++ b/src/app/globals.css
@@ -0,0 +1,16 @@
+*,
+*::before,
+*::after {
+  box-sizing: border-box;
+}
+
+html,
+body {
+  margin: 0;
+  padding: 0;
+  min-height: 100%;
+}
+
+body {
+  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
+}
diff --git a/src/app/layout.tsx b/src/app/layout.tsx
index e69de29..0964ec7 100644
--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -0,0 +1,17 @@
+import type { Metadata } from "next";
+import type { ReactNode } from "react";
+
+import "./globals.css";
+
+export const metadata: Metadata = {
+  title: "AI Office",
+  description: "An interactive AI-powered portfolio office.",
+};
+
+export default function RootLayout({ children }: { children: ReactNode }) {
+  return (
+    <html lang="en">
+      <body>{children}</body>
+    </html>
+  );
+}
diff --git a/src/app/loading.tsx b/src/app/loading.tsx
index e69de29..4349ac3 100644
--- a/src/app/loading.tsx
+++ b/src/app/loading.tsx
@@ -0,0 +1,3 @@
+export default function Loading() {
+  return null;
+}
diff --git a/src/app/not-found.tsx b/src/app/not-found.tsx
index e69de29..0004da7 100644
--- a/src/app/not-found.tsx
+++ b/src/app/not-found.tsx
@@ -0,0 +1,14 @@
+export default function NotFound() {
+  return (
+    <main
+      style={{
+        display: "flex",
+        minHeight: "100dvh",
+        alignItems: "center",
+        justifyContent: "center",
+      }}
+    >
+      <p>Page not found.</p>
+    </main>
+  );
+}
diff --git a/src/app/page.tsx b/src/app/page.tsx
index e69de29..79a3652 100644
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -0,0 +1,5 @@
+import { LandingScene } from "@/scenes/LandingScene";
+
+export default function HomePage() {
+  return <LandingScene />;
+}
diff --git a/src/config/colors.ts b/src/config/colors.ts
index e69de29..cb0ff5c 100644
--- a/src/config/colors.ts
+++ b/src/config/colors.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/constants.ts b/src/config/constants.ts
index e69de29..cb0ff5c 100644
--- a/src/config/constants.ts
+++ b/src/config/constants.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/motion.ts b/src/config/motion.ts
index e69de29..cb0ff5c 100644
--- a/src/config/motion.ts
+++ b/src/config/motion.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/routes.ts b/src/config/routes.ts
index e69de29..cb0ff5c 100644
--- a/src/config/routes.ts
+++ b/src/config/routes.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/sounds.ts b/src/config/sounds.ts
index e69de29..cb0ff5c 100644
--- a/src/config/sounds.ts
+++ b/src/config/sounds.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/theme.ts b/src/config/theme.ts
index e69de29..cb0ff5c 100644
--- a/src/config/theme.ts
+++ b/src/config/theme.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/timings.ts b/src/config/timings.ts
index e69de29..cb0ff5c 100644
--- a/src/config/timings.ts
+++ b/src/config/timings.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/config/zIndex.ts b/src/config/zIndex.ts
index e69de29..cb0ff5c 100644
--- a/src/config/zIndex.ts
+++ b/src/config/zIndex.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/constants/events.ts b/src/constants/events.ts
index e69de29..cb0ff5c 100644
--- a/src/constants/events.ts
+++ b/src/constants/events.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/constants/keys.ts b/src/constants/keys.ts
index e69de29..cb0ff5c 100644
--- a/src/constants/keys.ts
+++ b/src/constants/keys.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/engine/managers/AudioManager.ts b/src/engine/managers/AudioManager.ts
index e69de29..58d0778 100644
--- a/src/engine/managers/AudioManager.ts
+++ b/src/engine/managers/AudioManager.ts
@@ -0,0 +1 @@
+export class AudioManager {}
diff --git a/src/engine/managers/AvatarManager.ts b/src/engine/managers/AvatarManager.ts
index e69de29..c1d32b5 100644
--- a/src/engine/managers/AvatarManager.ts
+++ b/src/engine/managers/AvatarManager.ts
@@ -0,0 +1 @@
+export class AvatarManager {}
diff --git a/src/engine/managers/CameraManager.ts b/src/engine/managers/CameraManager.ts
index e69de29..413eb0f 100644
--- a/src/engine/managers/CameraManager.ts
+++ b/src/engine/managers/CameraManager.ts
@@ -0,0 +1 @@
+export class CameraManager {}
diff --git a/src/engine/managers/SceneManager.ts b/src/engine/managers/SceneManager.ts
index e69de29..86fc38d 100644
--- a/src/engine/managers/SceneManager.ts
+++ b/src/engine/managers/SceneManager.ts
@@ -0,0 +1 @@
+export class SceneManager {}
diff --git a/src/hooks/useAudio.ts b/src/hooks/useAudio.ts
index e69de29..cb0ff5c 100644
--- a/src/hooks/useAudio.ts
+++ b/src/hooks/useAudio.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/hooks/useAvatar.ts b/src/hooks/useAvatar.ts
index e69de29..cb0ff5c 100644
--- a/src/hooks/useAvatar.ts
+++ b/src/hooks/useAvatar.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/hooks/useChat.ts b/src/hooks/useChat.ts
index e69de29..cb0ff5c 100644
--- a/src/hooks/useChat.ts
+++ b/src/hooks/useChat.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/hooks/useOffice.ts b/src/hooks/useOffice.ts
index e69de29..cb0ff5c 100644
--- a/src/hooks/useOffice.ts
+++ b/src/hooks/useOffice.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/hooks/useScene.ts b/src/hooks/useScene.ts
index e69de29..cb0ff5c 100644
--- a/src/hooks/useScene.ts
+++ b/src/hooks/useScene.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/scenes/ConversationScene/index.tsx b/src/scenes/ConversationScene/index.tsx
index e69de29..cb0ff5c 100644
--- a/src/scenes/ConversationScene/index.tsx
+++ b/src/scenes/ConversationScene/index.tsx
@@ -0,0 +1 @@
+export {};
diff --git a/src/scenes/LandingScene/index.tsx b/src/scenes/LandingScene/index.tsx
index e69de29..2a260ee 100644
--- a/src/scenes/LandingScene/index.tsx
+++ b/src/scenes/LandingScene/index.tsx
@@ -0,0 +1,32 @@
+import {
+  Background,
+  LandingLayout,
+  ProfileCard,
+  SmartDoor,
+  VisitorPanel,
+} from "@/features/landing/components";
+
+export function LandingScene() {
+  return (
+    <LandingLayout>
+      <Background />
+      <div
+        style={{
+          position: "relative",
+          zIndex: 1,
+          display: "flex",
+          flexWrap: "wrap",
+          alignItems: "center",
+          justifyContent: "center",
+          gap: "2rem",
+          minHeight: "100dvh",
+          padding: "2rem",
+        }}
+      >
+        <ProfileCard />
+        <SmartDoor />
+        <VisitorPanel />
+      </div>
+    </LandingLayout>
+  );
+}
diff --git a/src/scenes/LoaderScene/index.tsx b/src/scenes/LoaderScene/index.tsx
index e69de29..cb0ff5c 100644
--- a/src/scenes/LoaderScene/index.tsx
+++ b/src/scenes/LoaderScene/index.tsx
@@ -0,0 +1 @@
+export {};
diff --git a/src/scenes/OfficeScene/index.tsx b/src/scenes/OfficeScene/index.tsx
index e69de29..cb0ff5c 100644
--- a/src/scenes/OfficeScene/index.tsx
+++ b/src/scenes/OfficeScene/index.tsx
@@ -0,0 +1 @@
+export {};
diff --git a/src/scenes/TransitionScene/index.tsx b/src/scenes/TransitionScene/index.tsx
index e69de29..cb0ff5c 100644
--- a/src/scenes/TransitionScene/index.tsx
+++ b/src/scenes/TransitionScene/index.tsx
@@ -0,0 +1 @@
+export {};
diff --git a/src/stores/app.store.ts b/src/stores/app.store.ts
index e69de29..cb0ff5c 100644
--- a/src/stores/app.store.ts
+++ b/src/stores/app.store.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/stores/avatar.store.ts b/src/stores/avatar.store.ts
index e69de29..cb0ff5c 100644
--- a/src/stores/avatar.store.ts
+++ b/src/stores/avatar.store.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/stores/chat.store.ts b/src/stores/chat.store.ts
index e69de29..cb0ff5c 100644
--- a/src/stores/chat.store.ts
+++ b/src/stores/chat.store.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/stores/office.store.ts b/src/stores/office.store.ts
index e69de29..cb0ff5c 100644
--- a/src/stores/office.store.ts
+++ b/src/stores/office.store.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/stores/settings.store.ts b/src/stores/settings.store.ts
index e69de29..cb0ff5c 100644
--- a/src/stores/settings.store.ts
+++ b/src/stores/settings.store.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/types/api.ts b/src/types/api.ts
index e69de29..cb0ff5c 100644
--- a/src/types/api.ts
+++ b/src/types/api.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/types/avatar.ts b/src/types/avatar.ts
index e69de29..cb0ff5c 100644
--- a/src/types/avatar.ts
+++ b/src/types/avatar.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/types/chat.ts b/src/types/chat.ts
index e69de29..cb0ff5c 100644
--- a/src/types/chat.ts
+++ b/src/types/chat.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/types/common.ts b/src/types/common.ts
index e69de29..cb0ff5c 100644
--- a/src/types/common.ts
+++ b/src/types/common.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/types/office.ts b/src/types/office.ts
index e69de29..cb0ff5c 100644
--- a/src/types/office.ts
+++ b/src/types/office.ts
@@ -0,0 +1 @@
+export {};
diff --git a/src/types/scene.ts b/src/types/scene.ts
index e69de29..cb0ff5c 100644
--- a/src/types/scene.ts
+++ b/src/types/scene.ts
@@ -0,0 +1 @@
+export {};
diff --git a/tsconfig.json b/tsconfig.json
index 48aa47a..e7e24c3 100644
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -1,7 +1,11 @@
 {
   "compilerOptions": {
     "target": "ES2022",
-    "lib": ["dom", "dom.iterable", "esnext"],
+    "lib": [
+      "dom",
+      "dom.iterable",
+      "esnext"
+    ],
     "module": "esnext",
     "moduleResolution": "bundler",
     "jsx": "preserve",
@@ -12,9 +16,24 @@
     "isolatedModules": true,
     "baseUrl": ".",
     "paths": {
-      "@/*": ["./src/*"]
-    }
+      "@/*": [
+        "./src/*"
+      ]
+    },
+    "allowJs": true,
+    "noEmit": true,
+    "incremental": true,
+    "plugins": [
+      {
+        "name": "next"
+      }
+    ]
   },
-  "include": ["src"],
-  "exclude": ["node_modules"]
+  "include": [
+    "src",
+    ".next/types/**/*.ts"
+  ],
+  "exclude": [
+    "node_modules"
+  ]
 }
