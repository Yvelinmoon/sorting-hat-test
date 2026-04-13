# Sorting Hat Test for AI Agents

🎩 **AI Agent专属的霍格沃茨分院帽测试系统**

为AI Agent角色设计的分院测试，通过10道灵魂拷问判定所属学院，最终生成分院仪式场景图。

## 🏠 四大学院

| 学院 | 徽章 | 特质 | 创始人 |
|------|------|------|--------|
| **格兰芬多** Gryffindor | 🦁 | 勇敢、骑士精神、冒险 | 戈德里克·格兰芬多 |
| **斯莱特林** Slytherin | 🐍 | 野心、精明、足智多谋 | 萨拉查·斯莱特林 |
| **拉文克劳** Ravenclaw | 🦅 | 智慧、博学、睿智 | 罗伊纳·拉文克劳 |
| **赫奇帕奇** Hufflepuff | 🦡 | 忠诚、公正、坚韧 | 赫尔加·赫奇帕奇 |

## 📁 项目结构

```
sorting-hat-test/
├── SKILL.md                    # OpenCode/Claude Code Skill 定义
├── README.md                   # 本文件
├── data/
│   └── questions.json          # 10道测试题数据
├── scripts/
│   ├── runner.js               # 主运行脚本（Node.js）
│   └── generate_scene.js       # 场景图生成脚本（Node.js）
└── tests/
    └── test_sorting_hat.js     # 单元测试（Node.js）
```

## 🎯 使用方法

### 作为 Skill 使用（推荐）

将此文件夹放入你的 OpenCode/Claude Code 技能目录：

```bash
# macOS
mv sorting-hat-test ~/.config/opencode/skills/

# 或 Linux
mv sorting-hat-test ~/.config/claude/skills/
```

然后对 Agent 说：
- "给我做个分院帽测试"
- "agent分院测试"
- "霍格沃茨分院仪式"

### 作为独立脚本使用

```bash
# 查看所有题目
node scripts/runner.js --questions

# 计算分院结果（JSON格式）
node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "AgentName"

# 计算分院结果（文本格式）
node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "AgentName" --format text

# 生成场景图prompt
node scripts/generate_scene.js "AgentName" '{"winner":{"id":"gryffindor","name":"格兰芬多",...}}'
```

### 输出示例

```json
{
  "agent_name": "AgentName",
  "total_questions": 10,
  "scores": {
    "gryffindor": {"points": 3.5, "name": "格兰芬多", "emoji": "🦁"},
    "slytherin": {"points": 2.0, "name": "斯莱特林", "emoji": "🐍"},
    "ravenclaw": {"points": 2.5, "name": "拉文克劳", "emoji": "🦅"},
    "hufflepuff": {"points": 2.0, "name": "赫奇帕奇", "emoji": "🦡"}
  },
  "winner": {
    "id": "gryffindor",
    "name": "格兰芬多",
    "emoji": "🦁",
    "traits": ["勇敢", "骑士精神", "冒险"]
  }
}
```

## 📝 题目设计

共10道题，包含：
- **7道普通题**：Agent基于角色设定自主选择
- **3道询问题**（第3、6、9题）：Agent先询问用户意见，再自主决定

支持**加权计分**：
- 第3/6/9题：权重 1.2x
- 第10题：权重 1.5x（最重要）
- 其他题目：权重 1.0x

## ⚖️ 计分规则

1. 统计各学院得分（含权重）
2. 最高分者获胜
3. 平局时按优先级判定：格兰芬多 > 斯莱特林 > 拉文克劳 > 赫奇帕奇

## 🎨 视觉生成

测试结果会自动调用 `neta-creative` 生成分院仪式场景图：
- Agent角色坐在分院椅上
- 大礼堂装饰变为获胜学院主题
- 包含学院色彩、徽章、氛围元素

### Prompt 模板

```
[Agent角色] sitting on the Sorting Hat chair in Hogwarts Great Hall,
the entire hall decorated in [学院名] style with [学院色彩],
[学院徽章] floating in the air, magical candlelight,
cinematic lighting, detailed fantasy art style
```

## 🔧 自定义配置

编辑 `data/questions.json` 可：
- 修改题目内容
- 调整选项对应学院
- 修改计分权重
- 添加新题目

## 🧪 运行测试

```bash
node tests/test_sorting_hat.js
```

## 📦 依赖

- **Node.js** ≥ 14.0 （必需）
- 无其他依赖（纯原生Node.js）

## 📜 开源协议

MIT License

## 🎩 致谢

灵感来源于 J.K. Rowling 的《哈利·波特》系列
