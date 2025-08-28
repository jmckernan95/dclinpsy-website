#!/usr/bin/env node

/**
 * Demo Validation Script
 * Demonstrates the validation process without requiring actual API calls
 * Creates sample validation reports for testing the interface
 */

import fs from 'fs-extra';

class DemoValidator {
  constructor() {
    this.demoData = this.createDemoValidationData();
  }

  createDemoValidationData() {
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalQuestions: 25,
        validQuestions: 22,
        flaggedQuestions: 3,
        averageConfidence: 87
      },
      categoryBreakdown: {
        'Professional Boundaries': 8,
        'Risk Management': 6,
        'Ethical Dilemmas': 5,
        'Diversity & Inclusion': 3,
        'Clinical Decision-Making': 2,
        'Interprofessional Working': 1
      },
      flaggedQuestions: [
        {
          id: 15,
          category: 'Risk Management',
          issues: [
            'Ranking may not align with current HCPC Standards section 7.3',
            'Feedback lacks specific reference to risk assessment protocols'
          ],
          recommendations: [
            'Review with clinical risk assessment expert',
            'Add explicit HCPC guideline references to feedback',
            'Consider current NHS trust protocols'
          ],
          confidenceScore: 65
        },
        {
          id: 23,
          category: 'Professional Boundaries', 
          issues: [
            'Option 3 ranking questionable per BPS Code of Ethics 2.1.3',
            'Cultural considerations may not be adequately addressed'
          ],
          recommendations: [
            'Consult BPS diversity guidelines',
            'Review ranking with cultural competency expert'
          ],
          confidenceScore: 72
        },
        {
          id: 8,
          category: 'Ethical Dilemmas',
          issues: [
            'Feedback explanation could be more comprehensive for option 4',
            'Minor terminology update needed per recent BPS updates'
          ],
          recommendations: [
            'Expand feedback to include more detailed ethical reasoning',
            'Update terminology to reflect 2024 BPS guidelines'
          ],
          confidenceScore: 78
        }
      ],
      guidelinesUsed: [
        'BPS Code of Ethics and Conduct (2024)',
        'HCPC Standards of Conduct Performance and Ethics',
        'DClinPsy Training Guidelines'
      ],
      recommendedActions: [
        'Review 3 flagged questions manually',
        'Consider expert review of question rankings',
        'Update feedback to better reference professional guidelines'
      ],
      confidence_distribution: {
        'high (90-100%)': 15,
        'good (80-89%)': 7,
        'moderate (70-79%)': 2,
        'needs_review (<70%)': 1
      }
    };
  }

  async createDemoValidatedQuestions() {
    console.log('📝 Creating demo validated questions...');
    
    // Load existing questions for demo
    const existingPath = './src/questions.js';
    if (!await fs.pathExists(existingPath)) {
      console.error('❌ No existing questions found');
      return false;
    }

    const existingContent = await fs.readFile(existingPath, 'utf8');
    
    // Create enhanced version with validation metadata
    const enhancedContent = `/**
 * Validated SJT Questions - BPS/HCPC Compliant (DEMO)
 * Generated: ${new Date().toISOString()}
 * Total Questions: 25 (estimated)
 * Validation Confidence: High (87% average)
 * 
 * ⚠️  DEMO VERSION - Simulated validation results
 */

// Import original questions and add validation metadata
${existingContent}

// Add validation metadata to each question (demo)
const addValidationMetadata = (questions) => {
  return questions.map((q, index) => ({
    ...q,
    id: q.id || index + 1,
    validated: true,
    validationConfidence: Math.floor(Math.random() * 30) + 70, // 70-100%
    guidelineReferences: [
      'BPS Code of Ethics and Conduct',
      'HCPC Standards of Conduct, Performance and Ethics'
    ],
    validatedAt: '${new Date().toISOString()}',
    professionalRationale: 'Validated against professional psychology standards with high confidence.'
  }));
};

// Export enhanced questions
const validatedQuestions = addValidationMetadata(questions);
export default validatedQuestions;

// Helper functions
export const getQuestionsByCategory = (category) => {
  return validatedQuestions.filter(q => q.category === category);
};

export const getRandomQuestions = (count = 10, category = null) => {
  const pool = category ? getQuestionsByCategory(category) : validatedQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const categories = [...new Set(validatedQuestions.map(q => q.category))];

export const getValidationInfo = () => ({
  totalQuestions: validatedQuestions.length,
  categories: categories.length,
  lastValidated: validatedQuestions[0]?.validatedAt,
  averageConfidence: Math.round(
    validatedQuestions
      .filter(q => q.validationConfidence)
      .reduce((sum, q) => sum + q.validationConfidence, 0) / 
    validatedQuestions.filter(q => q.validationConfidence).length
  ),
  isDemoData: true
});
`;

    await fs.writeFile('./src/data/demo-validated-sjt-questions.js', enhancedContent);
    console.log('✅ Demo validated questions created');
    return true;
  }

  async createValidationReport() {
    console.log('📊 Creating demo validation report...');
    
    await fs.writeFile('./validation-report.json', JSON.stringify(this.demoData, null, 2));
    console.log('✅ Demo validation report created: validation-report.json');
  }

  async createIntegrationReport() {
    console.log('🔗 Creating demo integration report...');
    
    const integrationReport = {
      integratedAt: new Date().toISOString(),
      backup: './backups/demo-backup',
      statistics: {
        totalQuestions: 25,
        categories: 6,
        categoryList: Object.keys(this.demoData.categoryBreakdown)
      },
      filesUpdated: [
        'src/questions.js',
        'src/pages/Practice.js',
        'src/pages/SJTTest.js'
      ],
      nextSteps: [
        'Test the application thoroughly (DEMO MODE)',
        'Check all SJT functionality',
        'Verify question randomization',
        'Test category filtering',
        'Note: This is DEMO data for testing interface'
      ],
      isDemoData: true
    };
    
    await fs.writeFile('./integration-report.json', JSON.stringify(integrationReport, null, 2));
    console.log('✅ Demo integration report created: integration-report.json');
  }

  async runDemo() {
    try {
      console.log('🎭 Starting Demo Validation Pipeline...\n');
      
      await this.createValidationReport();
      await this.createDemoValidatedQuestions();
      await this.createIntegrationReport();
      
      console.log('\n🎉 Demo Setup Complete!');
      console.log('\n📋 What was created:');
      console.log('  ✅ validation-report.json (demo data)');
      console.log('  ✅ src/data/demo-validated-sjt-questions.js');
      console.log('  ✅ integration-report.json (demo data)');
      
      console.log('\n🔍 Next Steps:');
      console.log('  1. Start the app: npm start');
      console.log('  2. Visit: http://localhost:3000/validation');
      console.log('  3. Review the demo validation interface');
      console.log('  4. Check flagged questions (3 demo issues)');
      
      console.log('\n⚠️  Note: This is DEMO data for interface testing.');
      console.log('     For real validation, add your API key and run: npm run process-questions');
      
    } catch (error) {
      console.error('\n❌ Demo setup failed:', error.message);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = new DemoValidator();
  demo.runDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default DemoValidator;