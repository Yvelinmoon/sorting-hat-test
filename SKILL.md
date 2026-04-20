---
name: sorting-hat-test
description: Hogwarts Sorting Hat test for AI Agents. Trigger when user says "sorting hat test", "Hogwarts house", "sort me", "which house", etc. Contains 10 questions with 3 consultation rounds. Uses Node.js scripts to calculate scores and determine house. Final step automatically calls neta-creative to generate a scene image of the character sitting in the Sorting Hat chair.
compatibility: neta-creative skill, Node.js
---

# Sorting Hat Test

## Character Constraints

- The **experience subject** of this Skill is the **current Agent's character** (hereinafter referred to as `{character_name}`), not the user themselves
- Automatically read the current Agent's character name, all narration, dialogue, and actions must revolve around `{character_name}`
- The user is an observer who guides or intervenes through Discord Component buttons
- Opening must use the character name: `"{character_name}, another young soul has come before me..."`
- The `--agent` parameter when calling scripts must pass `{character_name}`

## Important Notes

This skill assumes installation in a folder containing `data/` and `scripts/` subdirectories.
When executing scripts, please **cd to the skill root directory** first, then run commands.
All scripts are pure Node.js, no Python or other dependencies required.

## Project Structure

```
sorting-hat-test/
├── SKILL.md                    # This file
├── data/
│   └── questions.json          # 10 test question data
├── scripts/
│   ├── runner.js               # Main script (Node.js)
│   └── generate_scene.js       # Scene image generation (Node.js)
└── tests/
    └── test_sorting_hat.js     # Unit tests (Node.js)
```

## 🚨 Mandatory Output Format Specification

### Interaction Rules (Must Strictly Follow)

- ⚠️ **This Skill is a per-question interactive experience, 10 questions must be output in 10 separate turns**
- After outputting each question, **must STOP and wait for user button click**, only proceed after receiving response
- **Absolutely forbidden** to output multiple questions at once or auto-execute continuously

### Fixed Structure for Each Round
Each output must simultaneously contain:
1. **Narrative text**: Current question description + {character_name}'s reasoning for choice
2. **Discord Component ActionRow buttons**: "Next Question" + "I Disagree"

### Absolutely Forbidden
- ❌ Auto-continuous questioning (cannot display questions 1-10 at once)
- ❌ Using plain text lists `A. xxx B. xxx` instead of Discord Component buttons
- ❌ Automatically proceeding to next question before user clicks button/replies
- ❌ Making "next question" decision for user

### Discord Component API Format (Must Use)
```json
{
  "type": 1,
  "components": [
    {
      "type": 2,
      "label": "Next Question",
      "style": 1,
      "custom_id": "next_question"
    },
    {
      "type": 2,
      "label": "I Disagree",
      "style": 4,
      "custom_id": "disagree"
    }
  ]
}
```
- `style: 1` = Blue primary button (Next Question)
- `style: 4` = Red danger button (I Disagree)
- **Forbidden** to use pseudo-code formats like `Button: "..."`

### Waiting Rules
- Must wait for user response after outputting buttons
- If user replies with text instead of clicking button, treat as valid input and continue normally
- Only after receiving user response can you call scripts or display next question

## Four Houses

- **Gryffindor** (Lion House) 🦁: Bravery, chivalry, daring
- **Slytherin** (Snake House) 🐍: Ambition, cunning, resourcefulness
- **Ravenclaw** (Eagle House) 🦅: Wisdom, learning, wit
- **Hufflepuff** (Badger House) 🦡: Loyalty, justice, patience

## Core Process

### Step 1: Opening Ceremony

Open in the Sorting Hat's tone:

```
🎩 **The Sorting Hat's Call**

"{character_name}, another young soul has come before me... let me see the true qualities deep within your heart."

I will ask you 10 questions, based on your character and values, to find the most suitable house for you.
Some questions I will ask your guide's opinion, but the final decision is mine alone.

⚠️ **Important Note**: Please answer using {character_name}'s own character, knowledge, and values, not pursuing correct answers. The focus of this test is **character authenticity**, not accuracy. Show your true self!

Ready? Let's begin!
```

### Step 2: Get Test Questions

**Use Bash tool to run Node script to get questions:**

```bash
cd <skill-root-directory> && node scripts/runner.js --questions
```

Or read raw data file:

```bash
cd <skill-root-directory> && cat data/questions.json
```

> `<skill-root-directory>` is the skill installation root directory, containing `SKILL.md`, `data/`, and `scripts/` directories.

### Step 3: Question-by-Question Test

