import DefaultTheme from "vitepress/theme";
import { h, onMounted, watch, nextTick } from "vue";
import { useData, useRoute } from "vitepress";
import "./style.css";
import type { Theme } from "vitepress";

export default {
  extends: DefaultTheme,

  // 扩展布局
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "doc-before": () => {
        const { frontmatter } = useData();
        if (frontmatter.value.title) {
          // 使用你之前定义的渐变标题样式
          return h("div", { class: "bf_headline" }, frontmatter.value.title);
        }
      },
    });
  },

  // 在这里注入全局逻辑
  enhanceApp({ app, router }) {
    // 逻辑已迁移至 setup 处理，以确保在路由切换时能响应式地重新初始化列表
  },

  // 我们利用 setup 钩子来处理页面加载和路由监听
  setup() {
    const route = useRoute();

    onMounted(() => {
      /**
       * 初始化列表折叠逻辑
       * 寻找含有子列表的 li，添加交互类和点击事件
       */
      const initLists = () => {
        nextTick(() => {
          // 获取文档区域内的所有列表项
          const listItems = document.querySelectorAll(".vp-doc li");

          listItems.forEach((el) => {
            // 将 Element 转换为 HTMLElement 以解决 TypeScript 属性不存在的问题 (image_51349e.png)
            const li = el as HTMLElement;

            // 检查该项是否直接包含子列表 (ul 或 ol)
            const childList = li.querySelector(":scope > ul, :scope > ol");

            if (childList) {
              li.classList.add("has-children");

              // 检查是否已经初始化过，避免重复绑定事件
              if (li.dataset.collapseInit === "true") return;
              li.dataset.collapseInit = "true";

              // 绑定点击处理：仅当点击位置在父项本身而非子列表中时触发折叠
              li.addEventListener("click", (e) => {
                // 如果点击发生在子列表内，不触发父级的折叠
                if (childList.contains(e.target as Node)) {
                  return;
                }

                // 切换折叠状态
                li.classList.toggle("collapsed");
                // 阻止事件向父级列表项冒泡
                e.stopPropagation();
              });
            }
          });
        });
      };

      // 首次加载时运行
      initLists();

      // 监听路由路径变化，当跳转到新页面时重新运行初始化逻辑
      watch(
        () => route.path,
        () => {
          initLists();
        },
      );
    });
  },
} satisfies Theme;
