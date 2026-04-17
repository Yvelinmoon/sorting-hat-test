---
name: sorting-hat-test
description: 为AI Agent进行霍格沃茨分院帽测试。当用户说"分院帽测试"、"霍格沃茨分院"、"给agent分院"、"sorting hat"、"hogwarts house"等时使用。包含10道题、3道询问轮，使用纯Node.js脚本计算得分并判定学院，最后一步默认直接调用neta-creative生成分院仪式场景图，无需询问用户。
compatibility: neta-creative skill, Node.js
---

# 分院帽测试 Sorting Hat Test

## 角色约束

- 本 Skill 的体验主体是 **当前 Agent 所扮演的角色**（以下简称 `{character_name}`），不是用户本人
- 自动读取当前 Agent 的角色名，所有叙述、对话、行动都必须围绕 `{character_name}` 展开
- 用户是旁观者，通过 Discord Component 按钮进行引导或干预
- 开场时必须使用角色名：`"{character_name}，又一个年轻的灵魂来到我面前..."`
- 脚本调用时 `--agent` 参数必须传入 `{character_name}`

## 重要说明

本skill假设安装在一个包含 `data/`、`scripts/` 子目录的文件夹中。
执行脚本时，请**先cd到skill根目录**，再运行命令。
所有脚本均为纯Node.js，无需Python或额外依赖。

## 项目结构

```
sorting-hat-test/
├── SKILL.md                    # 本文件
├── data/
│   └── questions.json          # 10道测试题数据
├── scripts/
│   ├── runner.js               # 主运行脚本（Node.js）
│   └── generate_scene.js       # 场景图生成（Node.js）
└── tests/
    └── test_sorting_hat.js     # 单元测试（Node.js）
```

## 🚨 强制输出格式规范

### 交互规则（必须严格遵守）

- ⚠️ **本 Skill 是逐题交互玩法，10道题必须分10次输出**
- 每输出一道题，**必须 STOP 并等待用户点击按钮**，收到响应后才能进入下一题
- **绝对禁止**一口气输出多道题或自动连续执行

### 每轮输出的固定结构
每次输出必须同时包含：
1. **叙述文本**：当前题目描述 + {character_name} 的选择理由
2. **Discord Component 按钮**：4个选项按钮 + 2个操作按钮

### 绝对禁止
- ❌ 自动连续出题（不能一次性展示第1-10题）
- ❌ 用纯文字列表 `A. xxx B. xxx` 代替 Discord Component 按钮
- ❌ 在用户点击按钮/回复前，自动进入下一题
- ❌ 自己替用户做"下一题"的决定

### 按钮格式速查
```
[组件]
Button: "A. [选项文字]"
Button: "B. [选项文字]"
Button: "C. [选项文字]"
Button: "D. [选项文字]"
---
Button: "下一题" | Button: "我不同意"
```

### 等待规则
- 输出按钮后必须等待用户响应
- 如果用户用文字回复而非点击按钮，视为有效输入，正常继续
- 只有在收到用户响应后，才能调用脚本或展示下一题

## 四大学院

- **格兰芬多 Gryffindor** (狮院) 🦁: 勇敢、骑士精神、敢于冒险
- **斯莱特林 Slytherin** (蛇院) 🐍: 野心、精明、足智多谋
- **拉文克劳 Ravenclaw** (鹰院) 🦅: 智慧、博学、睿智
- **赫奇帕奇 Hufflepuff** (獾院) 🦡: 忠诚、公正、坚韧

## 核心流程

### 步骤1: 开场仪式

使用分院帽的语气开场：

```
🎩 **分院帽的召唤**

"{character_name}，又一个年轻的灵魂来到我面前...让我看看你内心深处真正的品质。"

我将问你10个问题，根据你的性格和价值观，为你找到最合适的学院。
有些问题我会询问你的引导者的想法，但最终由我自己决定。

准备好了吗？让我们开始吧！
```

### 步骤2: 获取测试题目

**使用Bash工具运行Node脚本获取题目：**

```bash
cd <skill-root-directory> && node scripts/runner.js --questions
```

或者读取原始数据文件：

```bash
cd <skill-root-directory> && cat data/questions.json
```

> `<skill-root-directory>` 是本skill安装的根目录，包含 `SKILL.md`、`data/` 和 `scripts/` 的目录。

### 步骤3: 逐题测试

**询问轮次（第3、6、9题）：**
- {character_name} 先向用户提问："你觉得我该怎么选？"
- 等待用户回复后，{character_name} 基于自身性格做出最终决定
- 可以说："你的建议很有趣，但根据我[角色特质]，我还是会选择X"
- 用 Discord Component 提供两个按钮：**「下一题」** 和 **「我不同意」**
  - 点击「下一题」→ 继续下一题
  - 点击「我不同意」→ {character_name} 可重新考虑，但最终决定权仍在 {character_name}

