#!/usr/bin/env node

/**
 * Test Script for Validated SJT Questions
 * Validates data structure and integrity
 */

const fs = require('fs-extra');

class QuestionTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async testQuestionStructure() {
    console.log('🧪 Testing question data structure...');
    
    const questionsPath = './src/data/validated-sjt-questions.js';
    const fallbackPath = './src/questions.js';
    
    let questionsFile = questionsPath;
    if (!await fs.pathExists(questionsPath)) {
      if (await fs.pathExists(fallbackPath)) {
        questionsFile = fallbackPath;
        this.warnings.push('Using fallback questions file instead of validated questions');
      } else {
        this.errors.push('No questions file found');
        return false;
      }
    }

    try {
      const content = await fs.readFile(questionsFile, 'utf8');
      
      // Test file structure
      if (!content.includes('const questions =') && !content.includes('export') && !content.includes('questions')) {
        this.errors.push('Invalid file structure - missing questions export');
      }

      // Extract questions using regex (since we can't import ES modules in this context)
      const questionsMatch = content.match(/const questions = (\[[\s\S]*?\]);/);
      if (!questionsMatch) {
        this.errors.push('Could not extract questions array from file');
        return false;
      }

      // Basic structure validation
      const requiredFields = ['id', 'scenario', 'options', 'category'];
      const missingFields = requiredFields.filter(field => !content.includes(`"${field}"`));
      
      if (missingFields.length > 0) {
        this.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Count questions and options
      const idMatches = content.match(/"id":\s*\d+/g);
      const optionsMatches = content.match(/"options":\s*\[[^\]]+\]/g);
      
      if (idMatches) {
        const questionCount = idMatches.length;
        console.log(`  ✅ Found ${questionCount} questions`);
        
        if (questionCount < 5) {
          this.warnings.push(`Low question count: ${questionCount}`);
        }
      }

      // Test categories
      const categoryMatches = content.match(/"category":\s*"([^"]+)"/g);
      if (categoryMatches) {
        const categories = [...new Set(categoryMatches.map(m => m.match(/"([^"]+)"/)[1]))];
        console.log(`  ✅ Found ${categories.length} categories: ${categories.join(', ')}`);
        
        if (categories.length < 3) {
          this.warnings.push(`Limited categories: ${categories.length}`);
        }
      }

      // Test ranking arrays
      if (content.includes('idealRanking') || content.includes('correctRanking')) {
        console.log('  ✅ Ranking data present');
      } else {
        this.warnings.push('No ranking data found');
      }

      // Test feedback/explanations
      if (content.includes('explanations') || content.includes('feedback') || content.includes('improvedFeedback')) {
        console.log('  ✅ Feedback data present');
      } else {
        this.warnings.push('No feedback data found');
      }

      return true;

    } catch (error) {
      this.errors.push(`Failed to read questions file: ${error.message}`);
      return false;
    }
  }

  async testValidationData() {
    console.log('🔍 Testing validation data...');
    
    const reportPath = './validation-report.json';
    
    if (await fs.pathExists(reportPath)) {
      try {
        const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
        
        console.log('  ✅ Validation report found');
        console.log(`    - Generated: ${report.generatedAt}`);
        console.log(`    - Total questions: ${report.summary?.totalQuestions || 'unknown'}`);
        console.log(`    - Valid questions: ${report.summary?.validQuestions || 'unknown'}`);
        console.log(`    - Flagged questions: ${report.summary?.flaggedQuestions || 'unknown'}`);
        console.log(`    - Average confidence: ${report.summary?.averageConfidence || 'unknown'}%`);
        
        if (report.summary?.flaggedQuestions > 0) {
          this.warnings.push(`${report.summary.flaggedQuestions} questions flagged for review`);
        }
        
        if (report.summary?.averageConfidence < 70) {
          this.warnings.push(`Low average confidence: ${report.summary.averageConfidence}%`);
        }
        
      } catch (error) {
        this.warnings.push(`Could not parse validation report: ${error.message}`);
      }
    } else {
      this.warnings.push('No validation report found - questions may not be validated');
    }
  }

  async testIntegration() {
    console.log('🔗 Testing app integration...');
    
    const componentsToCheck = [
      './src/pages/Practice.js',
      './src/pages/SJTTest.js',
      './src/components/ProgressDashboard.js'
    ];
    
    for (const componentPath of componentsToCheck) {
      if (await fs.pathExists(componentPath)) {
        const content = await fs.readFile(componentPath, 'utf8');
        
        if (content.includes('import') && (content.includes('questions') || content.includes('Questions'))) {
          console.log(`  ✅ ${componentPath.split('/').pop()} - imports questions`);
        } else {
          this.warnings.push(`${componentPath} - may not import questions properly`);
        }
        
        if (content.includes('category') || content.includes('filter')) {
          console.log(`    - Uses category filtering`);
        }
      } else {
        this.warnings.push(`Component not found: ${componentPath}`);
      }
    }
  }

  async generateReport() {
    const testResults = {
      timestamp: new Date().toISOString(),
      passed: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        status: this.errors.length === 0 ? 'PASS' : 'FAIL'
      },
      recommendations: []
    };

    if (this.errors.length > 0) {
      testResults.recommendations.push('Fix errors before deploying');
    }
    
    if (this.warnings.length > 0) {
      testResults.recommendations.push('Review warnings for potential improvements');
    }

    if (this.warnings.some(w => w.includes('validated'))) {
      testResults.recommendations.push('Run validation pipeline: npm run process-questions');
    }

    await fs.writeFile('./test-results.json', JSON.stringify(testResults, null, 2));
    
    return testResults;
  }

  async runTests() {
    console.log('🚀 Starting Question System Tests...\n');
    
    try {
      await this.testQuestionStructure();
      await this.testValidationData();
      await this.testIntegration();
      
      const results = await this.generateReport();
      
      console.log('\n📊 Test Results Summary:');
      console.log(`Status: ${results.summary.status}`);
      console.log(`Errors: ${results.summary.totalErrors}`);
      console.log(`Warnings: ${results.summary.totalWarnings}`);
      
      if (results.errors.length > 0) {
        console.log('\n❌ Errors:');
        results.errors.forEach(error => console.log(`  - ${error}`));
      }
      
      if (results.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        results.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
      
      if (results.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        results.recommendations.forEach(rec => console.log(`  - ${rec}`));
      }
      
      console.log(`\n📋 Full report saved to: test-results.json`);
      
      if (results.summary.status === 'PASS') {
        console.log('\n🎉 All tests passed! Questions are ready for production.');
        return true;
      } else {
        console.log('\n❌ Tests failed. Please fix errors before deployment.');
        return false;
      }
      
    } catch (error) {
      console.error('\n💥 Test execution failed:', error.message);
      return false;
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const tester = new QuestionTester();
  tester.runTests()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = QuestionTester;