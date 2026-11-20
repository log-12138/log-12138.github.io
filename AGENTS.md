# AGENTS.md — 罗子成作品集（Eleventy）

> 项目交底书。任何 AI 或人接手前先读这一页，不用再问一遍。

---

## 1. 这是什么

罗子成（东南大学建筑学院）的**个人作品集网站**，2026 年求职用。中文为主 + 英文小标签，黑白水墨纸感，11 个页面。

- 线上：<https://log-12138.github.io/>
- 仓库：<https://github.com/log-12138/log-12138.github.io>
- 本地：`F:\design\eleventy`

## 2. 事实清单（唯一可信来源）

内容只来自这三份材料，**不得编造**：

| 材料 | 位置 | 提供什么 |
|---|---|---|
| 作品集 PDF（23 页） | `F:\design\东南大学罗子成作品集30.pdf` | 4 个项目、图、设计说明原文 |
| 简历 PDF | `F:\design\东南大学罗子成简历.pdf` | 基础信息、校内工作、荣誉 |
| 郑格如奖学金答辩 PPT | `E:\个人资料\01123324 罗子成 建筑学院郑格如奖学金答辩ppt.pdf` | 经历细节、志愿时长、竞赛 |

**项目元信息（不要改，改前先问）**：设计说明全部节选自作品集原文，只做断句整理，不改写、不添加成就。

## 3. 命令

```bash
pnpm install          # 装依赖（pnpm 10+，Node 22）
pnpm run serve        # 预览 http://localhost:8080/ ，改文件自动刷新
pnpm run build        # 输出 _site/
```

> 这台机器的 pnpm/node 在 DSH 运行时目录里，不在 PATH。用完整路径：
> `C:\Users\dell\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe`
> `C:\Users\dell\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs`

## 4. 目录地图：改什么去哪

```
public/                  → 原样拷贝到站点根
  imgs/                  → 44 张项目图（p01-*, p02-*, ..., hero-mountain, portrait, bg-wash）
  imgs/exp/              → 15 张经历照片（vol-*, stu-*, prac-*, work-*）
  imgs/certs/            → 18 张证书扫描件（c01–c18）
  assets/site.css        → 全部样式（单文件，无预处理器）
  assets/site.js         → 灯箱（图片放大、左右键翻页、去重）
  *.pdf                  → 作品集 / 简历

src/
  index.njk              → 首页封面（大图 + 五个入口）
  about.md               → 01 关于
  works.md               → 02 作品列表（5 张卡片）
  projects/*.md          → 02.1–02.4 项目单页（真 markdown + 前置字段）
  other.md               → 02.5 其他作品
  experience.md          → 03 校内经历（8 条 + 照片弹层）
  awards.md              → 04 荣誉（列表 + 底部证书滚动条）
  contact.md             → 05 联系
  _includes/layouts/     → base.njk（外壳）、project.njk（项目页）、tool.njk（工作台）
  _includes/partials/    → bar / pager / lightbox / experience-modal
  _data/archive.json     → 案例工作台的图纸档案数据
  archive.njk            → /archive/ 案例工作台（筛选 + 横向比较）

.github/workflows/deploy.yml → push 即构建并发布
```

**改内容的三种情况**：
- 改项目文字 → `src/projects/*.md` 的正文
- 改项目元信息/图库 → 同文件 `---` 之间的前置字段
- 加一个新项目 → 复制一个 `.md`，改 `title/hero/gallery`，再在 `works.md` 和 `index.njk` 里加入口

## 5. 内容规约（硬约束）

1. **不编造**：经历、数字、奖项、时间一律来自第 2 节材料。要补内容先问本人。
2. **md 正文里的 HTML 必须顶格**。缩进 4 格会被 markdown-it 当段落包进 `<p>`，栅格会散（踩过）。
3. **图片路径一律 `/imgs/...` 绝对路径**。站点挂在根域名所以安全；如果以后改成项目仓库（子路径），要全局改。
4. **`.md` 里不要写 `<script>`**：交互脚本放 `_includes/partials/`。
5. 证书原件里横躺的图片，入库前必须转正（曾修过 c01/c04/c05/c06/c08）。
6. 样式集中在 `site.css`，不要在 md 里写内联样式（历史遗留两处 `style=` 除外）。

## 6. 部署

`git push` 到 `main` → GitHub Actions 自动 `pnpm install --frozen-lockfile && pnpm run build` → 发布 `_site` 到 Pages。

⚠️ **Pages 的 Source 必须设成 "GitHub Actions"**（Settings → Pages）。设成 "Deploy from a branch" 的话，GitHub 会拿仓库根目录跑 Jekyll，把 README 渲染成首页——首页会变成一张卡片，CSS/图片全 404（踩过）。

## 7. 已知陷阱

| 症状 | 原因 | 处理 |
|---|---|---|
| 页面栅格散开、多出空白 | md 里 HTML 有缩进，被包进 `<p>` | 正文 HTML 顶格 |
| 图片全部 404 | 用了相对路径，或页面在 `/xxx/` 子路径 | 改 `/imgs/...` |
| 灯箱点不开 | 该页没有 `lightbox: true` 前置字段 | 补字段 |
| 证书带里点副本没反应 | 灯箱触发器要按 `data-full` 去重 | `site.js` 已处理 |
| 首页变成 README 卡片 | Pages Source 设成了 branch | 改成 GitHub Actions |

## 8. 悬而未决（等本人确认，别自行决定）

1. **学历**：站点写"大三本科"，答辩材料（2026/10）说已大四、GPA 3.92
2. **政治面貌**：站点写"预备党员"，答辩说 2026 年 5 月已转正
3. **志愿时长**：简历 270+ 小时，答辩 265 小时
4. **星筑黔途**：简历措辞"优秀团队·优秀个人"，答辩说"团队一等奖"
5. **是否重设计**：原样样式已跑通，重设计方向未定

## 9. 设计取向（改版时参考）

- 配色：中性黑白纸（纸 `#f5f5f3` / 墨 `#141414`），无强调色，靠字重和灰度分层
- 字体：标题 Noto Serif SC 700，正文 Noto Sans SC 400，拉丁小字 Georgia 斜体，编号 Consolas
- 背景：水彩墨晕 `bg-wash.jpg`（32% 提亮）+ 88px 制图网格 + 纸纹噪声，全部 fixed
- 强调块：`.about-grid / .proj-body / .desc-block` 是"浮起纸片"面板（近白底 + 极淡投影 + 左上赭石角标）

## 10. 案例品味库（课程作业 02）

工作台在 **`/archive/`**，数据在 `src/_data/archive.json`，图纸放 `public/archive/`。

**图纸不是收藏，是提炼标准的原料。** 每看一张，把"我看到了什么"写成判断，沉淀到这里——往后做设计时，这些判断就是你的标准。

### 已沉淀的判断

> （还没开始。看完第一张后，在这一行下面写第一句。）

- 待填 · 例：*我更在意「结构是否被看见」，而不是平面是否高效。*

### 归档清单

| 建筑师 | 建筑 | 年份 | 出处 | 一句话判断 |
|---|---|---|---|---|
| — | — | — | — | — |

