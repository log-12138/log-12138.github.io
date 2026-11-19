# 罗子成 · 2026 作品集（Eleventy）

从 `F:\design` 下的静态站点迁移而来。**样式、文字、图片与迁移前逐页一致**（已用脚本逐页比过可见文字与图片集合）。

## 目录

```
eleventy/
├─ eleventy.config.js      # public/ → 站点根；src/ → _site/
├─ package.json
├─ public/                 # 原样拷贝到输出根
│  ├─ imgs/                # 44 张项目/封面图
│  │  ├─ exp/              # 15 张经历照片
│  │  └─ certs/            # 18 张证书扫描件
│  ├─ assets/site.css|js   # 样式与灯箱脚本
│  └─ *.pdf                # 作品集 / 简历
└─ src/
   ├─ index.njk            # 首页（封面 + 五个入口）
   ├─ about.md             # 01 关于
   ├─ works.md             # 02 作品列表
   ├─ projects/            # 02.1–02.4 单页
   │  ├─ shack.md          #   棚屋
   │  ├─ slope.md          #   坡地建筑
   │  ├─ literature-hall.md#   南京文学客厅扩建
   │  └─ youth-complex.md  #   青河众创综合体
   ├─ other.md             # 02.5 其他作品
   ├─ experience.md        # 03 校内经历
   ├─ awards.md            # 04 荣誉与证书
   ├─ contact.md           # 05 联系
   └─ _includes/
      ├─ layouts/base.njk   # 页头/导航/翻页/页脚
      ├─ layouts/project.njk# 项目页：大图 + 正文 + 元信息 + 图库
      └─ partials/          # bar / pager / lightbox / experience-modal
```

## 命令

```bash
pnpm install
pnpm run serve     # 预览 http://localhost:8080/
pnpm run build     # 输出到 _site/
```

## 内容怎么改

- **项目文字**：`src/projects/*.md` 的正文（markdown），前置字段里是标题、英文名、元信息、图库清单。
- **图库**：`gallery:` 列表，每项 `src` / `cap`（灯箱说明）/ `thumb`（悬停图注）/ `cls`（栅格类，如 `c6 ar-4x3 contain`）。
- **其它页面**：`src/*.md` 正文是原站 HTML 直出，`title`/`en`/`num`/`prev`/`next` 在前置字段里。
- **图片**：放进 `public/imgs/`，引用写 `/imgs/xxx.jpg`。

## 注意

- 正文里的 HTML 必须顶格（不要缩进），否则 markdown-it 会把它当段落包进 `<p>`，栅格会散。
- URL 是 `/about/` 这种带斜杠的目录形式，不是原来的 `about.html`。
