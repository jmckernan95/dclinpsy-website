#!/usr/bin/env node

/**
 * Robust DClinPsy Question Extractor
 * Manually parse questions from RTF text without relying on JSON generation
 */

const fs = require('fs-extra');
const { exec } = require('child_process');
const { promisify } = require('util');

class RobustQuestionExtractor {
  constructor() {
    this.questions = [];
  }

  async extractAllQuestions() {
    console.log('📄 ROBUST QUESTION EXTRACTION');
    console.log('='.repeat(40));
    
    // Convert RTF to plain text
    const execAsync = promisify(exec);
    const rtfPath = 'DClinPsy SJT Questions, Answers, and Guidelines/DClinPsy SJT Questions and Answers.rtf';
    const tempTxtFile = '/tmp/dclinpsy_robust_extract.txt';
    
    await execAsync(`textutil -convert txt "${rtfPath}" -output "${tempTxtFile}"`);
    const plainText = await fs.readFile(tempTxtFile, 'utf8');
    
    console.log(`📊 Text content: ${plainText.length.toLocaleString()} characters`);

    // Parse questions manually using text patterns
    const questionBlocks = this.splitIntoQuestionBlocks(plainText);
    console.log(`📚 Found ${questionBlocks.length} question blocks`);

    for (let i = 0; i < questionBlocks.length; i++) {
      const block = questionBlocks[i];
      const question = this.parseQuestionBlock(block, i);
      
      if (question) {
        this.questions.push(question);
        console.log(`✅ Parsed Question ${question.id}: ${question.category}`);
      } else {
        console.warn(`⚠️  Failed to parse block ${i + 1}`);
      }
    }

    console.log(`\n📊 Successfully extracted ${this.questions.length} questions`);
    
    // Category analysis
    const categories = {};
    this.questions.forEach(q => {
      categories[q.category] = (categories[q.category] || 0) + 1;
    });
    
    console.log('\n📊 Category breakdown:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} questions`);
    });

    // Save extracted questions
    await fs.writeFile('extracted-questions.json', JSON.stringify(this.questions, null, 2));
    console.log('\n💾 Saved: extracted-questions.json');

    // Cleanup
    await fs.remove(tempTxtFile);
    
