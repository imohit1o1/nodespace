import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-toggle";
export default function Home() {
  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
      <h1 className="text-xl">SyncFusion</h1>
      <div className="flex gap-4">
        <ThemeModeToggle />
        <Button className="">Login</Button>
      </div>
    </div>
  );
}
