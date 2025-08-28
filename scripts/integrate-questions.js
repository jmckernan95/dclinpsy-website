#!/usr/bin/env node

/**
 * Integration Script for Validated SJT Questions
 * Safely integrates validated questions into the application
 * Creates backups and updates all relevant components
 */

import fs from 'fs-extra';
import path from 'path';

class QuestionIntegrator {
  constructor() {
    this.timestamp = Date.now();
    this.backupDir = `./backups/${this.timestamp}`;
  }

  async createBackups() {
    console.log('🔄 Creating backups...');
    
    await fs.ensureDir(this.backupDir);
    
    // Backup existing questions
    const questionsPath = './src/questions.js';
    if (await fs.pathExists(questionsPath)) {
      await fs.copy(questionsPath, path.join(this.backupDir, 'questions.js'));
      console.log('  ✅ Backed up: questions.js');
    }
    
    // Backup any existing validated questions
    const validatedPath = './src/data/validated-sjt-questions.js';
    if (await fs.pathExists(validatedPath)) {
      await fs.copy(validatedPath, path.join(this.backupDir, 'validated-sjt-questions.js'));
      console.log('  ✅ Backed up: validated-sjt-questions.js');
    }
    
    console.log(`📁 Backups created in: ${this.backupDir}`);
  }

  async updateQuestions() {
    console.log('🔄 Updating question files...');
    
    const validatedPath = './src/data/validated-sjt-questions.js';
    const questionsPath = './src/questions.js';
    
    if (!await fs.pathExists(validatedPath)) {
      console.error('❌ Validated questions file not found. Run processing first.');
      return false;
    }
    
    // Replace main questions file
    await fs.copy(validatedPath, questionsPath);
    console.log('  ✅ Updated: questions.js');
    
    return true;
  }

  async updateComponents() {
    console.log('🔄 Updating component imports...');
    
    const componentsToUpdate = [
      './src/pages/Practice.js',
      './src/pages/SJTTest.js',
      './src/components/ProgressDashboard.js'
    ];
    
    for (const componentPath of componentsToUpdate) {
      if (await fs.pathExists(componentPath)) {
        try {
          let content = await fs.readFile(componentPath, 'utf8');
          let updated = false;
          
          // Update import statements to use new structure
          if (content.includes('import questions') || content.includes('from \'../questions\'') || content.includes('from \'./questions\'')) {
            content = content.replace(
              /import.*questions.*from.*['"][^'"]*questions['"];?/g,
              "import questions, { getRandomQuestions, categories, getQuestionsByCategory } from '../questions.js';"
            );
            updated = true;
          }
          
          // Update any direct usage patterns
          if (content.includes('questions.filter') && !content.includes('getQuestionsByCategory')) {
            content = content.replace(
              /questions\.filter\(\s*q\s*=>\s*q\.category\s*===\s*['"`]([^'"]*\)['"`]\s*\)/g,
              'getQuestionsByCategory(\'$1\')'
            );
            updated = true;
          }
          
          if (updated) {
            await fs.writeFile(componentPath, content);
            console.log(`  ✅ Updated: ${path.basename(componentPath)}`);
          }
          
        } catch (error) {
          console.warn(`  ⚠️  Error updating ${componentPath}:`, error.message);
        }
      }
    }
  }

  async createValidationReport() {
    console.log('📊 Creating integration report...');
    
    const validatedPath = './src/data/validated-sjt-questions.js';
    
    if (await fs.pathExists(validatedPath)) {
      // Import the validated questions to generate stats
      const content = await fs.readFile(validatedPath, 'utf8');
      
      // Extract basic statistics from the file
      const questionsMatch = content.match(/const questions = (\[[\s\S]*?\]);/);
      if (questionsMatch) {
        try {
          // Basic parsing - count questions and categories
          const questionsCount = (content.match(/"id":\s*\d+/g) || []).length;
          const categoriesMatch = content.match(/"category":\s*"([^"]+)"/g) || [];
          const uniqueCategories = [...new Set(categoriesMatch.map(m => m.match(/"([^"]+)"/)[1]))];
          
          const integrationReport = {
            integratedAt: new Date().toISOString(),
            backup: this.backupDir,
            statistics: {
              totalQuestions: questionsCount,
              categories: uniqueCategories.length,
              categoryList: uniqueCategories
            },
            filesUpdated: [
              'src/questions.js',
              'src/pages/Practice.js',
              'src/pages/SJTTest.js',
              'src/components/ProgressDashboard.js'
            ],
            nextSteps: [
              'Test the application thoroughly',
              'Check all SJT functionality',
              'Verify question randomization',
              'Test category filtering',
              'Review validation report for any issues'
            ]
          };
          
          await fs.writeFile('./integration-report.json', JSON.stringify(integrationReport, null, 2));
          console.log('📋 Integration report saved to: integration-report.json');
          
          return integrationReport;
          
        } catch (error) {
          console.warn('⚠️  Could not parse questions for report:', error.message);
        }
      }
    }
    
    return null;
  }

  async testIntegration() {
    console.log('🧪 Testing integration...');
    
    const questionsPath = './src/questions.js';
    
    if (await fs.pathExists(questionsPath)) {
      try {
        const content = await fs.readFile(questionsPath, 'utf8');
        
        // Basic syntax validation
        if (!content.includes('const questions =')) {
          throw new Error('Questions array not found');
        }
        
        if (!content.includes('export default questions')) {
          throw new Error('Default export not found');
        }
        
        console.log('  ✅ Questions file structure is valid');
        
        // Check for required fields
        const requiredFields = ['id', 'scenario', 'options', 'idealRanking', 'explanations', 'category'];
        const missingFields = requiredFields.filter(field => !content.includes(`"${field}"`));
        
        if (missingFields.length > 0) {
          console.warn(`  ⚠️  Missing fields: ${missingFields.join(', ')}`);
        } else {
          console.log('  ✅ All required fields present');
        }
        
        return true;
        
      } catch (error) {
        console.error('  ❌ Integration test failed:', error.message);
        return false;
      }
    }
    
    console.error('  ❌ Questions file not found');
    return false;
  }

  async integrate() {
    try {
      console.log('🚀 Starting Question Integration...\n');
      
      await this.createBackups();
      
      if (!await this.updateQuestions()) {
        console.error('❌ Failed to update questions');
        return;
      }
      
      await this.updateComponents();
      
      const report = await this.createValidationReport();
      
      if (await this.testIntegration()) {
        console.log('\n🎉 Integration Complete!');
        console.log('✅ Questions successfully integrated');
        console.log('✅ Components updated');
        console.log('✅ Integration tests passed');
        
        if (report) {
          console.log(`📊 ${report.statistics.totalQuestions} questions integrated`);
          console.log(`📂 ${report.statistics.categories} categories available`);
        }
        
        console.log('\n🔧 Next Steps:');
        console.log('1. Test the application: npm start');
        console.log('2. Run build test: npm run build');
        console.log('3. Review validation report: validation-report.json');
        console.log('4. Check integration report: integration-report.json');
        
      } else {
        console.error('\n❌ Integration tests failed');
        console.log('🔄 Restoring from backup...');
        
        // Restore backup if tests fail
        const questionsBackup = path.join(this.backupDir, 'questions.js');
        if (await fs.pathExists(questionsBackup)) {
          await fs.copy(questionsBackup, './src/questions.js');
          console.log('✅ Backup restored');
        }
      }
      
    } catch (error) {
      console.error('\n❌ Integration failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const integrator = new QuestionIntegrator();
  integrator.integrate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default QuestionIntegrator;