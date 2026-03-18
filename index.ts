import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import { useData } from "vitepress";
import "./style.css";
import Spoiler from "./spoiler.vue"; 
import type { Theme } from "vitepress";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "doc-before": () => {
        const { frontmatter } = useData();

        if (frontmatter.value.title) {
          return h("div", { class: "bf_headline" }, frontmatter.value.title);
        }
      },
    });
  },

  enhanceApp({ app }) {
    app.component("spoiler", Spoiler);
  },
} satisfies Theme;