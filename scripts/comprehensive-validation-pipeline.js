#!/usr/bin/env node

/**
 * Comprehensive DClinPsy Validation Pipeline
 * Full processing with BPS/HCPC guidelines and all questions
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
const { exec } = require('child_process');
const { promisify } = require('util');

// Model configuration with cost monitoring
const modelConfig = {
  primary: "gemini-2.5-flash",
  costLimit: 50.00,
  estimatedCostPerToken: 0.000075 / 1000,
  totalCostTracking: 0
};

class ComprehensiveValidator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = null;
    this.guidelines = {};
    this.questions = [];
    this.validatedQuestions = [];
    this.flaggedQuestions = [];
  }

  async initialize() {
    console.log('🚀 COMPREHENSIVE DCLINPSY VALIDATION PIPELINE');
    console.log('='.repeat(60));
    console.log(`💰 Cost limit: $${modelConfig.costLimit}`);
    console.log(`🤖 Model: ${modelConfig.primary}`);
    
    // Initialize Gemini model
    this.model = this.genAI.getGenerativeModel({
      model: modelConfig.primary,
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });
    
    console.log('✅ Gemini 2.5 Flash initialized');
  }

  async loadBPSHCPCGuidelines() {
    console.log('\n📚 LOADING BPS/HCPC GUIDELINES');
    console.log('='.repeat(40));
    
    const guidelinesPath = path.join(
      'DClinPsy SJT Questions, Answers, and Guidelines',
      'DClinPsy BPS and HCPC Guidelines'
    );

    try {
      // Load BPS Guidelines
      const bpsPath = path.join(guidelinesPath, 'BPS Guidelines');
      const bpsFiles = await fs.readdir(bpsPath);
      
      for (const file of bpsFiles) {
        if (file.endsWith('.pdf')) {
          console.log(`📄 Processing BPS: ${file}`);
          const filePath = path.join(bpsPath, file);
          
          try {
            const dataBuffer = await fs.readFile(filePath);
            const pdfData = await pdfParse(dataBuffer);
            
            // Clean and process text
            const cleanText = pdfData.text
              .replace(/\n\s*\n/g, '\n\n')
              .replace(/\s+/g, ' ')
              .trim();
            
            this.guidelines[`BPS_${file.replace('.pdf', '')}`] = {
              title: file,
              content: cleanText,
              length: cleanText.length,
              type: 'BPS'
            };
            
            console.log(`   ✅ Loaded: ${cleanText.length} characters`);
          } catch (pdfError) {
            console.warn(`   ⚠️  Failed to parse ${file}: ${pdfError.message}`);
          }
        }
      }

      // Load HCPC Guidelines
      const hcpcPath = path.join(guidelinesPath, 'HCPC');
      const hcpcFiles = await fs.readdir(hcpcPath);
      
      for (const file of hcpcFiles) {
        if (file.endsWith('.pdf')) {
          console.log(`📄 Processing HCPC: ${file}`);
          const filePath = path.join(hcpcPath, file);
          
          try {
            const dataBuffer = await fs.readFile(filePath);
            const pdfData = await pdfParse(dataBuffer);
            
            // Clean and process text
            const cleanText = pdfData.text
              .replace(/\n\s*\n/g, '\n\n')
              .replace(/\s+/g, ' ')
              .trim();
            
            this.guidelines[`HCPC_${file.replace('.pdf', '')}`] = {
              title: file,
              content: cleanText,
              length: cleanText.length,
              type: 'HCPC'
            };
            
            console.log(`   ✅ Loaded: ${cleanText.length} characters`);
          } catch (pdfError) {
            console.warn(`   ⚠️  Failed to parse ${file}: ${pdfError.message}`);
          }
        }
      }

      const totalGuidelines = Object.keys(this.guidelines).length;
      const totalChars = Object.values(this.guidelines).reduce((sum, g) => sum + g.length, 0);
      
      console.log(`\n📊 Guidelines Summary:`);
      console.log(`   - Files loaded: ${totalGuidelines}`);
      console.log(`   - Total content: ${totalChars.toLocaleString()} characters`);
      
      if (totalGuidelines === 0) {
        throw new Error('No guidelines were successfully loaded');
      }

      // Create focused guideline summary for validation
      await this.createGuidelinesSummary();

    } catch (error) {
      console.error('❌ Failed to load guidelines:', error.message);
      throw error;
    }
  }

  async createGuidelinesSummary() {
    console.log('\n🔬 Creating focused guidelines summary...');
    
    // Combine key sections from all guidelines
    const keyGuidelines = Object.values(this.guidelines)
      .map(g => `${g.title}:\n${g.content.substring(0, 10000)}`)
      .join('\n\n---\n\n');

    const summaryPrompt = `Extract key professional standards for DClinPsy SJT validation from these BPS/HCPC guidelines.

Focus on:
1. Professional boundaries and dual relationships
2. Risk management and safeguarding
3. Confidentiality and information sharing
4. Ethical decision-making frameworks
5. Cultural competency requirements
6. Supervision and professional development
7. Service delivery standards

Guidelines content:
${keyGuidelines.substring(0, 30000)}

Provide concise summary of key standards for each area:`;

    try {
      const response = await this.callGeminiWithTracking(summaryPrompt);
      this.guidelinesSummary = response;
      console.log(`✅ Guidelines summary created (${response.length} chars)`);
    } catch (error) {
      console.warn('⚠️  Using fallback guidelines summary');
      this.guidelinesSummary = this.createFallbackGuidelines();
    }
  }

  createFallbackGuidelines() {
    return `
BPS/HCPC Professional Standards Summary:

PROFESSIONAL BOUNDARIES:
- Maintain clear therapeutic boundaries at all times
- Avoid dual relationships that could compromise professional judgment
- Handle gifts and personal disclosure appropriately
- Manage boundary crossings transparently with supervision

RISK MANAGEMENT:
- Conduct thorough risk assessments for suicide, self-harm, and violence
- Prioritize immediate safety while respecting autonomy
- Follow proportionate response protocols
- Document all risk decisions with clear rationale

CONFIDENTIALITY & SAFEGUARDING:
- Break confidentiality only when legally required or risk is imminent
- Follow child protection procedures for under-18s
- Report vulnerable adult concerns through appropriate channels
- Balance confidentiality with duty of care

ETHICAL DECISION-MAKING:
- Apply ethical frameworks systematically
- Consider cultural and diversity factors
- Seek supervision for complex ethical dilemmas
- Document ethical reasoning clearly

CULTURAL COMPETENCY:
- Acknowledge cultural limitations honestly
- Adapt practice for cultural responsiveness
- Avoid cultural assumptions and stereotypes
- Seek cultural consultation when needed

SUPERVISION & DEVELOPMENT:
- Use supervision proactively for challenging cases
- Acknowledge limitations and seek guidance
- Engage in continuous professional development
- Reflect on practice regularly

SERVICE DELIVERY:
- Provide equitable access to services
- Manage waiting lists fairly and transparently
- Offer appropriate alternatives when services unavailable
- Maintain professional standards within service constraints
`;
  }

  async extractAllQuestions() {
    console.log('\n📄 EXTRACTING ALL QUESTIONS FROM RTF');
    console.log('='.repeat(40));
    
    // Convert RTF to plain text
    const execAsync = promisify(exec);
    const rtfPath = path.join(
      'DClinPsy SJT Questions, Answers, and Guidelines',
      'DClinPsy SJT Questions and Answers.rtf'
    );
    const tempTxtFile = '/tmp/dclinpsy_full_questions.txt';
    
    await execAsync(`textutil -convert txt "${rtfPath}" -output "${tempTxtFile}"`);
    const plainText = await fs.readFile(tempTxtFile, 'utf8');
    
    console.log(`📊 Converted RTF: ${plainText.length.toLocaleString()} characters`);

    // Use Gemini to extract all questions systematically
    const extractPrompt = `Extract ALL complete DClinPsy SJT questions from this text.

STRICT REQUIREMENTS:
1. Each question must have:
   - A clinical scenario (the situation description)
   - Exactly 5 response options 
   - Clear ranking information (which option is ranked 1-5)

2. Return JSON array with this EXACT structure:
[
  {
    "id": <question_number>,
    "scenario": "<complete scenario text>",
    "options": [
      "option 1 text",
      "option 2 text", 
      "option 3 text",
      "option 4 text",
      "option 5 text"
    ],
    "originalRanking": [1,2,3,4,5],
    "category": "Risk Management|Professional Boundaries|Ethical Dilemmas|etc",
    "hasDetailedFeedback": true|false
  }
]

Extract questions systematically. Look for patterns like:
- "## Question X"
- "Rank the following actions from 1 (most appropriate) to 5 (least appropriate)"
- "**Ideal ranking: X**"

Process this text in sections to ensure completeness.

Text (first 40,000 characters):
${plainText.substring(0, 40000)}`;

    try {
      const response = await this.callGeminiWithTracking(extractPrompt);
      
      // Parse JSON response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in extraction response');
      }

      const extractedQuestions = JSON.parse(this.cleanJSON(jsonMatch[0]));
      console.log(`✅ Extracted ${extractedQuestions.length} questions from first section`);

      // Process remaining sections if needed
      const sectionSize = 40000;
      let allQuestions = [...extractedQuestions];
      
      for (let i = sectionSize; i < plainText.length; i += sectionSize) {
        const section = plainText.substring(i, i + sectionSize);
        const sectionPrompt = `Continue extracting DClinPsy questions from this text section.
        
Return only NEW questions not already found. Use same JSON format.

Section text:
${section}`;

        try {
          const sectionResponse = await this.callGeminiWithTracking(sectionPrompt);
          const sectionMatch = sectionResponse.match(/\[[\s\S]*\]/);
          
          if (sectionMatch) {
            const sectionQuestions = JSON.parse(this.cleanJSON(sectionMatch[0]));
            
            // Avoid duplicates by ID
            const newQuestions = sectionQuestions.filter(
              newQ => !allQuestions.some(existingQ => existingQ.id === newQ.id)
            );
            
            allQuestions.push(...newQuestions);
            console.log(`✅ Section ${Math.floor(i/sectionSize) + 1}: +${newQuestions.length} questions`);
          }
        } catch (sectionError) {
          console.warn(`⚠️  Section ${Math.floor(i/sectionSize) + 1} failed: ${sectionError.message}`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      this.questions = allQuestions;
      console.log(`\n📊 Total questions extracted: ${this.questions.length}`);

      // Category breakdown
      const categories = {};
      this.questions.forEach(q => {
        categories[q.category] = (categories[q.category] || 0) + 1;
      });
      
      console.log('\n📊 Category breakdown:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
      });

    } catch (error) {
      console.error('❌ Question extraction failed:', error.message);
      throw error;
    } finally {
      await fs.remove(tempTxtFile);
    }
  }

  cleanJSON(jsonString) {
    return jsonString
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/([^\\])'/g, '$1"')
      .replace(/\\'/g, "'");
  }

  async validateAllQuestions() {
    console.log('\n🔬 COMPREHENSIVE QUESTION VALIDATION');
    console.log('='.repeat(40));
    
    const batchSize = 2; // Process 2 questions at a time
    const batches = [];
    
    for (let i = 0; i < this.questions.length; i += batchSize) {
      batches.push(this.questions.slice(i, i + batchSize));
    }

    console.log(`📋 Processing ${this.questions.length} questions in ${batches.length} batches`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n📋 Batch ${i + 1}/${batches.length} (${batch.length} questions)`);

      // Check cost before processing
      if (modelConfig.totalCostTracking > modelConfig.costLimit * 0.9) {
        console.log('💰 Approaching cost limit, stopping validation');
        break;
      }

      await this.validateBatch(batch, i + 1);

      // Rate limiting between batches
      if (i < batches.length - 1) {
        console.log('⏱️  Waiting 3s before next batch...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`\n📊 Validation complete:`);
    console.log(`   ✅ Valid: ${this.validatedQuestions.length}`);
    console.log(`   ⚠️  Flagged: ${this.flaggedQuestions.length}`);
    console.log(`   💰 Total cost: $${modelConfig.totalCostTracking.toFixed(4)}`);
  }

  async validateBatch(batch, batchNum) {
    const validationPrompt = `Validate these DClinPsy SJT questions against BPS/HCPC professional standards.

BPS/HCPC GUIDELINES SUMMARY:
${this.guidelinesSummary}

VALIDATION CRITERIA:
1. Scenario accuracy and realism
2. Option ranking correctness per BPS/HCPC standards
3. Professional appropriateness of all options
4. Comprehensive coverage of key considerations

For each question, provide:
{
  "id": <question_id>,
  "validationStatus": "valid|needs_review|invalid",
  "confidenceScore": <0-100>,
  "category": "<verified_category>",
  "rankingIssues": ["specific ranking problems if any"],
  "optionIssues": ["problems with specific options"],
  "guidelineReferences": ["BPS Standard X.X", "HCPC Requirement Y"],
  "recommendedRanking": [1,2,3,4,5],
  "improvementSuggestions": ["specific improvements needed"],
  "overallAssessment": "detailed professional assessment"
}

Questions to validate:
${JSON.stringify(batch, null, 2)}

Return JSON array with validation results:`;

    try {
      const response = await this.callGeminiWithTracking(validationPrompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const validations = JSON.parse(this.cleanJSON(jsonMatch[0]));
        
        validations.forEach((validation, idx) => {
          const originalQuestion = batch[idx];
          const validatedQuestion = {
            ...originalQuestion,
            validation,
            validatedAt: new Date().toISOString(),
            batchNumber: batchNum
          };

          if (validation.validationStatus === 'valid') {
            this.validatedQuestions.push(validatedQuestion);
            console.log(`  ✅ Q${validation.id}: Valid (${validation.confidenceScore}%)`);
          } else {
            this.flaggedQuestions.push(validatedQuestion);
            console.log(`  ⚠️  Q${validation.id}: ${validation.validationStatus} (${validation.confidenceScore}%)`);
            if (validation.rankingIssues?.length > 0) {
              console.log(`     Ranking issues: ${validation.rankingIssues.length}`);
            }
          }
        });
      } else {
        console.error(`❌ Batch ${batchNum}: No JSON response found`);
      }

    } catch (error) {
      console.error(`❌ Batch ${batchNum} failed: ${error.message}`);
      
      // Add batch questions as errors for tracking
      batch.forEach(q => {
        this.flaggedQuestions.push({
          ...q,
          validation: {
            validationStatus: 'error',
            error: error.message,
            confidenceScore: 0
          },
          validatedAt: new Date().toISOString(),
          batchNumber: batchNum
        });
      });
    }
  }

  async callGeminiWithTracking(prompt) {
    // Cost tracking
    const inputTokens = prompt.length / 4;
    const estimatedCost = inputTokens * modelConfig.estimatedCostPerToken;
    
    if (modelConfig.totalCostTracking + estimatedCost > modelConfig.costLimit) {
      throw new Error(`Cost limit of $${modelConfig.costLimit} would be exceeded`);
    }

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    
    // Update cost tracking
    const outputTokens = response.length / 4;
    const totalCost = (inputTokens + outputTokens) * modelConfig.estimatedCostPerToken;
    modelConfig.totalCostTracking += totalCost;

    return response;
  }

  async generateComprehensiveReport() {
    console.log('\n📊 GENERATING COMPREHENSIVE REPORT');
    console.log('='.repeat(40));

    const report = {
      generatedAt: new Date().toISOString(),
      pipeline: 'comprehensive',
      summary: {
        totalQuestions: this.questions.length,
        validQuestions: this.validatedQuestions.length,
        flaggedQuestions: this.flaggedQuestions.length,
        errorQuestions: this.flaggedQuestions.filter(q => q.validation.validationStatus === 'error').length,
        estimatedCost: modelConfig.totalCostTracking,
        averageConfidence: this.calculateAverageConfidence()
      },
      guidelines: {
        loaded: Object.keys(this.guidelines).length,
        totalContent: Object.values(this.guidelines).reduce((sum, g) => sum + g.length, 0),
        files: Object.values(this.guidelines).map(g => ({
          title: g.title,
          type: g.type,
          length: g.length
        }))
      },
      categoryAnalysis: this.analyzeCategoriesValidation(),
      flaggedQuestionsDetails: this.flaggedQuestions.map(q => ({
        id: q.id,
        category: q.category,
        validationStatus: q.validation.validationStatus,
        confidenceScore: q.validation.confidenceScore || 0,
        issues: [
          ...(q.validation.rankingIssues || []),
          ...(q.validation.optionIssues || [])
        ],
        recommendations: q.validation.improvementSuggestions || [],
        guidelineReferences: q.validation.guidelineReferences || []
      })),
      validatedQuestions: this.validatedQuestions,
      nextSteps: this.generateNextSteps()
    };

    await fs.writeFile('comprehensive-validation-report.json', JSON.stringify(report, null, 2));
    
    console.log('📁 Report saved: comprehensive-validation-report.json');
    console.log(`💰 Total cost: $${report.summary.estimatedCost.toFixed(4)}`);
    
    return report;
  }

  calculateAverageConfidence() {
    const allValidations = [...this.validatedQuestions, ...this.flaggedQuestions];
    const confidenceScores = allValidations
      .map(q => q.validation.confidenceScore || 0)
      .filter(score => score > 0);
    
    return confidenceScores.length > 0 
      ? Math.round(confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length)
      : 0;
  }

  analyzeCategoriesValidation() {
    const categories = {};
    
    [...this.validatedQuestions, ...this.flaggedQuestions].forEach(q => {
      const category = q.category || 'Unknown';
      if (!categories[category]) {
        categories[category] = { total: 0, valid: 0, flagged: 0 };
      }
      
      categories[category].total++;
      if (q.validation.validationStatus === 'valid') {
        categories[category].valid++;
      } else {
        categories[category].flagged++;
      }
    });

    return categories;
  }

  generateNextSteps() {
    return [
      `Review ${this.flaggedQuestions.length} flagged questions manually`,
      'Implement recommended ranking corrections',
      'Add BPS/HCPC specific feedback to valid questions', 
      'Create subject matter expert review process',
      'Integrate validated questions into website',
      'Set up ongoing validation pipeline for new questions'
    ];
  }

  async runComprehensivePipeline() {
    try {
      await this.initialize();
      await this.loadBPSHCPCGuidelines();
      await this.extractAllQuestions();
      await this.validateAllQuestions();
      const report = await this.generateComprehensiveReport();
      
      console.log('\n🎉 COMPREHENSIVE VALIDATION COMPLETE');
      console.log('='.repeat(50));
      
      return report;
      
    } catch (error) {
      console.error('\n❌ PIPELINE FAILED');
      console.error('='.repeat(30));
      console.error('Error:', error.message);
      throw error;
    }
  }
}

// Run comprehensive pipeline
async function main() {
  const validator = new ComprehensiveValidator();
  await validator.runComprehensivePipeline();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ComprehensiveValidator };