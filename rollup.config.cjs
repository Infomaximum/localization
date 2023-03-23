const typescript = require("@rollup/plugin-typescript");

const config = [
  {
    input: "lib/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.esm.js",
        format: "es",
      },
    ],
    plugins: [typescript()],
  },
];

module.exports = config;
