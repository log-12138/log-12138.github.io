# 作业 01 · Git 回溯练习（在本仓库上，不碰线上）

> 目的是让你**看懂**，不是背命令。每一步都有输出，看完就懂了。
> 全程在 `practice/back-in-time` 分支上做，**main 分支和线上网站完全不受影响**。

---

## 0. 先看现在的"时间线"

```powershell
cd F:\design\eleventy
git log --oneline --graph --decorate
```

你会看到三个提交，从上到下就是"现在 → 过去"：

```
* e71f89c (HEAD -> main) docs: 添加 AGENTS.md 项目交底书
* 7e9f312 (origin/main) ci: 添加 GitHub Pages 自动构建与发布工作流
* fc0ef77 初始化：Eleventy 版作品集（由静态站点迁移，样式与内容保持一致）
```

- **HEAD** = 时间线末端 = 现在。你在哪，它指向哪。
- **origin/main** = 远端（GitHub）走到哪儿了。
- 每个 `fc0ef77` 这样的七位码是一版快照的**身份证**，回溯靠它，不靠文件名。

---

## 1. 开一条平行宇宙

```powershell
git switch -c practice/back-in-time
```

现在你在一条新分支上。**在这里怎么改都不影响 main**，线上更不会动。

---

## 2. 拍两下快门

```powershell
# 第一版
"第一版：我想试试回溯" | Out-File practice.txt -Encoding utf8
git add practice.txt
git commit -m "practice: 第一版"

# 第二版：改一行再存一版
"第二版：改了一句话" | Out-File practice.txt -Encoding utf8
git commit -am "practice: 第二版"
```

⚠️ 第二版用的是 `commit -am`——`-a` 会把**已经跟踪过**的文件的修改自动加入暂存区。第一次新增文件还是得 `git add`。

---

## 3. 看时间线变成了什么

```powershell
git log --oneline
```

```
xxxxxxx practice: 第二版      ← HEAD
xxxxxxx practice: 第一版
e71f89c docs: 添加 AGENTS.md 项目交底书
7e9f312 ci: ...
fc0ef77 初始化：...
```

---

## 4. 回溯：看回过去（只读，不改任何东西）

**看某一版长什么样**：

```powershell
git show HEAD~1:practice.txt     # 上一版里这个文件的内容
git show HEAD~2                  # 上上版整个提交改了什么
```

`HEAD~1` 读作"HEAD 的爸爸"，`HEAD~2` 是"爷爷"。

**看两版之间的差别**：

```powershell
git diff HEAD~1 HEAD -- practice.txt
```

输出里 `-` 开头是**旧版本**，`+` 开头是**新版本**：

```
-第一版：我想试试回溯
+第二版：改了一句话
```

⚠️ **`HEAD~1` 是"上一个提交"，`HEAD~2` 是"上上个"**。这两个数很容易搞错，我第一次演示就写成了 `~2`，结果比出来的是"文件从无到有"。看之前先 `git log --oneline` 数一下自己要的是哪一层。

---

## 5. 回溯：真的把文件拿回过去

这是最有用的一个：**只把某个文件退回旧版本**，别的文件不动。

```powershell
git checkout HEAD~1 -- practice.txt
Get-Content practice.txt          # 变成了"第一版"
git status                        # M practice.txt（已暂存）
```

注意两点：

1. 这一步**没有产生新提交**，只是把文件换成了旧样子。
2. 它同时改了**工作区和暂存区**（所以 `status` 显示 `M ` 而不是 ` M`）。

改得不对，随时撤销：

```powershell
git restore --source=HEAD --staged --worktree practice.txt
```

普通的 `git restore practice.txt` **不够**——它只从暂存区恢复，而暂存区已经被你改成旧版了，所以文件不会变回去。要加 `--source=HEAD --staged --worktree` 三件套才彻底。

---

## 6. 回到主线，扔掉这条分支

```powershell
git switch main
git branch -D practice/back-in-time
git status                        # 应该干干净净
```

`-D` 是强制删（这条分支的提交没合并，普通 `-d` 不让删）。**废了就扔**——这就是分支的意义：放肆试，主线永远安全。

---

## 7. 三种"回到过去"，别搞混

| 命令 | 干什么 | 会改历史吗 | 什么时候用 |
|---|---|---|---|
| `git show <版本>:<文件>` | 只是**看** | 不会 | 想知道三天前那行写了什么 |
| `git checkout <版本> -- <文件>` | 把**某个文件**换回旧样 | 不会（只改工作区） | 某张图/某段文字改坏了，单独捞回来 |
| `git revert <版本>` | 生成一个**反向提交**抵消它 | 会（新增一条记录） | 已经推上去的错误提交，要正式撤回 |
| `git reset --hard <版本>` | 直接把 HEAD 挪回去 | 会（丢掉之后的提交） | 只有本地、确定不要了才用 |

**记一句话**：给别人看过的历史，只用 `revert`，不用 `reset`。

---

## 8. 以后怎么查

```powershell
git log --oneline                 # 我干过哪些事
git log --oneline -- src/projects/shack.md   # 这个文件被谁改过
git show <身份证>                  # 那一版到底改了什么
git diff                          # 我现在还没提交的改动
```
