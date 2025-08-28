#!/usr/bin/env node

/**
 * Quick Question Parser
 * Directly parse the converted RTF text to extract question structure
 */

const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');

async function quickParseQuestions() {
  console.log('🚀 Quick parsing of DClinPsy questions...');
  
  try {
    // Convert RTF to plain text
    const execAsync = promisify(exec);
    const rtfPath = 'DClinPsy SJT Questions, Answers, and Guidelines/DClinPsy SJT Questions and Answers.rtf';
    const tempTxtFile = '/tmp/dclinpsy_questions_parse.txt';
    
    await execAsync(`textutil -convert txt "${rtfPath}" -output "${tempTxtFile}"`);
    const plainText = await fs.readFile(tempTxtFile, 'utf8');
    
    console.log(`✅ Converted RTF: ${plainText.length} characters`);
    
    // Parse questions using simple text parsing
    const questions = [];
    const questionPattern = /## Question (\d+)\n(.*?)(?=## Question \d+|$)/gs;
    let match;
    let id = 1;
    
    while ((match = questionPattern.exec(plainText)) !== null) {
      const [, questionNum, questionContent] = match;
      
      // Extract scenario (everything before "Rank the following")
      const scenarioMatch = questionContent.match(/^(.*?)Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):/s);
      if (!scenarioMatch) continue;
      
      const scenario = scenarioMatch[1].trim();
      
      // Extract options (look for lines that seem to be options)
      const optionLines = questionContent.split('\n').filter(line => {
        line = line.trim();
        return line.length > 50 && 
               !line.startsWith('**Ideal ranking:') && 
               !line.startsWith('This option') &&
               !line.startsWith('This response') &&
               !line.startsWith('This approach') &&
               !line.includes('Ideal ranking:');
      });
      
      // Take first 5 substantial lines as options
      const options = optionLines.slice(0, 5).map(opt => opt.trim());
      
      if (options.length === 5) {
        questions.push({
          id: parseInt(questionNum) || id++,
          scenario: scenario,
          options: options,
          correctRanking: [1, 2, 3, 4, 5], // Default - will be validated later
          category: "Professional Practice", // Default category
          source: "rtf"
        });
        
        console.log(`✅ Parsed Question ${questionNum}`);
      } else {
        console.warn(`⚠️  Skipped Question ${questionNum} - found ${options.length} options`);
      }
    }
    
    console.log(`\n📊 Successfully parsed ${questions.length} questions`);
    
    // Save parsed questions
    const outputPath = 'parsed-dclinpsy-questions.json';
    await fs.writeFile(outputPath, JSON.stringify(questions, null, 2));
    
    console.log(`💾 Saved to: ${outputPath}`);
    console.log('\nFirst question sample:');
    console.log(JSON.stringify(questions[0], null, 2));
    
    // Clean up
    await fs.remove(tempTxtFile);
    
    return questions;
    
  } catch (error) {
    console.error('❌ Quick parsing failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  quickParseQuestions().catch(console.error);
}

module.exports = { quickParseQuestions };