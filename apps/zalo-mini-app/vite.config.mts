import { defineConfig } from "vite";
import { resolve } from "path";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [zaloMiniApp(), react()],
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
    },
  });
};
