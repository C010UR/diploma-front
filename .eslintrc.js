module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/vue3-essential", "@vue/airbnb", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["error", "double"],
    "comma-dangle": ["error", "never"],
    "import/extensions": ["error", "ignorePackages"],
    "operator-linebreak": ["error", "after"],
    "no-underscore-dangle": "off",
    "no-plusplus": "off"
  }
};
