const path = require("path");
const prettier = require("prettier/parser-postcss");
const { createSyncFn } = require("sync-threads");

const preprocess = (text, options) => {
  const sorter = createSyncFn(
    path.join(__dirname, "sorter.js"),
    2 * 1024 * 1024
  );

  return sorter({
    text,
    parser: options.parser,
    pluginOptions: {
      order: options.order,
      keepOverrides: options.keepOverrides,
    },
  });
};

module.exports = {
  options: {
    order: {
      type: "choice",
      description: "One of the built-in sort orders.",
      category: "@yoy20/css-sorter",
      default: "cmexpro",
      choices: [
        {
          value: "cmexpro",
          description:
            "Order by cmexpro rules",
        },
        {
          value: "alphabetical",
          description:
            "Order in a simple alphabetical manner from a - z.",
        },
        {
          value: "smacss",
          description:
            "Order from most important, flow affecting properties, to least important properties.",
        },
        {
          value: "concentric-css",
          description:
            "Order properties applying outside the box model, moving inward to intrinsic changes.",
        },
      ],
    },
    keepOverrides: {
      type: "boolean",
      description: "",
      category: "@yoy20/css-sorter",
      default: true,
    },
  },
  parsers: {
    css: {
      ...prettier.parsers.css,
      preprocess,
    },
    less: {
      ...prettier.parsers.less,
      preprocess,
    },
    scss: {
      ...prettier.parsers.scss,
      preprocess,
    },
  },
};