    return this.questions;
  }

  splitIntoQuestionBlocks(text) {
    // Split by "## Question" markers
    const questionSections = text.split(/## Question \d+/);
    
    // Remove empty first section and add question numbers back
    const blocks = [];
    for (let i = 1; i < questionSections.length; i++) {
      const questionNum = this.extractQuestionNumber(questionSections[i]) || (i + 10); // Start from Q11
      blocks.push({
        number: questionNum,
        content: questionSections[i].trim()
      });
    }
    
    return blocks;
  }

  extractQuestionNumber(text) {
    // Try to find question number from context
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  parseQuestionBlock(block, index) {
    try {
      const content = block.content || block;
      const questionNum = block.number || (index + 11);

      // Extract scenario - everything before "Rank the following"
      const scenarioMatch = content.match(/^(.*?)Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):/s);
      if (!scenarioMatch) {
        return null;
      }

      const scenario = scenarioMatch[1].trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ');

      // Extract options by finding text between ranking instruction and feedback
      const optionsSection = content.match(/Rank the following actions from 1 \(most appropriate\) to 5 \(least appropriate\):(.*?)(\*\*Ideal ranking: 1\*\*|$)/s);
      if (!optionsSection) {
        return null;
      }

      // Split options by looking for substantial sentences/paragraphs
      const optionsText = optionsSection[1];
      const optionCandidates = optionsText
        .split(/\n/)
        .map(line => line.trim())
        .filter(line => 
          line.length > 30 && 
          !line.startsWith('**') && 
          !line.includes('Ideal ranking') &&
          !line.includes('This option') &&
          !line.includes('This response') &&
          !line.includes('This approach') &&
          !line.includes('BPS') &&
          !line.includes('HCPC')
        );

      // Take first 5 substantial options
      const options = optionCandidates.slice(0, 5);
      
      if (options.length < 5) {
        console.warn(`⚠️  Question ${questionNum}: Only found ${options.length} options`);
        return null;
      }

      // Extract ranking information from feedback sections
      const ranking = this.extractRankingFromFeedback(content);

      // Determine category from scenario content
      const category = this.categorizeQuestion(scenario);

      return {
        id: questionNum,
        scenario: scenario,
        options: options.map(opt => opt.replace(/\s+/g, ' ').trim()),
        originalRanking: ranking,
        category: category,
        hasDetailedFeedback: content.includes('**Ideal ranking:'),
        source: 'rtf_robust_extract'
      };

    } catch (error) {
      console.warn(`⚠️  Error parsing question block: ${error.message}`);
      return null;
    }
  }

  extractRankingFromFeedback(content) {
    // Look for "**Ideal ranking: X**" patterns
    const rankings = [];
    
    for (let rank = 1; rank <= 5; rank++) {
      const pattern = new RegExp(`\\*\\*Ideal ranking: ${rank}\\*\\*`, 'gi');
      const matches = [...content.matchAll(pattern)];
      
      if (matches.length === 1) {
        // Find which option this ranking belongs to
        const rankPosition = content.indexOf(matches[0][0]);
        
        // Look backwards to find the preceding option
        const beforeRank = content.substring(0, rankPosition);
        const lines = beforeRank.split('\n').reverse();
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.length > 30 && !line.includes('**') && !line.includes('This ')) {
            // This is likely the option for this ranking
            rankings[rank - 1] = i; // Store position info
            break;
          }
        }
      }
    }
    
    // If ranking extraction is complex, use sequential ranking
    if (rankings.filter(r => r !== undefined).length < 5) {
      return [1, 2, 3, 4, 5];
    }

    return [1, 2, 3, 4, 5]; // Default to sequential for now
  }

  categorizeQuestion(scenario) {
    const lowerScenario = scenario.toLowerCase();
    
    // Risk management indicators
    if (lowerScenario.includes('suicide') || 
        lowerScenario.includes('self-harm') || 
        lowerScenario.includes('harm') ||
        lowerScenario.includes('threat') ||
        lowerScenario.includes('risk') ||
        lowerScenario.includes('emergency') ||
        lowerScenario.includes('crisis')) {
      return 'Risk Management';
    }
    
    // Professional boundaries
    if (lowerScenario.includes('boundary') ||
        lowerScenario.includes('gift') ||
        lowerScenario.includes('dual relationship') ||
        lowerScenario.includes('personal') ||
        lowerScenario.includes('outside') ||
        lowerScenario.includes('social')) {
      return 'Professional Boundaries';
    }
    
    // Safeguarding
    if (lowerScenario.includes('child') ||
        lowerScenario.includes('safeguard') ||
        lowerScenario.includes('protection') ||
        lowerScenario.includes('vulnerable') ||
        lowerScenario.includes('abuse') ||
        lowerScenario.includes('15-year') ||
        lowerScenario.includes('elderly')) {
      return 'Safeguarding';
    }
    
    // Confidentiality  
    if (lowerScenario.includes('confidential') ||
        lowerScenario.includes('disclose') ||
        lowerScenario.includes('tell') ||
        lowerScenario.includes('share') ||
        lowerScenario.includes('information')) {
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
        lowerScenario.includes('discharge')) {
      return 'Service Delivery';
    }
    
    // Supervision/training
    if (lowerScenario.includes('supervision') ||
        lowerScenario.includes('trainee') ||
        lowerScenario.includes('placement') ||
        lowerScenario.includes('learning') ||
        lowerScenario.includes('mistake')) {
      return 'Professional Development';
    }
    
    // Team working
    if (lowerScenario.includes('team') ||
        lowerScenario.includes('colleague') ||
        lowerScenario.includes('multidisciplinary') ||
        lowerScenario.includes('meeting')) {
      return 'Interprofessional Working';
    }
    
    // Default
    return 'Professional Practice';
  }

  async run() {
    try {
      return await this.extractAllQuestions();
    } catch (error) {
      console.error('❌ Robust extraction failed:', error.message);
      throw error;
    }
  }
}

// Run if called directly
async function main() {
  const extractor = new RobustQuestionExtractor();
  return await extractor.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RobustQuestionExtractor };