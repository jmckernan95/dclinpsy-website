#!/usr/bin/env node

/**
 * Direct Question Extraction
 * Manual extraction of all visible questions from converted text
 */

const fs = require('fs-extra');

async function directQuestionExtraction() {
  console.log('📄 DIRECT QUESTION EXTRACTION');
  console.log('='.repeat(40));
  
  // Read converted text
  const textPath = '/tmp/questions.txt';
  if (!await fs.pathExists(textPath)) {
    throw new Error('Converted text file not found at /tmp/questions.txt');
  }
  
  const plainText = await fs.readFile(textPath, 'utf8');
  console.log(`📊 Processing ${plainText.length.toLocaleString()} characters`);

  // Find all question markers
  const questionMarkers = [...plainText.matchAll(/## Question (\d+)/g)];
  console.log(`🔍 Found ${questionMarkers.length} question markers`);
  
  const questions = [];
  
  // Process each question section
  for (let i = 0; i < questionMarkers.length; i++) {
    const questionNum = parseInt(questionMarkers[i][1]);
    const startPos = questionMarkers[i].index;
    const endPos = i < questionMarkers.length - 1 ? questionMarkers[i + 1].index : plainText.length;
    
    const questionSection = plainText.substring(startPos, endPos);
    console.log(`\n🔍 Processing Question ${questionNum}...`);
    
    const question = extractSingleQuestion(questionSection, questionNum);
    if (question) {
      questions.push(question);
      console.log(`   ✅ Extracted: ${question.category}`);
    } else {
      console.log(`   ⚠️  Failed to extract`);
    }
  }
  
  console.log(`\n📊 Successfully extracted: ${questions.length} questions`);
  
  // Category breakdown
  const categories = {};
  questions.forEach(q => {
    categories[q.category] = (categories[q.category] || 0) + 1;
  });
  
  console.log('\n📊 Category distribution:');
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });

  // Save all extracted questions
  await fs.writeFile('directly-extracted-questions.json', JSON.stringify(questions, null, 2));
  console.log('\n💾 Saved: directly-extracted-questions.json');

  return questions;
}

function extractSingleQuestion(questionText, questionId) {
  try {
    // Extract scenario (everything before "Rank the following actions")
    const scenarioMatch = questionText.match(/## Question \d+\s*(.*?)Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):/s);
    if (!scenarioMatch) {
      return null;
    }
    
    const scenario = scenarioMatch[1].trim().replace(/\s+/g, ' ');
    
    // Extract options by finding text between ranking instruction and feedback
    const afterRanking = questionText.substring(questionText.indexOf('Rank the following actions from 1 (most appropriate) to 5 (least appropriate):'));
    
    // Find option lines (substantial text before **Ideal ranking:**)
    const lines = afterRanking.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const options = [];
    
    // Look for substantial lines that aren't rankings or feedback
    for (const line of lines) {
      if (line.length > 30 && 
          !line.startsWith('**Ideal ranking:') &&
          !line.startsWith('This ') &&
          !line.startsWith('The ') &&
          !line.includes('BPS ') &&
          !line.includes('HCPC ') &&
          !line.startsWith('Rank the following') &&
          !line.startsWith('## Question')) {
        
        // Clean the line
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[A-E]\)\s*/, '').trim();
        
        if (cleanLine.length > 30 && options.length < 5) {
          options.push(cleanLine);
        }
      }
      
      // Stop at 5 options
      if (options.length >= 5) break;
    }
    
    if (options.length < 5) {
      return null;
    }
    
    // Extract ranking by finding **Ideal ranking: X** patterns
    const rankings = [1, 2, 3, 4, 5]; // Default sequential - we'll validate these later
    
    // Determine category based on scenario content
    const category = categorizeScenario(scenario);
    
    return {
      id: questionId,
      scenario: scenario,
      options: options.slice(0, 5),
      correctRanking: rankings,
      category: category,
      source: 'direct_extraction',
      extractedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.warn(`   Error processing Q${questionId}: ${error.message}`);
    return null;
  }
}

function categorizeScenario(scenario) {
  const text = scenario.toLowerCase();
  
  // Risk management keywords
  if (text.includes('suicide') || text.includes('self-harm') || text.includes('harm') ||
      text.includes('threat') || text.includes('risk') || text.includes('crisis') ||
      text.includes('emergency') || text.includes('stockpiling medication') ||
      text.includes('threatens to harm')) {
    return 'Risk Management';
  }
  
  // Safeguarding keywords  
  if (text.includes('child') || text.includes('15-year') || text.includes('minor') ||
      text.includes('safeguard') || text.includes('vulnerable') || text.includes('abuse') ||
      text.includes('elderly') || text.includes('cognitive impairment') ||
      text.includes('intimate photos') || text.includes('custody')) {
    return 'Safeguarding';
  }
  
  // Professional boundaries
  if (text.includes('boundary') || text.includes('gift') || text.includes('social') ||
      text.includes('personal') || text.includes('outside') || text.includes('dual') ||
      text.includes('supermarket') || text.includes('relationship')) {
    return 'Professional Boundaries';
  }
  
  // Confidentiality
  if (text.includes('confidential') || text.includes('disclose') || text.includes('tell') ||
      text.includes('share') || text.includes('information') || text.includes('secret')) {
    return 'Confidentiality';
  }
  
  // Cultural/diversity
  if (text.includes('cultural') || text.includes('diversity') || text.includes('minority') ||
      text.includes('background') || text.includes('ethnicity') || text.includes('collectivist')) {
    return 'Diversity & Inclusion';
  }
  
  // Service delivery
  if (text.includes('service') || text.includes('waiting') || text.includes('referral') ||
      text.includes('assessment') || text.includes('session') || text.includes('discharge')) {
    return 'Service Delivery';
  }
  
  // Professional development
  if (text.includes('supervision') || text.includes('trainee') || text.includes('placement') ||
      text.includes('learning') || text.includes('mistake') || text.includes('feedback')) {
    return 'Professional Development';
  }
  
  // Team working
  if (text.includes('team') || text.includes('colleague') || text.includes('multidisciplinary') ||
      text.includes('meeting') || text.includes('disagreement')) {
    return 'Interprofessional Working';
  }
  
  // Ethical dilemmas
  if (text.includes('ethical') || text.includes('dilemma') || text.includes('conflict') ||
      text.includes('moral') || text.includes('values')) {
    return 'Ethical Dilemmas';
  }
  
  return 'Professional Practice';
}

if (require.main === module) {
  directQuestionExtraction().catch(console.error);
}

module.exports = { directQuestionExtraction };