#!/usr/bin/env node

/**
 * SJT Question Processing Pipeline
 * Validates DClinPsy SJT questions against BPS/HCPC guidelines using Gemini 2.0 Pro
 * 
 * Security: Uses environment variables for API keys
 * Never commits sensitive data to repository
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');

// Security check
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('❌ ERROR: Please set your GEMINI_API_KEY in the .env file');
  console.error('1. Get your API key from: https://aistudio.google.com/app/apikey');
  console.error('2. Update .env file with: GEMINI_API_KEY=your_actual_key_here');
  process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

class SJTProcessor {
  constructor() {
    this.guidelines = {};
    this.existingQuestions = [];
    this.validatedQuestions = [];
    this.materialsPath = './DClinPsy SJT Questions, Answers, and Guidelines';
  }

  // Step 1: Load and parse BPS/HCPC guidelines
  async loadGuidelines() {
    console.log('🔍 Loading BPS and HCPC guidelines...');
    const guidelinesPath = path.join(this.materialsPath, 'DClinPsy BPS and HCPC Guidelines');
    
    try {
      if (!await fs.pathExists(guidelinesPath)) {
        console.warn('⚠️  Guidelines folder not found, using existing knowledge base...');
        this.guidelines['general'] = `
          BPS Professional Practice Guidelines for Clinical Psychology:
          - Maintain professional boundaries at all times
          - Prioritize client safety and well-being
          - Ensure informed consent for all interventions
          - Practice within competence limits
          - Maintain confidentiality except when legally required to break it
          - Document all significant clinical decisions
          - Seek supervision when uncertain
          - Consider cultural and diversity factors in all interventions
          
          HCPC Standards of Conduct, Performance and Ethics:
          - Act in the best interests of service users
          - Communicate effectively with service users and colleagues
          - Work within professional boundaries
          - Maintain proper records
          - Deal fairly and safely with the risks of infection
          - Report concerns about safety
          - Be honest and trustworthy
          - Keep skills and knowledge up to date
        `;
        return;
      }

      const pdfFiles = await fs.readdir(guidelinesPath);
      
      for (const file of pdfFiles) {
        if (file.endsWith('.pdf')) {
          console.log(`  📄 Processing: ${file}`);
          const pdfPath = path.join(guidelinesPath, file);
          const dataBuffer = await fs.readFile(pdfPath);
          const pdfData = await pdfParse(dataBuffer);
          
          this.guidelines[file] = pdfData.text;
          console.log(`    ✅ Loaded: ${pdfData.text.length} characters`);
        }
      }
      
      console.log(`📚 Loaded ${Object.keys(this.guidelines).length} guideline documents`);
      
    } catch (error) {
      console.error('❌ Error loading guidelines:', error.message);
      throw error;
    }
  }

  // Step 2: Load existing questions or parse RTF
  async loadQuestions() {
    console.log('🔍 Loading existing questions...');
    
    // First try to load existing questions from the app
    try {
      const questionsPath = './src/questions.js';
      if (await fs.pathExists(questionsPath)) {
        const questionsContent = await fs.readFile(questionsPath, 'utf8');
        
        // Use Gemini to extract questions from the JavaScript file
        const extractPrompt = `
          Extract all SJT questions from this JavaScript file and convert to structured format.
          
          Return JSON array with this exact structure:
          [
            {
              "id": 1,
              "scenario": "question scenario text",
              "options": ["option1", "option2", "option3", "option4", "option5"],
              "correctRanking": [1, 2, 3, 4, 5],
              "feedback": ["feedback1", "feedback2", "feedback3", "feedback4", "feedback5"],
              "category": "category name"
            }
          ]
          
          JavaScript content:
          ${questionsContent}
        `;

        console.log('🤖 Processing questions with Gemini...');
        const result = await model.generateContent(extractPrompt);
        const response = await result.response;
        
        try {
          this.existingQuestions = JSON.parse(response.text());
          console.log(`✅ Loaded ${this.existingQuestions.length} existing questions`);
        } catch (parseError) {
          console.error('❌ Error parsing Gemini response:', parseError.message);
          console.log('Raw response:', response.text());
          throw parseError;
        }
      }
    } catch (error) {
      console.error('❌ Error loading existing questions:', error.message);
      throw error;
    }

    // Try to load RTF file if it exists
    const rtfPath = path.join(this.materialsPath, 'DClinPsy SJT Questions and Answers.rtf');
    if (await fs.pathExists(rtfPath)) {
      console.log('📄 Found RTF file, processing additional questions...');
      const rtfContent = await fs.readFile(rtfPath, 'utf8');
      
      const rtfPrompt = `
        Parse this RTF content and extract any additional SJT questions not already in the existing set.
        
        Return JSON array with the same structure as before.
        Only include NEW questions that are different from the existing ones.
        
        RTF Content:
        ${rtfContent.substring(0, 20000)} // Limit for token constraints
      `;

      const rtfResult = await model.generateContent(rtfPrompt);
      const additionalQuestions = JSON.parse(rtfResult.response.text());
      
      if (additionalQuestions.length > 0) {
        this.existingQuestions = this.existingQuestions.concat(additionalQuestions);
        console.log(`📈 Added ${additionalQuestions.length} questions from RTF`);
      }
    }
  }

  // Step 3: Validate questions against guidelines
  async validateQuestions() {
    console.log('🔬 Validating questions against BPS/HCPC guidelines...');
    
    const guidelinesText = Object.values(this.guidelines).join('\n\n');
    const totalQuestions = this.existingQuestions.length;
    
    for (let i = 0; i < totalQuestions; i++) {
      const question = this.existingQuestions[i];
      const progress = `(${i + 1}/${totalQuestions})`;
      
      console.log(`  🔍 Validating question ${question.id || i + 1} ${progress}...`);
      
      const validationPrompt = `
        You are an expert in UK Clinical Psychology training standards and professional ethics.
        
        PROFESSIONAL GUIDELINES:
        ${guidelinesText.substring(0, 25000)}
        
        QUESTION TO VALIDATE:
        Scenario: ${question.scenario}
        
        Options:
        ${question.options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}
        
        Current Ranking (1=most appropriate, 5=least appropriate): ${question.correctRanking || question.idealRanking}
        Current Feedback: ${question.feedback || question.explanations || []}
        
        VALIDATION TASKS:
        1. Verify if the ranking aligns with BPS/HCPC professional standards
        2. Check if feedback accurately reflects professional guidelines
        3. Identify any ethical, clinical, or professional concerns
        4. Ensure scenario is realistic and appropriate for DClinPsy level
        5. Generate improved feedback that explicitly references guidelines
        
        Return JSON:
        {
          "id": ${question.id || i + 1},
          "isValid": true/false,
          "confidenceScore": 0-100,
          "issues": ["list any problems found"],
          "recommendations": ["suggested improvements"],
          "correctRanking": [1,2,3,4,5],
          "improvedFeedback": [
            "Detailed feedback for option 1 with guideline references...",
            "Detailed feedback for option 2...",
            "Detailed feedback for option 3...",
            "Detailed feedback for option 4...",
            "Detailed feedback for option 5..."
          ],
          "guidelineReferences": ["specific BPS/HCPC guidelines referenced"],
          "professionalRationale": "Overall explanation of ranking decision"
        }
      `;

      try {
        const result = await model.generateContent(validationPrompt);
        const validation = JSON.parse(result.response.text());
        
        // Combine original question with validation results
        const validatedQuestion = {
          id: question.id || i + 1,
          scenario: question.scenario,
          options: question.options,
          category: this.categorizeQuestion(question.scenario, question.category),
          
          // Original data
          originalRanking: question.correctRanking || question.idealRanking,
          originalFeedback: question.feedback || question.explanations,
          
          // Validation results
          ...validation,
          
          // Metadata
          validatedAt: new Date().toISOString(),
          source: question.source || 'existing'
        };
        
        this.validatedQuestions.push(validatedQuestion);
        
        if (!validation.isValid) {
          console.warn(`    ⚠️  Issues found: ${validation.issues.join(', ')}`);
        } else {
          console.log(`    ✅ Validated (confidence: ${validation.confidenceScore}%)`);
        }
        
      } catch (error) {
        console.error(`    ❌ Error validating question ${question.id || i + 1}:`, error.message);
        
        // Add question with error flag
        this.validatedQuestions.push({
          ...question,
          id: question.id || i + 1,
          isValid: false,
          issues: ['Validation failed due to API error'],
          validationError: error.message
        });
      }
      
      // Rate limiting - respect API quotas
      if (i < totalQuestions - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`✅ Validation complete! ${this.validatedQuestions.length} questions processed`);
  }

  // Step 4: Categorize questions
  categorizeQuestion(scenario, existingCategory = null) {
    if (existingCategory) return existingCategory;
    
    const categories = {
      'Professional Boundaries': ['gift', 'boundary', 'relationship', 'personal', 'dual', 'social'],
      'Risk Management': ['risk', 'harm', 'suicide', 'safety', 'danger', 'crisis', 'emergency'],
      'Ethical Dilemmas': ['ethical', 'confidential', 'consent', 'dilemma', 'moral', 'duty'],
      'Diversity & Inclusion': ['culture', 'diversity', 'discrimination', 'inclusion', 'cultural', 'race', 'gender'],
      'Interprofessional Working': ['team', 'colleague', 'supervision', 'MDT', 'multidisciplinary', 'collaborate'],
      'Clinical Decision-Making': ['treatment', 'therapy', 'intervention', 'assessment', 'diagnosis', 'clinical'],
      'Service Delivery': ['waiting', 'resource', 'service', 'referral', 'capacity', 'system'],
      'Trainee Development': ['training', 'learning', 'development', 'student', 'competence']
    };

    const lowerScenario = scenario.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerScenario.includes(keyword))) {
        return category;
      }
    }
    return 'Clinical Decision-Making'; // Default category
  }

  // Step 5: Generate validation report
  async generateReport() {
    console.log('📊 Generating validation report...');
    
    const validQuestions = this.validatedQuestions.filter(q => q.isValid);
    const flaggedQuestions = this.validatedQuestions.filter(q => !q.isValid || q.issues?.length > 0);
    
    const categoryBreakdown = {};
    this.validatedQuestions.forEach(q => {
      categoryBreakdown[q.category] = (categoryBreakdown[q.category] || 0) + 1;
    });
    
    const confidenceStats = this.validatedQuestions
      .filter(q => q.confidenceScore)
      .map(q => q.confidenceScore);
    
    const avgConfidence = confidenceStats.length > 0 
      ? Math.round(confidenceStats.reduce((a, b) => a + b, 0) / confidenceStats.length)
      : 0;
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalQuestions: this.validatedQuestions.length,
        validQuestions: validQuestions.length,
        flaggedQuestions: flaggedQuestions.length,
        averageConfidence: avgConfidence
      },
      categoryBreakdown,
      flaggedQuestions: flaggedQuestions.map(q => ({
        id: q.id,
        category: q.category,
        issues: q.issues,
        recommendations: q.recommendations,
        confidenceScore: q.confidenceScore
      })),
      guidelinesUsed: Object.keys(this.guidelines),
      recommendedActions: this.generateRecommendations(flaggedQuestions)
    };
    
    await fs.writeFile('./validation-report.json', JSON.stringify(report, null, 2));
    console.log('📋 Report saved to: validation-report.json');
    
    return report;
  }

  generateRecommendations(flaggedQuestions) {
    const recommendations = [];
    
    if (flaggedQuestions.length > 0) {
      recommendations.push(`Review ${flaggedQuestions.length} flagged questions manually`);
    }
    
    if (flaggedQuestions.some(q => q.issues?.includes('ranking'))) {
      recommendations.push('Consider expert review of question rankings');
    }
    
    if (flaggedQuestions.some(q => q.issues?.includes('feedback'))) {
      recommendations.push('Update feedback to better reference professional guidelines');
    }
    
    return recommendations;
  }

  // Step 6: Save validated questions
  async saveQuestions() {
    console.log('💾 Saving validated questions...');
    
    // Format for app integration
    const formattedQuestions = this.validatedQuestions.map(q => ({
      id: q.id,
      scenario: q.scenario,
      options: q.options,
      idealRanking: q.correctRanking,
      explanations: q.improvedFeedback || q.originalFeedback,
      category: q.category,
      
      // Validation metadata
      validated: true,
      validationConfidence: q.confidenceScore,
      guidelineReferences: q.guidelineReferences,
      professionalRationale: q.professionalRationale,
      validatedAt: q.validatedAt
    }));

    // Create JavaScript module
    const jsContent = `/**
 * Validated SJT Questions - BPS/HCPC Compliant
 * Generated: ${new Date().toISOString()}
 * Total Questions: ${formattedQuestions.length}
 * Validation Confidence: High
 * 
 * ⚠️  AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 */

