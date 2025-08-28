#!/usr/bin/env node

/**
 * Validate Extracted Questions
 * Run comprehensive validation on the manually extracted questions
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');

class ExtractedQuestionValidator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = null;
    this.guidelines = {};
    this.guidelinesSummary = '';
    this.totalCostTracking = 0;
    this.costLimit = 50.00;
    this.estimatedCostPerToken = 0.000075 / 1000;
  }

  async initialize() {
    console.log('🚀 EXTRACTED QUESTIONS VALIDATION');
    console.log('='.repeat(50));
    
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });
    
    console.log('✅ Gemini 2.5 Flash initialized');
    await this.loadBPSHCPCGuidelines();
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
          console.log(`📄 Loading BPS: ${file}`);
          const filePath = path.join(bpsPath, file);
          const dataBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(dataBuffer);
          
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
          
          console.log(`   ✅ ${cleanText.length} characters`);
        }
      }

      // Load HCPC Guidelines
      const hcpcPath = path.join(guidelinesPath, 'HCPC');
      const hcpcFiles = await fs.readdir(hcpcPath);
      
      for (const file of hcpcFiles) {
        if (file.endsWith('.pdf')) {
          console.log(`📄 Loading HCPC: ${file}`);
          const filePath = path.join(hcpcPath, file);
          const dataBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(dataBuffer);
          
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
          
          console.log(`   ✅ ${cleanText.length} characters`);
        }
      }

      const totalGuidelines = Object.keys(this.guidelines).length;
      const totalChars = Object.values(this.guidelines).reduce((sum, g) => sum + g.length, 0);
      
      console.log(`\n📊 Guidelines loaded: ${totalGuidelines} files, ${totalChars.toLocaleString()} characters`);
      
      // Create focused summary
      await this.createGuidelinesSummary();

    } catch (error) {
      console.error('❌ Failed to load guidelines:', error.message);
      this.guidelinesSummary = this.createFallbackGuidelines();
    }
  }

  async createGuidelinesSummary() {
    console.log('🔬 Creating BPS/HCPC validation standards...');
    
    // Use key sections from loaded guidelines
    const keyGuidelines = Object.values(this.guidelines)
      .map(g => `${g.title}:\n${g.content.substring(0, 5000)}`)
      .join('\n\n---\n\n');

    const summaryPrompt = `Extract specific professional standards for DClinPsy SJT validation from these BPS/HCPC guidelines.

Create detailed validation criteria for:
1. Risk Management & Safeguarding
2. Professional Boundaries 
3. Confidentiality & Information Sharing
4. Cultural Competency & Diversity
5. Interprofessional Working
6. Service Delivery Standards
7. Professional Development

For each area, provide specific standards and requirements that can be used to validate SJT question rankings.

Guidelines:
${keyGuidelines.substring(0, 20000)}

Provide detailed professional standards summary:`;

    try {
      const response = await this.callGeminiWithTracking(summaryPrompt);
      this.guidelinesSummary = response;
      console.log(`✅ Standards created (${response.length} chars)`);
    } catch (error) {
      console.warn('⚠️  Using fallback standards');
      this.guidelinesSummary = this.createFallbackGuidelines();
    }
  }

  createFallbackGuidelines() {
    return `
COMPREHENSIVE BPS/HCPC PROFESSIONAL STANDARDS FOR SJT VALIDATION:

RISK MANAGEMENT & SAFEGUARDING:
- Conduct systematic risk assessment for suicide, self-harm, violence
- Prioritize immediate safety while respecting client autonomy
- Use proportionate responses based on assessed risk level
- Document all risk decisions with clear professional rationale
- Balance therapeutic relationship with safety obligations
- Follow child protection procedures for under-18s
- Report vulnerable adult concerns through appropriate channels

PROFESSIONAL BOUNDARIES:
- Maintain clear therapeutic boundaries in all contexts
- Avoid dual relationships that compromise professional judgment
- Handle gifts, social contact, and personal disclosure appropriately
- Recognize boundary crossings vs boundary violations
- Use supervision to navigate complex boundary situations
- Maintain professional relationship both in and outside clinical settings

CONFIDENTIALITY & INFORMATION SHARING:
- Maintain confidentiality except when legally required to break it
- Balance client confidentiality with duty of care and public protection
- Follow safeguarding protocols that override confidentiality when necessary
- Obtain appropriate consent for information sharing where possible
- Use transparency about limits of confidentiality from start of therapy
- Document decisions about information sharing with clear rationale

CULTURAL COMPETENCY & DIVERSITY:
- Acknowledge personal and professional limitations regarding cultural knowledge
- Adapt therapeutic approaches for cultural responsiveness
- Avoid cultural assumptions, stereotypes, and imposing Western values
- Seek cultural consultation and additional training when needed
- Respect diverse worldviews, family structures, and decision-making processes
- Address power dynamics and structural inequalities in therapy

INTERPROFESSIONAL WORKING:
- Contribute psychological expertise to multidisciplinary decisions
- Communicate professionally even when facing disagreement or dismissal
- Maintain focus on client/patient best interests in team conflicts
- Use appropriate channels for addressing professional disagreements
- Balance professional autonomy with collaborative working
- Respect other professionals' expertise while advocating for psychological perspectives

SERVICE DELIVERY:
- Provide equitable access to services regardless of background
- Manage waiting lists and service constraints fairly and transparently
- Adapt communication style for different audiences (clients, colleagues, courts)
- Seek feedback and engage in continuous improvement
- Work within service parameters while advocating for appropriate care
- Document service limitations and their impact on care quality

PROFESSIONAL DEVELOPMENT:
- Use supervision proactively for challenging cases and professional growth
- Acknowledge mistakes and limitations openly and professionally
- Engage in reflective practice and continuous learning
- Seek additional training and consultation when needed
- Accept feedback constructively and work on identified areas for improvement
- Model professional behavior and ethical decision-making
`;
  }

  async validateExtractedQuestions() {
    console.log('\n🔬 COMPREHENSIVE VALIDATION OF EXTRACTED QUESTIONS');
    console.log('='.repeat(55));
    
    // Load extracted questions
    const questions = JSON.parse(await fs.readFile('manually-parsed-questions.json', 'utf8'));
    console.log(`📚 Loaded ${questions.length} extracted questions`);

    const validatedQuestions = [];
    const flaggedQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`\n📋 Validating Question ${question.id} (${question.category})`);

      const validation = await this.validateSingleQuestion(question);
      
      const validatedQuestion = {
        ...question,
        validation,
        validatedAt: new Date().toISOString()
      };

      if (validation.validationStatus === 'valid') {
        validatedQuestions.push(validatedQuestion);
        console.log(`  ✅ Valid (${validation.confidenceScore}% confidence)`);
      } else {
        flaggedQuestions.push(validatedQuestion);
        console.log(`  ⚠️  ${validation.validationStatus} (${validation.confidenceScore}% confidence)`);
        if (validation.rankingIssues?.length > 0) {
          console.log(`     🔍 ${validation.rankingIssues.length} ranking issues identified`);
        }
      }

      // Rate limiting
      if (i < questions.length - 1) {
        console.log('     ⏱️  Waiting 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Generate comprehensive report
    const report = await this.generateValidationReport(validatedQuestions, flaggedQuestions, questions);
    
    console.log('\n📊 VALIDATION COMPLETE');
    console.log('='.repeat(30));
    console.log(`✅ Valid: ${validatedQuestions.length}`);
    console.log(`⚠️  Flagged: ${flaggedQuestions.length}`);
    console.log(`💰 Cost: $${this.totalCostTracking.toFixed(4)}`);
    
    return report;
  }

  async validateSingleQuestion(question) {
    const validationPrompt = `Comprehensively validate this DClinPsy SJT question against BPS/HCPC professional standards.

BPS/HCPC PROFESSIONAL STANDARDS:
${this.guidelinesSummary}

QUESTION TO VALIDATE:
${JSON.stringify(question, null, 2)}

COMPREHENSIVE VALIDATION REQUIREMENTS:
1. Assess scenario realism and clinical accuracy
2. Evaluate each option for professional appropriateness
3. Verify ranking aligns with BPS/HCPC standards
4. Check for any cultural, diversity, or accessibility issues
5. Ensure feedback accuracy against professional guidelines

Provide detailed validation in this format:
{
  "validationStatus": "valid|needs_review|invalid",
  "confidenceScore": <0-100>,
  "scenarioAssessment": {
    "realistic": true|false,
    "clinicallyAccurate": true|false,
    "issues": ["specific scenario problems"]
  },
  "optionAnalysis": [
    {
      "optionNumber": 1,
      "professionallyAppropriate": true|false,
      "alignsWithGuidelines": true|false,
      "issues": ["specific problems with this option"]
    }
  ],
  "rankingValidation": {
    "currentRanking": [1,2,3,4,5],
    "recommendedRanking": [1,2,3,4,5],
    "rankingIssues": ["specific ranking problems"],
    "guidelineReferences": ["BPS Standard X.X", "HCPC Requirement Y"]
  },
  "feedbackAccuracy": {
    "accurateToGuidelines": true|false,
    "missingReferences": ["guidelines that should be cited"],
    "inaccurateStatements": ["specific inaccuracies in feedback"]
  },
  "overallAssessment": "detailed professional assessment with specific BPS/HCPC references",
  "improvementRecommendations": ["specific suggestions for enhancement"]
}

Return only the JSON validation object:`;

    try {
      const response = await this.callGeminiWithTracking(validationPrompt);
      
      // Extract and parse JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanJson = this.cleanJSON(jsonMatch[0]);
        return JSON.parse(cleanJson);
      } else {
        throw new Error('No JSON found in validation response');
      }
    } catch (error) {
      console.error(`  ❌ Validation error: ${error.message}`);
      return {
        validationStatus: 'error',
        confidenceScore: 0,
        error: error.message,
        overallAssessment: 'Validation failed due to processing error'
      };
    }
  }

  cleanJSON(jsonString) {
    return jsonString
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/([^\\])'/g, '$1"')
      .replace(/\\'/g, "'")
      .replace(/(\w+):/g, '"$1":');
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

  async generateValidationReport(validatedQuestions, flaggedQuestions, allQuestions) {
    const report = {
      generatedAt: new Date().toISOString(),
      pipeline: 'comprehensive_extracted_validation',
      summary: {
        totalQuestions: allQuestions.length,
        validQuestions: validatedQuestions.length,
        flaggedQuestions: flaggedQuestions.length,
        estimatedCost: this.totalCostTracking,
        guidelinesLoaded: Object.keys(this.guidelines).length,
        averageConfidence: this.calculateAverageConfidence(validatedQuestions, flaggedQuestions)
      },
      guidelinesUsed: Object.values(this.guidelines).map(g => g.title),
      detailedResults: {
        validQuestions: validatedQuestions.map(q => ({
          id: q.id,
          category: q.category,
          confidenceScore: q.validation.confidenceScore,
          overallAssessment: q.validation.overallAssessment
        })),
        flaggedQuestions: flaggedQuestions.map(q => ({
          id: q.id,
          category: q.category,
          validationStatus: q.validation.validationStatus,
          confidenceScore: q.validation.confidenceScore || 0,
          rankingIssues: q.validation.rankingIssues || [],
          improvements: q.validation.improvementRecommendations || [],
          overallAssessment: q.validation.overallAssessment
        }))
      },
      fullValidationData: [...validatedQuestions, ...flaggedQuestions],
      nextSteps: [
        `Review ${flaggedQuestions.length} flagged questions manually`,
        'Implement BPS/HCPC specific ranking corrections',
        'Enhance question feedback with specific guideline references',
        'Scale up parsing to process remaining 55+ questions',
        'Create subject matter expert review process'
      ]
    };

    await fs.writeFile('comprehensive-extracted-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Report saved: comprehensive-extracted-validation-report.json');
    
    return report;
  }

  calculateAverageConfidence(validatedQuestions, flaggedQuestions) {
    const allValidations = [...validatedQuestions, ...flaggedQuestions];
    const confidenceScores = allValidations
      .map(q => q.validation.confidenceScore || 0)
      .filter(score => score > 0);
    
    return confidenceScores.length > 0 
      ? Math.round(confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length)
      : 0;
  }

  async run() {
    try {
      await this.initialize();
      return await this.validateExtractedQuestions();
    } catch (error) {
      console.error('\n❌ VALIDATION FAILED');
      console.error('Error:', error.message);
      throw error;
    }
  }
}

// Run validation
async function main() {
  const validator = new ExtractedQuestionValidator();
  await validator.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ExtractedQuestionValidator };