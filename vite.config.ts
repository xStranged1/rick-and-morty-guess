import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  base: "https://xstranged1.github.io/rick-and-morty-guess",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})