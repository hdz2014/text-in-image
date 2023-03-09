import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { babel } from "@rollup/plugin-babel";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "file",
  },
  plugins: [
    babel({
      exclude: "**/node_modules/**",
      babelHelpers: "runtime",
    }),
    resolve(),
    typescript(),
  ],
  sourcemap: true,
};