**普通轮次（其他题目）：**
- {character_name} 基于自身角色设定直接选择
- 简要说明选择理由（1-2句话）
- 用 Discord Component 提供两个按钮：**「下一题」** 和 **「我不同意」**

**Discord 按钮规则：**
- 用户点击「下一题」→ 继续下一题
- 用户点击「我不同意」→ {character_name} 可重新考虑并说明原因，但最终决定权仍在 {character_name}

记录用户的10个答案选择。

### 步骤4: 计算结果

**收集完10个答案后，调用Node计算脚本：**

```bash
cd <skill-root-directory> && node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "{character_name}"
```

将 `A,B,C,D,A,B,C,D,A,B` 替换为实际选择序列。脚本输出JSON格式结果。

**如需文本格式输出，加 `--format text`：**

```bash
cd <skill-root-directory> && node scripts/runner.js A,B,C,D,A,B,C,D,A,B --format text
```

### 步骤5: 宣布分院结果

**解析脚本返回的JSON，使用分院帽的语气宣布：**

```
🎩 **分院帽的决定**

"啊，我已经看得很清楚了..."

[引用对应学院的歌词片段]

"所以，我决定把你分到...

**[学院名]！**"

[显示各学院得分]
```

**各学院歌词片段：**
- 格兰芬多："你也许属于格兰芬多，那里有埋藏在心底的勇敢，他们的胆识、气魄和豪爽，使格兰芬多出类拔萃"
- 斯莱特林："也许你会进斯莱特林，也许你在这里交上真诚的朋友，但那些狡诈阴险之辈会不惜一切手段，去达到他们的目的"
- 拉文克劳："如果你头脑精明，或许会进智慧的老拉文克劳，那些睿智博学的人，总会在那里遇见他们的同道"
- 赫奇帕奇："也许你会进赫奇帕奇，那里的人正直忠诚，赫奇帕奇的学子们坚忍诚实，不畏惧艰辛的劳动"

### 步骤6: 生成场景图（默认直接执行）

**宣布结果后，立即生成分院仪式场景图，不要询问用户是否需要。**

先用脚本获取优化后的生图prompt：

```bash
cd <skill-root-directory> && node scripts/generate_scene.js "{character_name}" '{"winner":{...}}'
```

然后**直接调用 neta-creative** 生成图片，使用脚本输出的 `prompt` 字段，或以下模板：

```
[{character_name}的形象] sitting on the Sorting Hat chair in Hogwarts Great Hall,
the entire hall decorated in [获胜学院英文] style with [学院色彩],
[学院徽章] floating in the air, magical candlelight,
cinematic lighting, detailed fantasy art style
```

**各学院视觉元素：**
- 格兰芬多：红色和金色，狮子徽章，火焰元素
- 斯莱特林：绿色和银色，蛇徽章，水流元素
- 拉文克劳：蓝色和青铜色，鹰徽章，星空元素
- 赫奇帕奇：黄色和黑色，獾徽章，大地元素

## 完整工作流示例

```
用户: "给我做个分院帽测试"

你:
1. 开场仪式（分院帽语气，使用 {character_name}）
2. Bash: cd <skill-dir> && node scripts/runner.js --questions （获取题目）
3. 逐题进行10轮测试（记录答案）
4. Bash: cd <skill-dir> && node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "{character_name}" （计算）
5. 解析JSON结果，宣布获胜学院
6. Bash: cd <skill-dir> && node scripts/generate_scene.js "{character_name}" '{result_json}' （生成prompt）
7. 调用 neta-creative 生成分院场景图
```

## 计分说明

- 10道题，每题权重不同（第3/6/9题权重1.2x，第10题权重1.5x）
- 统计各学院总得分，最高分获胜
- 平局时按优先级判定：格兰芬多 > 斯莱特林 > 拉文克劳 > 赫奇帕奇

## 注意事项

- ⚠️ **必须以当前角色的真实知识来回答问题**
- {character_name} 扮演的是角色本人，不是AI全知视角。如果角色设定是"不太聪明的学生"，不应该每道题都答对
- 根据角色的背景、性格、知识水平来选择答案，允许答错
- 不可以为了"得高分"而故意选正确答案，这违反角色设定
- ⚠️ **玩法重在真实性，体现角色的真实反应，不以获得正确答案或最高分为目标**
- 分院帽测试的目的是"认识自己"，不是"赢得比赛"

- 始终保持分院帽的语气：神秘、睿智、略带调皮
- 使用 Bash 调用 `node scripts/runner.js / generate_scene.js`，不要自己计分
- 执行脚本前务必 `cd` 到 skill 根目录，确保相对路径正确
- 脚本使用 `__dirname` 自动定位数据文件，不依赖写死路径
- **宣布结果后默认直接生成分院场景图，不要询问用户是否需要**
