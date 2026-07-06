import { AssetPreloader } from "@/components/ui/AssetPreloader/AssetPreloader";
import { SceneManager } from "@/scenes/SceneManager";

export default function HomePage() {
  return (
    <AssetPreloader>
      <SceneManager />
    </AssetPreloader>
  );
}
