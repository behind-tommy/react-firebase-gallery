module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-unused-vars": "off", // Disable unused variable warnings
    "object-curly-spacing": "off", // Disable spacing rules in object literals
    "quotes": "off", // Allow any type of quote for strings
    "no-trailing-spaces": "off", // Disable trailing space warnings
    "no-undef": "off", // Disable undefined variable checks
    "indent": "off", // Turn off indentation rules
    "quote-props": "off", // Disable required consistency in object property quotes
    "comma-dangle": "off", // Disable required or forbidden trailing commas
    "max-len": "off", // Disable maximum line length restriction
    "newline-per-chained-call": "off", // Disable newline requirement for chained calls
    "eol-last": "off" // Disable requirement for newline at the end of the file
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
