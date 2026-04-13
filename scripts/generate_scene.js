#!/usr/bin/env node
/**
 * 场景图生成脚本
 * 根据分院结果生成对应的仪式场景图提示词
 * 纯 Node.js
 */

const houses = {
  gryffindor: {
    colors: 'red and gold',
    symbol: 'lion emblem',
    elements: 'floating flames, golden banners, bold crimson decor',
    atmosphere: 'fiery and heroic'
  },
  slytherin: {
    colors: 'green and silver',
    symbol: 'serpent emblem',
    elements: 'water reflections, silver tapestries, elegant green drapery',
    atmosphere: 'mysterious and ambitious'
  },
  ravenclaw: {
    colors: 'blue and bronze',
    symbol: 'eagle emblem',
    elements: 'floating books, starry ceiling, bronze celestial decorations',
    atmosphere: 'intellectual and serene'
  },
  hufflepuff: {
    colors: 'yellow and black',
    symbol: 'badger emblem',
    elements: 'warm sunlight, autumn leaves, earthy cozy decorations',
    atmosphere: 'warm and welcoming'
  }
};

function generatePrompt(agentName, winner) {
  const visual = houses[winner.id];
  
  const prompt = `${agentName} sitting on the Sorting Hat chair in Hogwarts Great Hall, ` +
    `the entire hall decorated in ${winner.name_en} style with ${visual.colors} color scheme, ` +
    `${visual.symbol} floating in the air, ${visual.elements}, ` +
    `magical candlelight illuminating the scene, ${visual.atmosphere} atmosphere, ` +
    `grand Gothic architecture, enchanted ceiling showing night sky, ` +
    `cinematic lighting, detailed fantasy art style, Harry Potter universe aesthetic`;
  
  return prompt;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('用法: node generate_scene.js "<agent_name>" \'<result_json>\'');
    console.log('示例: node generate_scene.js "MyAgent" \'{"winner":{"id":"gryffindor"}}\'');
    process.exit(1);
  }
  
  const agentName = args[0];
  let result;
  try {
    result = JSON.parse(args[1]);
  } catch (e) {
    console.error('错误: 无法解析JSON结果');
    process.exit(1);
  }
  
  const winner = result.winner;
  const prompt = generatePrompt(agentName, winner);
  
  const output = {
    agent: agentName,
    house: winner,
    prompt: prompt,
    prompt_cn: `${agentName}坐在霍格沃茨大礼堂的分院帽椅子上，整个礼堂装饰成${winner.name}风格，` +
               `${winner.name}的主题色调，魔法蜡烛的光芒，庄严神圣的分院仪式场景，电影级光影，奇幻插画风格`
  };
  
  console.log(JSON.stringify(output, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { generatePrompt, houses };
