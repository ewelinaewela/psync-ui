import vinext from "vinext";
import { defineConfig } from "vite";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const mode = process.env.PSYNC_EXERCISE_MODE ?? "demo";
if (!["private", "demo"].includes(mode)) throw new Error("PSYNC_EXERCISE_MODE must be demo or private.");
const exerciseModule = fileURLToPath(new URL(mode === "private"
  ? "./premium-private/exercises/GuidedExercise.tsx"
  : "./app/components/DemoExercise.tsx", import.meta.url));
if (!existsSync(exerciseModule)) throw new Error("Selected exercise module is missing. Private builds require the private source checkout.");

export default defineConfig({
  resolve: { alias: { "@psync/exercise": exerciseModule } },
  plugins: [vinext()],
});
