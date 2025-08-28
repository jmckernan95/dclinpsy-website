#!/usr/bin/env node

/**
 * Manual DClinPsy Question Parser
 * Parse questions using the exact text structure observed
 */

const fs = require('fs-extra');

async function manualParseQuestions() {
  console.log('📄 MANUAL QUESTION PARSING');
  console.log('='.repeat(40));
  
  // Read the converted text file
  const textPath = '/tmp/questions.txt';
  if (!await fs.pathExists(textPath)) {
    throw new Error('Converted text file not found. Run textutil conversion first.');
  }
  
  const plainText = await fs.readFile(textPath, 'utf8');
  console.log(`📊 Processing ${plainText.length.toLocaleString()} characters`);

  // Split by question markers
  const questionSections = plainText.split(/## Question \d+/);
  
  // Remove the header section (first empty section)
  const questions = [];
  
  for (let i = 1; i < questionSections.length; i++) {
    const section = questionSections[i].trim();
    const questionId = i + 10; // Questions start at 11
    
    console.log(`🔍 Parsing Question ${questionId}...`);
    
    try {
      const question = parseQuestionSection(section, questionId);
      if (question) {
        questions.push(question);
        console.log(`   ✅ Success: ${question.category}`);
      } else {
        console.log(`   ⚠️  Failed to parse`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n📊 Successfully parsed ${questions.length} questions`);
  
  // Category analysis
  const categories = {};
  questions.forEach(q => {
    categories[q.category] = (categories[q.category] || 0) + 1;
  });
  
  console.log('\n📊 Category breakdown:');
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} questions`);
  });

  // Save parsed questions
  await fs.writeFile('manually-parsed-questions.json', JSON.stringify(questions, null, 2));
  console.log('\n💾 Saved: manually-parsed-questions.json');

  return questions;
}

function parseQuestionSection(section, questionId) {
  // Extract scenario (everything before "Rank the following")
  const scenarioMatch = section.match(/^(.*?)Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):/s);
  if (!scenarioMatch) {
    return null;
  }
  
  const scenario = scenarioMatch[1].trim().replace(/\s+/g, ' ');

  // Extract options and rankings
  const options = [];
  const rankings = [];
  const feedback = [];
  
  // Find all "**Ideal ranking: X**" markers
  const rankingMatches = [...section.matchAll(/\*\*Ideal ranking: (\d)\*\*/g)];
  
  if (rankingMatches.length !== 5) {
    console.warn(`   ⚠️  Expected 5 rankings, found ${rankingMatches.length}`);
  }

  // Split section by ranking markers to isolate each option
  let currentPos = section.indexOf('Rank the following actions');
  const rankingStart = section.indexOf('Rank the following actions from 1 (most appropriate) to 5 (least appropriate):');
  currentPos = rankingStart + 'Rank the following actions from 1 (most appropriate) to 5 (least appropriate):'.length;

  for (let i = 0; i < 5; i++) {
    try {
      let nextPos;
      if (i < 4) {
        // Find next ranking marker
        const nextRankingIndex = section.indexOf(`**Ideal ranking: ${i + 2}**`, currentPos);
        nextPos = nextRankingIndex !== -1 ? nextRankingIndex : section.length;
      } else {
        // Last option goes to end or next question
        nextPos = section.indexOf('## Question', currentPos);
        if (nextPos === -1) nextPos = section.length;
      }

      const optionBlock = section.substring(currentPos, nextPos);
      
      // Extract the option text (first substantial line after ranking instruction)
      const lines = optionBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Find the option text (should be the first substantial line that's not a ranking marker)
      let optionText = '';
      for (const line of lines) {
        if (line.length > 20 && 
            !line.startsWith('**Ideal ranking:') && 
            !line.startsWith('This ') &&
            !line.includes('BPS ') &&
            !line.includes('HCPC ')) {
          optionText = line;
          break;
        }
      }

      if (optionText) {
        options.push(optionText);
        
        // Extract ranking
        const rankingMatch = optionBlock.match(/\*\*Ideal ranking: (\d)\*\*/);
        const ranking = rankingMatch ? parseInt(rankingMatch[1]) : i + 1;
        rankings.push(ranking);

        // Extract feedback (text after ranking marker)
        const feedbackMatch = optionBlock.match(/\*\*Ideal ranking: \d\*\*\s*(.*?)(?=\n[A-Z]|\n\*\*|$)/s);
        const feedbackText = feedbackMatch ? feedbackMatch[1].trim().replace(/\s+/g, ' ') : '';
        feedback.push(feedbackText);
      }

      // Move to next section
      currentPos = nextPos;

    } catch (error) {
      console.warn(`   ⚠️  Error parsing option ${i + 1}: ${error.message}`);
    }
  }

  if (options.length < 5) {
    console.warn(`   ⚠️  Only found ${options.length} options`);
    return null;
  }

  // Create correct ranking array (position -> rank mapping)
  const correctRanking = [0, 0, 0, 0, 0];
  for (let i = 0; i < rankings.length && i < 5; i++) {
    const rank = rankings[i];
    if (rank >= 1 && rank <= 5) {
      correctRanking[i] = rank;
    } else {
      correctRanking[i] = i + 1; // Fallback sequential
    }
  }

  // Determine category
  const category = categorizeQuestion(scenario);

  return {
    id: questionId,
    scenario: scenario,
    options: options.slice(0, 5),
    correctRanking: correctRanking,
    originalFeedback: feedback.slice(0, 5),
    category: category,
    hasDetailedFeedback: true,
    source: 'manual_parse'
  };
}

function categorizeQuestion(scenario) {
  const lowerScenario = scenario.toLowerCase();
  
  // Risk management
  if (lowerScenario.includes('suicide') || 
      lowerScenario.includes('self-harm') || 
      lowerScenario.includes('harm') ||
      lowerScenario.includes('threat') ||
      lowerScenario.includes('risk') ||
      lowerScenario.includes('emergency') ||
      lowerScenario.includes('crisis') ||
      lowerScenario.includes('stockpiling medication') ||
      lowerScenario.includes('affair') && lowerScenario.includes('threatens')) {
    return 'Risk Management';
  }
  
  // Safeguarding (includes children, vulnerable adults)
  if (lowerScenario.includes('15-year') ||
      lowerScenario.includes('child') ||
      lowerScenario.includes('minor') ||
      lowerScenario.includes('safeguard') ||
      lowerScenario.includes('protection') ||
      lowerScenario.includes('vulnerable') ||
      lowerScenario.includes('abuse') ||
      lowerScenario.includes('elderly') ||
      lowerScenario.includes('cognitive impairment') ||
      lowerScenario.includes('intimate photos')) {
    return 'Safeguarding';
  }
  
  // Professional boundaries
  if (lowerScenario.includes('boundary') ||
      lowerScenario.includes('gift') ||
      lowerScenario.includes('dual relationship') ||
      lowerScenario.includes('personal') ||
      lowerScenario.includes('outside') ||
      lowerScenario.includes('social') ||
      lowerScenario.includes('supermarket') ||
      lowerScenario.includes('coffee')) {
    return 'Professional Boundaries';
  }
  
  // Confidentiality  
  if (lowerScenario.includes('confidential') ||
      lowerScenario.includes('disclose') ||
      lowerScenario.includes('tell') ||
      lowerScenario.includes('share') ||
      lowerScenario.includes('information') ||
      lowerScenario.includes('break confidentiality')) {
    return 'Confidentiality';
  }
  
  // Cultural/diversity
  if (lowerScenario.includes('cultural') ||
      lowerScenario.includes('diversity') ||
      lowerScenario.includes('minority') ||
      lowerScenario.includes('background') ||
      lowerScenario.includes('ethnicity') ||
      lowerScenario.includes('religion')) {
    return 'Diversity & Inclusion';
  }
  
  // Service delivery
  if (lowerScenario.includes('service') ||
      lowerScenario.includes('waiting') ||
      lowerScenario.includes('referral') ||
      lowerScenario.includes('assessment') ||
      lowerScenario.includes('discharge') ||
      lowerScenario.includes('sessions') && lowerScenario.includes('limit')) {
    return 'Service Delivery';
  }
  
  // Professional development/supervision
  if (lowerScenario.includes('supervision') ||
      lowerScenario.includes('trainee') ||
      lowerScenario.includes('placement') ||
      lowerScenario.includes('learning') ||
      lowerScenario.includes('mistake') ||
      lowerScenario.includes('error')) {
    return 'Professional Development';
  }
  
  // Team working
  if (lowerScenario.includes('team') ||
      lowerScenario.includes('colleague') ||
      lowerScenario.includes('multidisciplinary') ||
      lowerScenario.includes('meeting') ||
      lowerScenario.includes('MDT')) {
    return 'Interprofessional Working';
  }
  
  // Ethical dilemmas
  if (lowerScenario.includes('ethical') ||
      lowerScenario.includes('dilemma') ||
      lowerScenario.includes('moral') ||
      lowerScenario.includes('values')) {
    return 'Ethical Dilemmas';
  }
  
  return 'Professional Practice';
}

// Run if called directly
if (require.main === module) {
  manualParseQuestions().catch(console.error);
}

module.exports = { manualParseQuestions };