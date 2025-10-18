import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { createServer } from "./server"; // expressPluginは無効のまま

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ↓ この行を元に戻します（これが無いと client/index.html を見つけられません）
  root: "client",

  server: {
    host: true,
    port: 8080,
  },
  build: {
    // ↓ root: "client" に合わせ、パスを ".." に戻します
    outDir: "../dist/spa",
  },
  plugins: [react()], // expressPluginは無効のまま
  resolve: {
    // ↓ この設定で `@` が `client` フォルダを指します（あなたのApp.tsxのimportと一致）
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

/* // expressPlugin 関数も無効のまま
function expressPlugin(): Plugin {
  // ...
}
*/