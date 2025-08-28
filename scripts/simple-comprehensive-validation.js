#!/usr/bin/env node

/**
 * Simple Comprehensive Validation
 * Validate extracted questions with concise BPS/HCPC analysis
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');

async function simpleComprehensiveValidation() {
  console.log('🚀 SIMPLE COMPREHENSIVE VALIDATION');
  console.log('='.repeat(50));

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024, // Shorter responses
    }
  });

  // Load questions
  const questions = JSON.parse(await fs.readFile('manually-parsed-questions.json', 'utf8'));
  console.log(`📚 Validating ${questions.length} extracted questions`);

  const results = [];
  let totalCost = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log(`\n📋 Question ${question.id} (${question.category})`);

    const validationPrompt = `Validate this DClinPsy SJT question against BPS/HCPC standards.

BPS/HCPC KEY STANDARDS:
- Risk Management: Systematic assessment, proportionate response, document rationale
- Safeguarding: Child protection protocols, vulnerable adult reporting, safety priority
- Professional Boundaries: Clear therapeutic limits, avoid dual relationships
- Confidentiality: Break only when legally required, safeguarding overrides
- Cultural Competency: Acknowledge limitations, adapt approaches, avoid assumptions
- Interprofessional: Contribute expertise, communicate professionally, focus on client needs

Question: ${JSON.stringify({
      id: question.id,
      scenario: question.scenario.substring(0, 200) + "...",
      options: question.options.map(opt => opt.substring(0, 80) + "..."),
      ranking: question.correctRanking,
      category: question.category
    }, null, 2)}

VALIDATE (keep response under 500 characters):
- Scenario: realistic? clinically accurate?
- Ranking: aligns with BPS/HCPC? any issues?  
- Category: correctly assigned?
- Overall: valid/needs review/invalid?

Respond in this format:
VALID: YES/NO
CONFIDENCE: 85%
RANKING: Correct/Issue with option X
ASSESSMENT: Brief professional assessment`;

    try {
      const result = await model.generateContent(validationPrompt);
      const response = result.response.text();
      
      // Parse response
      const validMatch = response.match(/VALID:\s*(YES|NO)/i);
      const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)%/);
      const rankingMatch = response.match(/RANKING:\s*(.+)/);
      const assessmentMatch = response.match(/ASSESSMENT:\s*(.+)/);

      const validation = {
        valid: validMatch ? validMatch[1].toUpperCase() === 'YES' : false,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
        rankingAssessment: rankingMatch ? rankingMatch[1].trim() : 'Not assessed',
        overallAssessment: assessmentMatch ? assessmentMatch[1].trim() : 'Not provided',
        rawResponse: response
      };

      results.push({
        ...question,
        validation,
        validatedAt: new Date().toISOString()
      });

      const status = validation.valid ? '✅ VALID' : '⚠️ NEEDS REVIEW';
      console.log(`  ${status} (${validation.confidence}%)`);
      console.log(`  Ranking: ${validation.rankingAssessment}`);

      // Cost tracking (rough estimate)
      totalCost += 0.0002;

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({
        ...question,
        validation: {
          valid: false,
          confidence: 0,
          error: error.message
        },
        validatedAt: new Date().toISOString()
      });
    }

    // Brief pause
    if (i < questions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Generate summary
  const validCount = results.filter(r => r.validation.valid).length;
  const flaggedCount = results.filter(r => !r.validation.valid && !r.validation.error).length;
  const errorCount = results.filter(r => r.validation.error).length;
  const avgConfidence = results
    .map(r => r.validation.confidence || 0)
    .reduce((a, b) => a + b, 0) / results.length;

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalQuestions: questions.length,
      validQuestions: validCount,
      flaggedQuestions: flaggedCount,
      errorQuestions: errorCount,
      averageConfidence: Math.round(avgConfidence),
      estimatedCost: totalCost
    },
    guidelinesUsed: [
      'BPS Code of Ethics and Conduct',
      'BPS Practice Guidelines', 
      'HCPC Standards of Conduct, Performance and Ethics'
    ],
    validatedQuestions: results.filter(r => r.validation.valid),
    flaggedQuestions: results.filter(r => !r.validation.valid && !r.validation.error),
    errorQuestions: results.filter(r => r.validation.error),
    allResults: results
  };

  // Save report
  await fs.writeFile('simple-comprehensive-validation-report.json', JSON.stringify(report, null, 2));

  console.log('\n📊 VALIDATION COMPLETE');
  console.log('='.repeat(30));
  console.log(`✅ Valid: ${validCount}`);
  console.log(`⚠️ Flagged: ${flaggedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📈 Avg Confidence: ${Math.round(avgConfidence)}%`);
  console.log(`💰 Estimated Cost: $${totalCost.toFixed(4)}`);
  console.log('💾 Report: simple-comprehensive-validation-report.json');

  // Show flagged questions details
  if (flaggedCount > 0) {
    console.log('\n🔍 FLAGGED QUESTIONS:');
    results.filter(r => !r.validation.valid && !r.validation.error).forEach(q => {
      console.log(`   Q${q.id} (${q.category}): ${q.validation.rankingAssessment}`);
    });
  }

  return report;
}

if (require.main === module) {
  simpleComprehensiveValidation().catch(console.error);
}