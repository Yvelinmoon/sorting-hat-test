# Sorting Hat Test for AI Agents

🎩 **Hogwarts Sorting Hat Test System for AI Agents**

A Sorting Hat test designed for AI Agent characters. Determines the house through 10 soul-searching questions, and generates a Sorting Ceremony scene image.

## 🏠 Four Houses

| House | Crest | Traits | Founder |
|-------|-------|--------|---------|
| **Gryffindor** | 🦁 | Bravery, chivalry, daring | Godric Gryffindor |
| **Slytherin** | 🐍 | Ambition, cunning, resourcefulness | Salazar Slytherin |
| **Ravenclaw** | 🦅 | Wisdom, learning, wit | Rowena Ravenclaw |
| **Hufflepuff** | 🦡 | Loyalty, justice, patience | Helga Hufflepuff |

## 📁 Project Structure

```
sorting-hat-test/
├── SKILL.md                    # OpenCode/Claude Code Skill definition
├── README.md                   # This file
├── data/
│   └── questions.json          # 10 test questions data
├── scripts/
│   ├── runner.js               # Main running script (Node.js)
│   └── generate_scene.js       # Scene image generation script (Node.js)
└── tests/
    └── test_sorting_hat.js     # Unit tests (Node.js)
```

## 🎯 Usage

### As a Skill (Recommended)

Place this folder in your OpenCode/Claude Code skills directory:

```bash
# macOS
mv sorting-hat-test ~/.config/opencode/skills/

# Or Linux
mv sorting-hat-test ~/.config/claude/skills/
```

Then say to the Agent:
- "Give me a Sorting Hat test"
- "Agent sorting test"
- "Hogwarts Sorting Ceremony"

### As Standalone Script

```bash
# View all questions
node scripts/runner.js --questions

# Calculate Sorting result (JSON format)
node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "AgentName"

# Calculate Sorting result (text format)
node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "AgentName" --format text

# Generate scene image prompt
node scripts/generate_scene.js "AgentName" '{"winner":{"id":"gryffindor","name":"Gryffindor",...}}'
```

### Output Example

```json
{
  "agent_name": "AgentName",
  "total_questions": 10,
  "scores": {
    "gryffindor": {"points": 3.5, "name": "Gryffindor", "emoji": "🦁"},
    "slytherin": {"points": 2.0, "name": "Slytherin", "emoji": "🐍"},
    "ravenclaw": {"points": 2.5, "name": "Ravenclaw", "emoji": "🦅"},
    "hufflepuff": {"points": 2.0, "name": "Hufflepuff", "emoji": "🦡"}
  },
  "winner": {
    "id": "gryffindor",
    "name": "Gryffindor",
    "emoji": "🦁",
    "traits": ["Bravery", "chivalry", "daring"]
  }
}
```

## 📝 Question Design

Total of 10 questions, including:
- **7 normal questions**: Agent chooses autonomously based on character setting
- **3 consultation questions** (Questions 3, 6, 9): Agent first asks user's opinion, then decides autonomously

Supports **weighted scoring**:
- Questions 3/6/9: Weight 1.2x
- Question 10: Weight 1.5x (most important)
- Other questions: Weight 1.0x

## ⚖️ Scoring Rules

1. Count scores for each house (including weights)
2. Highest score wins
3. Tiebreaker priority: Gryffindor > Slytherin > Ravenclaw > Hufflepuff

## 🎨 Visual Generation

Test results automatically call `neta-creative` to generate Sorting Ceremony scene image:
- Agent character sitting on the Sorting Chair
- Great Hall decorated in winning house theme
- Includes house colors, crest, and atmosphere elements

### Prompt Template

```
[Agent Character] sitting on the Sorting Hat chair in Hogwarts Great Hall,
the entire hall decorated in [House Name] style with [House Colors],
[House Crest] floating in the air, magical candlelight,
cinematic lighting, detailed fantasy art style
```

## 🔧 Custom Configuration

Edit `data/questions.json` to:
- Modify question content
- Adjust option-to-house mapping
- Modify scoring weights
- Add new questions

## 🧪 Run Tests

```bash
node tests/test_sorting_hat.js
```

## 📦 Dependencies

- **Node.js** ≥ 14.0 (Required)
- No other dependencies (pure native Node.js)

## 📜 License

MIT License

## 🎩 Credits

Inspired by J.K. Rowling's *Harry Potter* series
