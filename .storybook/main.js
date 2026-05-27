module.exports = {
  stories: [
    "../apps/web/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../apps/web/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  }
};