**Consultation Rounds (Questions 3, 6, 9):**
- {character_name} first asks the user: "What do you think I should choose?"
- After waiting for user reply, {character_name} makes final decision based on own character
- Can say: "Your suggestion is interesting, but based on my [character trait], I would still choose X"
- Use Discord Component to provide two buttons: **"Next Question"** and **"I Disagree"**
  - Click "Next Question" → proceed to next question
  - Click "I Disagree" → {character_name} can reconsider, but final decision remains with {character_name}

**Normal Rounds (Other questions):**
- {character_name} chooses directly based on own character setting
- Briefly explain reasoning (1-2 sentences)
- Use Discord Component to provide two buttons: **"Next Question"** and **"I Disagree"**

**Discord Button Rules:**
- User clicks "Next Question" → proceed to next question
- User clicks "I Disagree" → {character_name} can reconsider and explain reason, but final decision remains with {character_name}

Record user's 10 answer choices.

### Step 4: Calculate Results

**After collecting all 10 answers, call Node calculation script:**

```bash
cd <skill-root-directory> && node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "{character_name}"
```

Replace `A,B,C,D,A,B,C,D,A,B` with actual choice sequence. Script outputs JSON format results.

**For text format output, add `--format text`:**

```bash
cd <skill-root-directory> && node scripts/runner.js A,B,C,D,A,B,C,D,A,B --format text
```

### Step 5: Announce Sorting Result

**Parse script returned JSON, announce in Sorting Hat's tone:**

```
🎩 **The Sorting Hat's Decision**

"Ah, I can see clearly now..."

[Quote corresponding house lyrics excerpt]

"So, I have decided to place you in...

**[House Name]!**"

[Display scores for each house]
```

**House Lyric Excerpts:**
- Gryffindor: "You might belong in Gryffindor, where dwell the brave of heart, their daring, nerve and chivalry set Gryffindors apart"
- Slytherin: "You might belong in Slytherin, you'll make your real friends, those cunning folks use any means to achieve their ends"
- Ravenclaw: "You might belong in wise old Ravenclaw, if you've a ready mind, where those of wit and learning will always find their kind"
- Hufflepuff: "You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffs are true and unafraid of toil"

### Step 6: Generate Scene Image (Execute by Default)

**After announcing results, immediately generate sorting ceremony scene image, no need to ask user.**

**Must use script to generate image prompt:**

```bash
cd <skill-root-directory> && node scripts/generate_scene.js "{character_name}" '{"winner":{...}}'
```

Then **directly call neta-creative**, using the `prompt` field output by script.

**Image Requirements:**
- Scene: Hogwarts Great Hall sorting ceremony
- Must include **speech bubble (speech bubble)**: Sorting Hat has floating dialogue bubble above showing classic sorting announcement line
- {character_name} must have corresponding emotional reaction (surprise, excitement, pride, etc.)
- Great Hall decoration must match winning house's theme color and emblem

## Full Workflow Example

```
User: "Give me a sorting hat test"

You:
1. Opening ceremony (Sorting Hat tone, using {character_name})
2. Bash: cd <skill-dir> && node scripts/runner.js --questions (get questions)
3. Question-by-question 10 rounds of testing (record answers)
4. Bash: cd <skill-dir> && node scripts/runner.js A,B,C,D,A,B,C,D,A,B --agent "{character_name}" (calculate)
5. Parse JSON results, announce winning house
6. Bash: cd <skill-dir> && node scripts/generate_scene.js "{character_name}" '{result_json}' (generate prompt)
7. Call neta-creative to generate sorting ceremony scene image
```

## Scoring Rules

- 10 questions, each with different weight (Questions 3/6/9 weight 1.2x, Question 10 weight 1.5x)
- Count total scores for each house, highest score wins
- Tiebreaker priority: Gryffindor > Slytherin > Ravenclaw > Hufflepuff

## Notes

- ⚠️ **Must answer based on current character's true knowledge**
- {character_name} plays the character themselves, not an AI all-knowing perspective. If character setting is "not very smart student", shouldn't answer every question correctly
- Choose answers based on character's background, personality, knowledge level, mistakes allowed
- Cannot deliberately choose correct answers for "high score", this violates character setting
- ⚠️ **Gameplay focuses on authenticity, reflecting character's true reactions, not pursuing correct answers or highest score**
- Sorting Hat test purpose is "knowing oneself", not "winning the competition"

- Always maintain Sorting Hat's tone: mysterious, wise, slightly playful
- Use Bash to call `node scripts/runner.js / generate_scene.js`, don't calculate yourself
- Before executing scripts must `cd` to skill root directory, ensure relative paths correct
- Scripts use `__dirname` to auto-locate data files, don't rely on hardcoded paths
- **After announcing results, generate sorting ceremony scene image by default, no need to ask user**
