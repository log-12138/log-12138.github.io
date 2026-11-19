import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // public/ is served from the site root: /imgs, /assets, /<pdf>
  eleventyConfig.addPassthroughCopy({ "public": "/" });

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
