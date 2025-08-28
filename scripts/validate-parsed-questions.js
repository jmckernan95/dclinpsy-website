#!/usr/bin/env node

/**
 * DClinPsy Question Validation
 * Validates parsed questions using Gemini 2.5 Flash
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');

// Model configuration with Gemini 2.5 Flash
const modelConfig = {
  primary: "gemini-2.5-flash",
  costLimit: 50.00,
  estimatedCostPerToken: 0.000075 / 1000,
  totalCostTracking: 0
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function validateParsedQuestions() {
  console.log('🚀 Validating DClinPsy Questions with Gemini 2.5 Flash');
  console.log(`💰 Cost limit: $${modelConfig.costLimit}`);
  
  try {
    // Initialize model
    const model = genAI.getGenerativeModel({
      model: modelConfig.primary,
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });

    // Load parsed questions
    const questions = JSON.parse(await fs.readFile('sample-dclinpsy-questions.json', 'utf8'));
    console.log(`📚 Loaded ${questions.length} parsed questions`);

    // Take first 10 questions for validation due to cost limits
    const questionsToValidate = questions.slice(0, 10);
    console.log(`🔬 Validating first ${questionsToValidate.length} questions to stay under budget`);
    
    const validatedQuestions = [];
    const flaggedQuestions = [];
    
    // Process in batches of 2 to manage costs
    for (let i = 0; i < questionsToValidate.length; i += 2) {
      const batch = questionsToValidate.slice(i, i + 2);
      console.log(`\n📋 Processing batch ${Math.floor(i/2) + 1}/${Math.ceil(questionsToValidate.length/2)} (${batch.length} questions)`);
      
      // Check cost before processing
      const estimatedCost = 2000 * modelConfig.estimatedCostPerToken; // Rough estimate per batch
      if (modelConfig.totalCostTracking + estimatedCost > modelConfig.costLimit) {
        console.log('💰 Cost limit reached, stopping validation');
        break;
      }
      
      const batchPrompt = `
Validate these DClinPsy SJT questions against BPS/HCPC professional standards.

For each question, provide:
1. Professional validation of the scenario and options
2. Confidence score (0-100)
3. Any issues with current ranking or content
4. Category classification

Return JSON array:
[
  {
    "id": <question_id>,
    "validationStatus": "valid|needs_review|invalid",
    "confidenceScore": <0-100>,
    "category": "<Professional Boundaries|Risk Management|Ethical Dilemmas|etc>",
    "issues": ["list any problems"],
    "recommendations": ["suggestions for improvement"],
    "guidelineReferences": ["relevant BPS/HCPC standards"]
  }
]

Questions to validate:
${JSON.stringify(batch, null, 2)}
`;

      try {
        const result = await model.generateContent(batchPrompt);
        const response = result.response.text();
        
        // Update cost tracking
        const responseTokens = response.length / 4;
        const promptTokens = batchPrompt.length / 4;
        const cost = (responseTokens + promptTokens) * modelConfig.estimatedCostPerToken;
        modelConfig.totalCostTracking += cost;
        
        console.log(`💰 Batch cost: $${cost.toFixed(4)} | Total: $${modelConfig.totalCostTracking.toFixed(4)}/${modelConfig.costLimit}`);
        
        // Parse validation response with better error handling
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            // Clean the JSON string before parsing
            let jsonString = jsonMatch[0];
            
            // Fix common JSON issues
            jsonString = jsonString
              .replace(/,\s*}/g, '}') // Remove trailing commas in objects
              .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
              .replace(/([^\\])'/g, '$1"') // Replace single quotes with double quotes
              .replace(/\\'/g, "'"); // Keep escaped single quotes as is
            
            const validations = JSON.parse(jsonString);
            
            if (!Array.isArray(validations)) {
              throw new Error('Parsed validation JSON is not an array');
            }
          
            validations.forEach((validation, idx) => {
            const originalQuestion = batch[idx];
            const validatedQuestion = {
              ...originalQuestion,
              ...validation,
              validatedAt: new Date().toISOString()
            };
            
            if (validation.validationStatus === 'valid') {
              validatedQuestions.push(validatedQuestion);
              console.log(`  ✅ Question ${validation.id}: Valid (${validation.confidenceScore}%)`);
            } else {
              flaggedQuestions.push(validatedQuestion);
              console.log(`  ⚠️  Question ${validation.id}: ${validation.validationStatus} (${validation.confidenceScore}%)`);
            }
          });
          
          } catch (parseError) {
            console.error(`❌ JSON parsing failed for batch ${Math.floor(i/2) + 1}:`, parseError.message);
            console.error('Raw response (first 1000 chars):', response.substring(0, 1000));
          }
        }
        
        // Rate limiting
        if (i < questionsToValidate.length - 2) {
          console.log('⏱️  Waiting 3s before next batch...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        console.error(`❌ Batch ${Math.floor(i/2) + 1} failed:`, error.message);
      }
    }
    
    // Generate report
    const report = {
      generatedAt: new Date().toISOString(),
      totalProcessed: validatedQuestions.length + flaggedQuestions.length,
      validQuestions: validatedQuestions.length,
      flaggedQuestions: flaggedQuestions.length,
      estimatedCost: modelConfig.totalCostTracking,
      validatedQuestions,
      flaggedQuestions,
      categoryBreakdown: {},
      confidenceDistribution: {
        'high (90-100%)': 0,
        'good (80-89%)': 0,
        'moderate (70-79%)': 0,
        'needs_review (<70%)': 0
      }
    };
    
    // Calculate statistics
    [...validatedQuestions, ...flaggedQuestions].forEach(q => {
      // Category breakdown
      const category = q.category || 'Unknown';
      report.categoryBreakdown[category] = (report.categoryBreakdown[category] || 0) + 1;
      
      // Confidence distribution
      const confidence = q.confidenceScore || 0;
      if (confidence >= 90) report.confidenceDistribution['high (90-100%)']++;
      else if (confidence >= 80) report.confidenceDistribution['good (80-89%)']++;
      else if (confidence >= 70) report.confidenceDistribution['moderate (70-79%)']++;
      else report.confidenceDistribution['needs_review (<70%)']++;
    });
    
    // Save report
    await fs.writeFile('dclinpsy-validation-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Valid questions: ${report.validQuestions}`);
    console.log(`⚠️  Flagged questions: ${report.flaggedQuestions}`);
    console.log(`💰 Total cost: $${report.estimatedCost.toFixed(4)}`);
    console.log(`📁 Report saved: dclinpsy-validation-report.json`);
    
    if (report.flaggedQuestions > 0) {
      console.log(`\n🔍 Flagged questions need manual review:`);
      flaggedQuestions.forEach(q => {
        console.log(`   - Question ${q.id}: ${q.validationStatus} (${q.issues?.length || 0} issues)`);
      });
    }
    
    return report;
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  validateParsedQuestions().catch(console.error);
}

module.exports = { validateParsedQuestions };