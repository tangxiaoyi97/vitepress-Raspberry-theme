import DefaultTheme from "vitepress/theme";
import { h, onMounted, nextTick, watch } from "vue";
import { useData, useRoute } from "vitepress";
import "./style.css";
import type { Theme } from "vitepress";

export default {
  extends: DefaultTheme,

  Layout: () => {
    const { frontmatter } = useData();
    const route = useRoute();

    const initListFolding = () => {
      if (typeof window === "undefined") return;

      const listItems = document.querySelectorAll(".vp-doc li");

      listItems.forEach((li) => {
        const nestedList = li.querySelector("ul, ol");

        if (nestedList && !li.classList.contains("has-nested-list")) {
          li.classList.add("has-nested-list");

          const toggler = document.createElement("span");
          toggler.className = "list-toggler";

          toggler.addEventListener("click", (e) => {
            e.stopPropagation();
            li.classList.toggle("collapsed");
          });

          li.prepend(toggler);
        }
      });
    };

    onMounted(() => {
      initListFolding();
    });

    // 2. 路由(页面)切换时重新初始化
    watch(
      () => route.path,
      () => {
        nextTick(() => {
          initListFolding();
        });
      },
    );

    return h(DefaultTheme.Layout, null, {
      "doc-before": () => {
        if (frontmatter.value.title) {
          return h("div", { class: "bf_headline" }, frontmatter.value.title);
        }
      },
    });
  },

  enhanceApp({ app }) {},
} satisfies Theme;
