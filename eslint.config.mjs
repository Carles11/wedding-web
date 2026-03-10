import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Import plugin and custom rules here
  {
    plugins: {
      import: require("eslint-plugin-import"),
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node/JS builtins (fs, path, etc)
            "external", // Third-party (react, next, etc)
            "internal", // Your aliases (@/4-shared, etc)
            ["parent", "sibling", "index"], // Relative
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // ... add more ESLint rules as needed ...
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
