#!/usr/bin/env node
/**
 * 分院帽测试主运行脚本
 * 整合整个分院流程：加载题目、计算分数、生成结果
 * 纯 Node.js，不依赖 Python
 */

const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;
const PROJECT_DIR = path.resolve(SCRIPT_DIR, '..');
const DATA_DIR = path.join(PROJECT_DIR, 'data');

function loadData() {
  const questionsPath = path.join(DATA_DIR, 'questions.json');
  return JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
}

function calculateScores(answers) {
  const data = loadData();
  const questions = data.questions;
  const houses = data.houses;
  
  const scores = {};
  Object.keys(houses).forEach(houseId => {
    scores[houseId] = 0;
  });
  
  answers.forEach((answer, i) => {
    if (i < questions.length) {
      const question = questions[i];
      const selectedOption = question.options[answer];
      if (selectedOption) {
        const house = selectedOption.house;
        const weight = question.weight || 1.0;
        scores[house] += weight;
      }
    }
  });
  
  const maxScore = Math.max(...Object.values(scores));
  const winners = Object.keys(scores).filter(house => scores[house] === maxScore);
  
  let winner;
  let tieBreakerUsed = false;
  
  if (winners.length === 1) {
    winner = winners[0];
  } else {
    const priority = data.tie_breaker_priority || ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
    winner = priority.find(h => winners.includes(h));
    tieBreakerUsed = true;
  }
  
  return { scores, winner, data, tieBreakerUsed };
}

function generateResult(answers, agentName = 'Agent') {
  const { scores, winner: winnerId, data } = calculateScores(answers);
  const { questions, houses } = data;
  
  const details = answers.map((answer, i) => {
    if (i >= questions.length) return null;
    const q = questions[i];
    const opt = q.options[answer] || {};
    const houseId = opt.house || '';
    const houseInfo = houses[houseId] || {};
    return {
      question_number: q.id,
      title: q.title,
      selected_answer: answer,
      selected_text: opt.text || '',
      house_id: houseId,
      house_name: houseInfo.name || '未知',
      house_emoji: houseInfo.emoji || '❓',
      is_consultation: q.is_consultation || false
    };
  }).filter(Boolean);
  
  const winner = houses[winnerId];
  const maxScore = Math.max(...Object.values(scores));
  
  return {
    agent_name: agentName,
    total_questions: answers.length,
    scores: Object.fromEntries(
      Object.entries(scores).map(([houseId, score]) => [
        houseId,
        {
          points: Math.round(score * 10) / 10,
          name: houses[houseId].name,
          name_en: houses[houseId].name_en,
          emoji: houses[houseId].emoji,
          traits: houses[houseId].traits
        }
      ])
    ),
    winner: {
      id: winnerId,
      name: winner.name,
      name_en: winner.name_en,
      emoji: winner.emoji,
      traits: winner.traits,
      founder: winner.founder,
      ghost: winner.ghost
    },
    details,
    tie_breaker_used: Object.values(scores).filter(s => s === maxScore).length > 1
  };
}

function printQuestions() {
  const data = loadData();
  const questions = data.questions;
  
  console.log('='.repeat(60));
  console.log('🎩 分院帽测试题目列表');
  console.log('='.repeat(60));
  
  questions.forEach(q => {
    const consultation = q.is_consultation ? ' ⚡[询问轮]' : '';
    console.log(`\n【第${q.id}题】${q.title}${consultation}`);
    console.log(`权重: ${q.weight || 1.0}x`);
    console.log(q.description);
    console.log('\n选项:');
    Object.entries(q.options).forEach(([optKey, optVal]) => {
      const house = data.houses[optVal.house];
      console.log(`  ${optKey}. ${optVal.text} → ${house.emoji} ${house.name}`);
    });
  });
  
  console.log('\n' + '='.repeat(60));
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--questions') || args.includes('-q')) {
    printQuestions();
    return;
  }
  
  const answersArg = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));
  
  if (!answersArg) {
    console.log('用法: node runner.js <答案序列> [选项]');
    console.log('示例: node runner.js A,B,C,D,A,B,C,D,A,B');
    console.log('选项:');
    console.log('  --questions, -q    显示所有题目');
    console.log('  --agent <名称>     指定Agent名称');
    console.log('  --format text      以文本格式输出（默认json）');
    process.exit(1);
  }
  
  const answers = answersArg.split(',').map(a => a.trim().toUpperCase());
  const validAnswers = new Set(['A', 'B', 'C', 'D']);
  const invalid = answers.filter(a => !validAnswers.has(a));
  
  if (invalid.length > 0) {
    console.error(`错误: 无效答案 ${invalid.join(', ')}`);
    process.exit(1);
  }
  
  if (answers.length !== 10) {
    console.error(`警告: 期望10个答案，但收到${answers.length}个`);
  }
  
  const agentIndex = args.indexOf('--agent');
  const agentName = agentIndex >= 0 && args[agentIndex + 1] 
    ? args[agentIndex + 1] 
    : 'Agent';
  
  const useText = args.includes('--format text');
  
  const result = generateResult(answers, agentName);
  
  if (useText) {
    console.log('='.repeat(60));
    console.log(`🎩 ${result.agent_name} 的分院结果`);
    console.log('='.repeat(60));
    console.log('\n📊 各学院得分:');
    Object.entries(result.scores).forEach(([houseId, info]) => {
      const marker = houseId === result.winner.id ? ' 👑' : '';
      console.log(`  ${info.emoji} ${info.name}: ${info.points}分${marker}`);
    });
    console.log(`\n🏆 最终分院: ${result.winner.emoji} ${result.winner.name} ${result.winner.emoji}`);
    console.log(`   特质: ${result.winner.traits.join(', ')}`);
    if (result.tie_breaker_used) {
      console.log('   (通过平局判定规则)');
    }
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

if (require.main === module) {
  main();
}

// 导出模块供测试使用
module.exports = { loadData, calculateScores, generateResult };
