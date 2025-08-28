#!/usr/bin/env node

/**
 * Integration Script for Validated DClinPsy Questions
 * Safely integrates only high-quality validated questions without duplicates
 */

const fs = require('fs-extra');
const crypto = require('crypto');

async function integrateValidatedQuestions() {
  console.log('🔗 Integrating validated DClinPsy questions into website');
  
  try {
    // Load validation results
    const validationResults = JSON.parse(await fs.readFile('final-validation-results.json', 'utf8'));
    console.log(`📊 Loaded ${validationResults.length} validation results`);
    
    // Filter for only high-quality questions (rating A)
    const highQualityQuestions = validationResults.filter(q => 
      q.validation && q.validation.rating === 'A' && q.validation.status === 'valid'
    );
    
    console.log(`✅ Found ${highQualityQuestions.length} high-quality questions (Rating A)`);
    highQualityQuestions.forEach(q => {
      console.log(`   - Question ${q.id}: ${q.category} (${q.validation.confidence}% confidence)`);
    });
    
    if (highQualityQuestions.length === 0) {
      console.log('⚠️  No high-quality questions found to integrate');
      return { integrated: 0, skipped: 0, errors: [] };
    }
    
    // Read current questions file
    const questionsPath = 'src/questions.js';
    const questionsContent = await fs.readFile(questionsPath, 'utf8');
    
    // Parse existing questions to check for duplicates
    const existingScenarios = [];
    const scenarioMatches = questionsContent.matchAll(/scenario:\s*"((?:[^"\\]|\\.)*)"/g);
    for (const match of scenarioMatches) {
      existingScenarios.push(match[1]);
    }
    
    console.log(`📚 Found ${existingScenarios.length} existing questions in website`);
    
    // Check for duplicates using scenario similarity
    const questionsToAdd = [];
    const duplicatesFound = [];
    
    for (const newQuestion of highQualityQuestions) {
      const newScenario = newQuestion.scenario.toLowerCase().replace(/\s+/g, ' ').trim();
      
      // Check if scenario is similar to existing ones
      let isDuplicate = false;
      for (const existingScenario of existingScenarios) {
        const existing = existingScenario.toLowerCase().replace(/\s+/g, ' ').trim();
        
        // Calculate similarity (simple word overlap)
        const newWords = new Set(newScenario.split(' ').filter(w => w.length > 3));
        const existingWords = new Set(existing.split(' ').filter(w => w.length > 3));
        const overlap = [...newWords].filter(w => existingWords.has(w)).length;
        const similarity = overlap / Math.max(newWords.size, existingWords.size);
        
        if (similarity > 0.6) { // 60% word overlap threshold
          isDuplicate = true;
          duplicatesFound.push({
            newId: newQuestion.id,
            similarity: Math.round(similarity * 100),
            existingScenario: existing.substring(0, 100) + '...'
          });
          break;
        }
      }
      
      if (!isDuplicate) {
        questionsToAdd.push(newQuestion);
      }
    }
    
    console.log(`🔍 Duplicate check complete:`);
    console.log(`   - Questions to add: ${questionsToAdd.length}`);
    console.log(`   - Duplicates found: ${duplicatesFound.length}`);
    
    if (duplicatesFound.length > 0) {
      console.log('   Duplicates detected:');
      duplicatesFound.forEach(dup => {
        console.log(`     - Question ${dup.newId} (${dup.similarity}% similar)`);
      });
    }
    
    if (questionsToAdd.length === 0) {
      console.log('⚠️  No new questions to add after duplicate filtering');
      return { integrated: 0, skipped: duplicatesFound.length, errors: [] };
    }
    
    // Convert validated questions to website format
    const formattedQuestions = questionsToAdd.map(q => {
      // Generate explanations from the validation context
      const explanations = q.options.map((option, index) => {
        const rank = q.correctRanking[index];
        const category = q.category;
        
        // Create professional explanations based on ranking
        let explanation = '';
        if (rank === 1) {
          explanation = `This option represents the most appropriate professional response according to BPS/HCPC standards. It demonstrates best practice in ${category.toLowerCase()} by addressing the situation comprehensively while maintaining appropriate professional boundaries and ethical obligations.`;
        } else if (rank === 2) {
          explanation = `This response shows good professional judgment and aligns well with BPS/HCPC guidelines. While not the optimal first choice, it represents sound clinical practice and demonstrates understanding of professional responsibilities in ${category.toLowerCase()}.`;
        } else if (rank === 3) {
          explanation = `This option shows some merit but has limitations. While it addresses aspects of the situation, it may not fully align with optimal professional practice as outlined in BPS/HCPC standards for ${category.toLowerCase()}.`;
        } else if (rank === 4) {
          explanation = `This response has significant limitations and may not align well with professional standards. While not the worst option, it demonstrates gaps in understanding of appropriate professional practice in ${category.toLowerCase()}.`;
        } else {
          explanation = `This is the least appropriate response and fails to meet professional standards. It demonstrates poor understanding of BPS/HCPC requirements for ${category.toLowerCase()} and could potentially cause harm or violate professional boundaries.`;
        }
        
        return explanation;
      });
      
      return `    {
      scenario: "${q.scenario.replace(/"/g, '\\"')}",
      options: [
        "${q.options[0].replace(/"/g, '\\"')}",
        "${q.options[1].replace(/"/g, '\\"')}",
        "${q.options[2].replace(/"/g, '\\"')}",
        "${q.options[3].replace(/"/g, '\\"')}",
        "${q.options[4].replace(/"/g, '\\"')}"
      ],
      idealRanking: [${q.correctRanking.join(', ')}],
      explanations: [
        "${explanations[0]}",
        "${explanations[1]}",
        "${explanations[2]}",
        "${explanations[3]}",
        "${explanations[4]}"
      ],
      category: "${q.category}"
    }`;
    });
    
    // Create backup
    const backupPath = `src/questions.js.backup-${Date.now()}`;
    await fs.copy(questionsPath, backupPath);
    console.log(`💾 Created backup: ${backupPath}`);
    
    // Add questions to the file
    const newQuestionsText = formattedQuestions.join(',\\n');
    const updatedContent = questionsContent.replace(
      /^];$/m, 
      `,\n${newQuestionsText}\n];`
    );
    
    // Write updated file
    await fs.writeFile(questionsPath, updatedContent);
    console.log(`📝 Updated ${questionsPath} with ${questionsToAdd.length} new questions`);
    
    // Generate integration report
    const report = {
      timestamp: new Date().toISOString(),
      integrated: questionsToAdd.length,
      skipped: duplicatesFound.length,
      backup: backupPath,
      questions: questionsToAdd.map(q => ({
        id: q.id,
        category: q.category,
        confidence: q.validation.confidence,
        rating: q.validation.rating
      })),
      duplicates: duplicatesFound
    };
    
    await fs.writeFile('integration-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n🎉 INTEGRATION COMPLETE');
    console.log('='.repeat(40));
    console.log(`✅ Questions integrated: ${report.integrated}`);
    console.log(`⏭️  Duplicates skipped: ${report.skipped}`);
    console.log(`📁 Backup created: ${report.backup}`);
    console.log(`📊 Report saved: integration-report.json`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Integration failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  integrateValidatedQuestions().catch(console.error);
}

module.exports = { integrateValidatedQuestions };