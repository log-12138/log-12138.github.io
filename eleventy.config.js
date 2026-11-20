import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // public/ is served from the site root: /imgs, /assets, /<pdf>
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  // 数据转 JSON，供页面内嵌给前端脚本用
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  eleventyConfig.setServerOptions({
    port: 8080,
    showAllHosts: false,
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