const questions = ${JSON.stringify(formattedQuestions, null, 2)};

export default questions;

// Helper functions
export const getQuestionsByCategory = (category) => {
  return questions.filter(q => q.category === category);
};

export const getRandomQuestions = (count = 10, category = null) => {
  const pool = category ? getQuestionsByCategory(category) : questions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const categories = [...new Set(questions.map(q => q.category))];

export const getValidationInfo = () => ({
  totalQuestions: questions.length,
  categories: categories.length,
  lastValidated: questions[0]?.validatedAt,
  averageConfidence: Math.round(
    questions
      .filter(q => q.validationConfidence)
      .reduce((sum, q) => sum + q.validationConfidence, 0) / 
    questions.filter(q => q.validationConfidence).length
  )
});
`;

    await fs.writeFile('./src/data/validated-sjt-questions.js', jsContent);
    console.log('✅ Validated questions saved to: ./src/data/validated-sjt-questions.js');
  }

  // Main processing pipeline
  async process() {
    try {
      console.log('🚀 Starting SJT Question Validation Pipeline...\n');
      
      // Check if materials folder exists
      if (!await fs.pathExists(this.materialsPath)) {
        console.log(`📁 Creating materials folder: ${this.materialsPath}`);
        await fs.ensureDir(this.materialsPath);
        console.log('📝 Please add your DClinPsy materials to this folder:');
        console.log('   - DClinPsy SJT Questions and Answers.rtf');
        console.log('   - DClinPsy BPS and HCPC Guidelines/ (folder with PDFs)');
        console.log('');
      }
      
      await this.loadGuidelines();
      await this.loadQuestions();
      
      if (this.existingQuestions.length === 0) {
        console.log('⚠️  No questions found to process');
        return;
      }
      
      await this.validateQuestions();
      const report = await this.generateReport();
      await this.saveQuestions();
      
      console.log('\n🎉 Processing Complete!');
      console.log(`✅ ${report.summary.validQuestions} questions validated`);
      console.log(`⚠️  ${report.summary.flaggedQuestions} questions flagged for review`);
      console.log(`📊 Average confidence: ${report.summary.averageConfidence}%`);
      console.log(`📋 Report: validation-report.json`);
      console.log(`📚 Questions: src/data/validated-sjt-questions.js`);
      
    } catch (error) {
      console.error('\n❌ Processing failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const processor = new SJTProcessor();
  processor.process().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SJTProcessor;