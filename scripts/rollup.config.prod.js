import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import filesize from 'rollup-plugin-filesize';
import dts from "rollup-plugin-dts";
import { babel } from '@rollup/plugin-babel';

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.umd.js",
                format: "umd",
                name: 'text-in-image',
            },
            {
                file: `dist/index.cjs.js`,
                format: 'cjs',
                name: 'text-in-image',
            },
            {
                file: `dist/index.esm.js`,
                format: 'es',
                name: 'text-in-image',
            }
        ],
        plugins: [
            resolve(),
            typescript(),
            babel({
                exclude: "**/node_modules/**",
                babelHelpers: 'runtime',
            }),
            filesize(),
        ],
    },
    {
        input: "src/index.d.ts",
        output: [
            {
                file: "dist/index.d.ts",
                format: "es",
                name: 'text-in-image',
            },
        ],
        plugins: [
            dts(),
        ],
    }
];