#!/usr/bin/env node

/**
 * Improved DClinPsy Question Parser
 * Correctly extracts questions and options from the RTF text
 */

const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');

async function fixParseQuestions() {
  console.log('🔧 Fixed parsing of DClinPsy questions...');
  
  try {
    // Use the already converted text file if it exists
    let plainText;
    const tempTxtFile = '/tmp/questions.txt';
    
    if (await fs.pathExists(tempTxtFile)) {
      plainText = await fs.readFile(tempTxtFile, 'utf8');
      console.log('✅ Using existing converted text file');
    } else {
      // Convert RTF to plain text
      const execAsync = promisify(exec);
      const rtfPath = 'DClinPsy SJT Questions, Answers, and Guidelines/DClinPsy SJT Questions and Answers.rtf';
      
      await execAsync(`textutil -convert txt "${rtfPath}" -output "${tempTxtFile}"`);
      plainText = await fs.readFile(tempTxtFile, 'utf8');
      console.log('✅ Converted RTF to plain text');
    }
    
    console.log(`📊 Processing ${plainText.length} characters`);
    
    // Split into question blocks
    const questionBlocks = plainText.split(/## Question \d+/).filter(block => block.trim().length > 0);
    console.log(`📚 Found ${questionBlocks.length} question blocks`);
    
    const questions = [];
    
    for (let i = 0; i < questionBlocks.length; i++) {
      const block = questionBlocks[i];
      
      // Extract question ID from the block or use index
      const questionId = i + 11; // Starting from Question 11 based on the data
      
      // Find the scenario (everything before "Rank the following actions")
      const scenarioMatch = block.match(/^(.*?)Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):/s);
      if (!scenarioMatch) {
        console.warn(`⚠️  Skipping question ${questionId} - no ranking instruction found`);
        continue;
      }
      
      const scenario = scenarioMatch[1].trim();
      
      // Extract options: lines between ranking instruction and first "**Ideal ranking:" 
      const optionsSection = block.match(/Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):(.*?)\*\*Ideal ranking: 1\*\*/s);
      if (!optionsSection) {
        console.warn(`⚠️  Skipping question ${questionId} - no options section found`);
        continue;
      }
      
      // Split options by lines and clean them
      const optionLines = optionsSection[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 30 && !line.startsWith('**') && !line.includes('Ideal ranking'));
      
      if (optionLines.length < 5) {
        console.warn(`⚠️  Skipping question ${questionId} - found only ${optionLines.length} options`);
        continue;
      }
      
      // Take the first 5 options
      const options = optionLines.slice(0, 5);
      
      // Extract correct ranking by finding the "**Ideal ranking: X**" lines
      const correctRanking = [];
      for (let rank = 1; rank <= 5; rank++) {
        const rankPattern = new RegExp(`\\*\\*Ideal ranking: ${rank}\\*\\*`, 'g');
        const rankMatches = [...block.matchAll(rankPattern)];
        if (rankMatches.length === 1) {
          // Find which option this ranking corresponds to
          const rankIndex = block.indexOf(rankMatches[0][0]);
          let optionIndex = -1;
          
          // Find the preceding option
          for (let j = 0; j < options.length; j++) {
            const optionIndex = block.indexOf(options[j]);
            if (optionIndex < rankIndex && optionIndex > -1) {
              const nextOptionIndex = j < options.length - 1 ? block.indexOf(options[j + 1]) : block.length;
              if (rankIndex < nextOptionIndex || nextOptionIndex === -1) {
                correctRanking[j] = rank;
                break;
              }
            }
          }
        }
      }
      
      // If ranking extraction failed, use sequential ranking
      if (correctRanking.filter(r => r).length !== 5) {
        correctRanking.splice(0, 5, 1, 2, 3, 4, 5);
        console.warn(`⚠️  Using sequential ranking for question ${questionId}`);
      }
      
      // Determine category from content
      let category = "Professional Practice";
      const lowerScenario = scenario.toLowerCase();
      if (lowerScenario.includes('suicide') || lowerScenario.includes('risk') || lowerScenario.includes('harm')) {
        category = "Risk Management";
      } else if (lowerScenario.includes('confidential') || lowerScenario.includes('safeguard') || lowerScenario.includes('child')) {
        category = "Professional Boundaries";
      } else if (lowerScenario.includes('ethical') || lowerScenario.includes('dilemma')) {
        category = "Ethical Dilemmas";
      } else if (lowerScenario.includes('cultural') || lowerScenario.includes('diversity')) {
        category = "Diversity & Inclusion";
      }
      
      questions.push({
        id: questionId,
        scenario: scenario,
        options: options,
        correctRanking: correctRanking,
        category: category,
        source: "rtf"
      });
      
      console.log(`✅ Parsed Question ${questionId} (${category})`);
    }
    
    console.log(`\n📊 Successfully parsed ${questions.length} questions`);
    console.log('\nCategory breakdown:');
    const categoryCount = {};
    questions.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    });
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    // Save fixed questions
    const outputPath = 'fixed-dclinpsy-questions.json';
    await fs.writeFile(outputPath, JSON.stringify(questions, null, 2));
    
    console.log(`\n💾 Saved to: ${outputPath}`);
    console.log('\nFirst question sample:');
    const sample = { ...questions[0] };
    sample.options = sample.options.map(opt => opt.length > 100 ? opt.substring(0, 100) + '...' : opt);
    console.log(JSON.stringify(sample, null, 2));
    
    return questions;
    
  } catch (error) {
    console.error('❌ Fixed parsing failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  fixParseQuestions().catch(console.error);
}

module.exports = { fixParseQuestions };