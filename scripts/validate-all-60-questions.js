#!/usr/bin/env node

/**
 * Validate All 60 Questions
 * Comprehensive BPS/HCPC validation of all extracted questions
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');

class All60QuestionsValidator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = null;
    this.totalCostTracking = 0;
    this.costLimit = 50.00;
    this.estimatedCostPerToken = 0.000075 / 1000;
    this.validatedQuestions = [];
    this.highConfidenceQuestions = [];
  }

  async initialize() {
    console.log('🚀 VALIDATING ALL 60 DCLINPSY QUESTIONS');
    console.log('='.repeat(60));
    console.log(`💰 Budget: $${this.costLimit}`);
    console.log(`🎯 Goal: Validate all questions against BPS/HCPC standards`);
    
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024, // Keep responses concise
      }
    });
    
    console.log('✅ Gemini 2.5 Flash ready');
    
    // Create comprehensive validation standards
    this.validationStandards = `
BPS/HCPC VALIDATION STANDARDS:

RISK MANAGEMENT:
- Systematic assessment: plans, means, intent, protective factors
- Proportionate response: balance safety with autonomy
- Documentation required for all risk decisions
- BPS: "Prioritize client safety through evidence-based assessment"

SAFEGUARDING:
- Children (under-18): protection overrides confidentiality
- Vulnerable adults: cognitive impairment, self-neglect indicators
- Mandatory reporting when harm risk identified
- HCPC: "Take appropriate action to protect vulnerable individuals"

PROFESSIONAL BOUNDARIES:
- Therapeutic limits: gifts, social contact, dual relationships
- Consistent boundaries in all contexts
- Cultural adaptation while maintaining professional integrity
- BPS: "Maintain clear boundaries to preserve treatment integrity"

CONFIDENTIALITY:
- Break only when legally required or consent given
- Imminent harm overrides confidentiality
- Transparency about limits from therapy start
- Balance with duty of care obligations

SERVICE DELIVERY:
- Equitable access regardless of background
- Fair resource allocation and waiting list management
- Accessible communication for diverse audiences
- Transparency about service limitations

CULTURAL COMPETENCY:
- Acknowledge personal/professional limitations
- Adapt approaches for cultural responsiveness
- Avoid stereotypes and assumptions
- Address power dynamics and structural inequalities

INTERPROFESSIONAL WORKING:
- Contribute psychological expertise to team decisions
- Professional communication during disagreements
- Focus on service user needs over professional conflicts
- Use appropriate channels for dispute resolution

PROFESSIONAL DEVELOPMENT:
- Proactive supervision use for challenging cases
- Accept feedback constructively
- Acknowledge limitations and seek training
- Continuous reflective practice
`;
  }

  async validateAllQuestions() {
    console.log('\n📚 LOADING ALL EXTRACTED QUESTIONS');
    console.log('='.repeat(40));
    
    const questions = JSON.parse(await fs.readFile('directly-extracted-questions.json', 'utf8'));
    console.log(`📊 Loaded: ${questions.length} questions`);
    
    // Show category breakdown
    const categories = {};
    questions.forEach(q => {
      categories[q.category] = (categories[q.category] || 0) + 1;
    });
    
    console.log('📊 Categories:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

    console.log('\n🔬 STARTING COMPREHENSIVE VALIDATION');
    console.log('='.repeat(50));
    
    // Process in batches of 3 to manage costs and API limits
    const batchSize = 3;
    const batches = [];
    
    for (let i = 0; i < questions.length; i += batchSize) {
      batches.push(questions.slice(i, i + batchSize));
    }
    
    console.log(`📋 Processing ${questions.length} questions in ${batches.length} batches`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n📋 Batch ${i + 1}/${batches.length} (${batch.length} questions)`);
      
      // Check budget
      if (this.totalCostTracking > this.costLimit * 0.9) {
        console.log('💰 Approaching budget limit, stopping validation');
        break;
      }
      
      await this.validateBatch(batch, i + 1);
      
      // Rate limiting
      if (i < batches.length - 1) {
        console.log('   ⏱️  Waiting 3s...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Generate final results
    await this.generateFinalReport(questions);
  }

  async validateBatch(batch, batchNum) {
    for (let i = 0; i < batch.length; i++) {
      const question = batch[i];
      console.log(`   📋 Q${question.id} (${question.category})`);
      
      const validation = await this.validateSingleQuestion(question);
      
      const validatedQuestion = {
        ...question,
        validation,
        validatedAt: new Date().toISOString(),
        batchNumber: batchNum
      };
      
      this.validatedQuestions.push(validatedQuestion);
      
      // Check confidence level
      if (validation.confidence >= 95 && validation.valid) {
        this.highConfidenceQuestions.push(validatedQuestion);
        console.log(`      ✅ HIGH CONFIDENCE: ${validation.confidence}%`);
      } else if (validation.valid) {
        console.log(`      ✅ Valid: ${validation.confidence}%`);
      } else if (validation.error) {
        console.log(`      ❌ Error: ${validation.error}`);
      } else {
        console.log(`      ⚠️  Flagged: ${validation.confidence}%`);
      }
      
      // Brief pause between questions
      if (i < batch.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async validateSingleQuestion(question) {
    const validationPrompt = `Validate DClinPsy SJT question against BPS/HCPC standards.

STANDARDS:
${this.validationStandards}

QUESTION:
ID: ${question.id}
Category: ${question.category}
Scenario: ${question.scenario.substring(0, 200)}...
Options: ${question.options.map((opt, i) => `${i+1}. ${opt.substring(0, 60)}...`).join(' | ')}
Ranking: ${question.correctRanking.join(',')}

VALIDATE:
1. Scenario realistic for ${question.category}?
2. Options appropriate for professional practice?
3. Ranking aligns with BPS/HCPC standards?
4. Category correctly assigned?

Format response exactly as:
VALID: YES/NO
CONFIDENCE: [0-100]%
RANKING: CORRECT/ISSUE
CATEGORY: CORRECT/INCORRECT
ASSESSMENT: [Brief professional assessment with BPS/HCPC reference if applicable]`;

    try {
      const response = await this.callGeminiWithTracking(validationPrompt);
      
      // Parse response
      const validMatch = response.match(/VALID:\s*(YES|NO)/i);
      const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)%?/);
      const rankingMatch = response.match(/RANKING:\s*(CORRECT|ISSUE)/i);
      const categoryMatch = response.match(/CATEGORY:\s*(CORRECT|INCORRECT)/i);
      const assessmentMatch = response.match(/ASSESSMENT:\s*(.+)/s);

      return {
        valid: validMatch ? validMatch[1].toUpperCase() === 'YES' : false,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
        rankingStatus: rankingMatch ? rankingMatch[1].toUpperCase() : 'UNKNOWN',
        categoryStatus: categoryMatch ? categoryMatch[1].toUpperCase() : 'UNKNOWN',
        assessment: assessmentMatch ? assessmentMatch[1].trim().substring(0, 500) : 'No assessment provided',
        rawResponse: response.substring(0, 1000) // Truncate for storage
      };

    } catch (error) {
      return {
        valid: false,
        confidence: 0,
        error: error.message,
        assessment: 'Validation failed due to error'
      };
    }
  }

  async callGeminiWithTracking(prompt) {
    const inputTokens = prompt.length / 4;
    const estimatedCost = inputTokens * this.estimatedCostPerToken;
    
    if (this.totalCostTracking + estimatedCost > this.costLimit) {
      throw new Error(`Cost limit of $${this.costLimit} would be exceeded`);
    }

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    
    const outputTokens = response.length / 4;
    const totalCost = (inputTokens + outputTokens) * this.estimatedCostPerToken;
    this.totalCostTracking += totalCost;

    return response;
  }

  async generateFinalReport(allQuestions) {
    console.log('\n📊 GENERATING COMPREHENSIVE VALIDATION REPORT');
    console.log('='.repeat(50));
    
    const validCount = this.validatedQuestions.filter(q => q.validation.valid).length;
    const flaggedCount = this.validatedQuestions.filter(q => !q.validation.valid && !q.validation.error).length;
    const errorCount = this.validatedQuestions.filter(q => q.validation.error).length;
    
    const avgConfidence = this.validatedQuestions
      .filter(q => q.validation.confidence > 0)
      .reduce((sum, q, _, arr) => sum + q.validation.confidence / arr.length, 0);

    const report = {
      generatedAt: new Date().toISOString(),
      pipeline: 'all_60_questions_validation',
      summary: {
        totalQuestions: allQuestions.length,
        processedQuestions: this.validatedQuestions.length,
        validQuestions: validCount,
        highConfidenceQuestions: this.highConfidenceQuestions.length,
        flaggedQuestions: flaggedCount,
        errorQuestions: errorCount,
        averageConfidence: Math.round(avgConfidence),
        totalCost: this.totalCostTracking
      },
      categoryBreakdown: this.generateCategoryBreakdown(),
      highConfidenceQuestions: this.highConfidenceQuestions.map(q => ({
        id: q.id,
        category: q.category,
        confidence: q.validation.confidence,
        assessment: q.validation.assessment.substring(0, 200)
      })),
      flaggedQuestions: this.validatedQuestions
        .filter(q => !q.validation.valid && !q.validation.error)
        .map(q => ({
          id: q.id,
          category: q.category,
          confidence: q.validation.confidence,
          rankingStatus: q.validation.rankingStatus,
          categoryStatus: q.validation.categoryStatus,
          issues: q.validation.assessment.substring(0, 200)
        })),
      allResults: this.validatedQuestions
    };

    // Save comprehensive report
    await fs.writeFile('all-60-validation-report.json', JSON.stringify(report, null, 2));
    
    // Save high confidence questions separately
    await fs.writeFile('high-confidence-validated-questions.json', JSON.stringify(this.highConfidenceQuestions, null, 2));
    
    console.log('\n🎉 VALIDATION COMPLETE');
    console.log('='.repeat(30));
    console.log(`📚 Processed: ${this.validatedQuestions.length}/${allQuestions.length}`);
    console.log(`✅ Valid: ${validCount} (${Math.round(validCount/this.validatedQuestions.length*100)}%)`);
    console.log(`🏆 High Confidence (95%+): ${this.highConfidenceQuestions.length}`);
    console.log(`⚠️  Flagged: ${flaggedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📈 Avg Confidence: ${Math.round(avgConfidence)}%`);
    console.log(`💰 Total Cost: $${this.totalCostTracking.toFixed(4)}`);
    console.log('\n💾 Files saved:');
    console.log('   - all-60-validation-report.json');
    console.log('   - high-confidence-validated-questions.json');
    
    if (this.highConfidenceQuestions.length > 0) {
      console.log(`\n🏆 HIGH CONFIDENCE QUESTIONS READY FOR DEPLOYMENT:`);
      this.highConfidenceQuestions.forEach(q => {
        console.log(`   Q${q.id} (${q.category}): ${q.validation.confidence}%`);
      });
    }
    
    return report;
  }

  generateCategoryBreakdown() {
    const breakdown = {};
    
    this.validatedQuestions.forEach(q => {
      const category = q.category;
      if (!breakdown[category]) {
        breakdown[category] = {
          total: 0,
          valid: 0,
          highConfidence: 0,
          flagged: 0
        };
      }
      
      breakdown[category].total++;
      
      if (q.validation.valid) {
        breakdown[category].valid++;
        
        if (q.validation.confidence >= 95) {
          breakdown[category].highConfidence++;
        }
      } else {
        breakdown[category].flagged++;
      }
    });
    
    return breakdown;
  }

  async run() {
    try {
      await this.initialize();
      await this.validateAllQuestions();
    } catch (error) {
      console.error('\n❌ VALIDATION PIPELINE FAILED');
      console.error('Error:', error.message);
      throw error;
    }
  }
}

async function main() {
  const validator = new All60QuestionsValidator();
  await validator.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { All60QuestionsValidator };