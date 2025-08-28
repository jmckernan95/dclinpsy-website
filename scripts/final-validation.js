#!/usr/bin/env node

/**
 * Final DClinPsy Question Validation
 * Quick validation with concise responses
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');

async function finalValidation() {
  console.log('🏁 Final DClinPsy Question Validation with Gemini 2.5 Flash');
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048, // Smaller limit
    }
  });

  const questions = JSON.parse(await fs.readFile('sample-dclinpsy-questions.json', 'utf8'));
  console.log(`📚 Validating ${questions.length} questions`);

  const results = [];
  
  // Process one at a time with concise responses
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`\n📋 Validating Question ${q.id} (${q.category})`);
    
    const prompt = `Validate this DClinPsy SJT question against BPS/HCPC standards. 

Question: ${JSON.stringify(q, null, 2)}

Provide CONCISE validation in this EXACT format:
{
  "id": ${q.id},
  "status": "valid|needs_review|invalid",
  "confidence": <0-100>,
  "category": "<category>",
  "issues": ["brief issue 1", "brief issue 2"],
  "rating": "A|B|C|D|F"
}

Keep response under 500 characters total.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON more carefully
      let jsonStr = response;
      const jsonMatch = response.match(/\{[^}]*\}/s);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      // Clean JSON
      jsonStr = jsonStr
        .replace(/,\s*}/g, '}')
        .replace(/([^\\])'/g, '$1"')
        .replace(/(\w+):/g, '"$1":');
      
      try {
        const validation = JSON.parse(jsonStr);
        results.push({
          ...q,
          validation
        });
        
        console.log(`  ✅ ${validation.status} (${validation.confidence}%) - Rating: ${validation.rating}`);
        if (validation.issues?.length > 0) {
          console.log(`     Issues: ${validation.issues.join(', ')}`);
        }
      } catch (parseError) {
        console.log(`  ⚠️  JSON parse failed: ${parseError.message}`);
        console.log(`     Raw: ${jsonStr.substring(0, 200)}`);
        results.push({
          ...q,
          validation: { status: 'error', error: parseError.message }
        });
      }
    } catch (error) {
      console.error(`  ❌ API error: ${error.message}`);
      results.push({
        ...q,
        validation: { status: 'error', error: error.message }
      });
    }
    
    // Brief pause
    if (i < questions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  // Summary
  const validCount = results.filter(r => r.validation.status === 'valid').length;
  const reviewCount = results.filter(r => r.validation.status === 'needs_review').length;
  const invalidCount = results.filter(r => r.validation.status === 'invalid').length;
  const errorCount = results.filter(r => r.validation.status === 'error').length;
  
  console.log('\n📊 FINAL VALIDATION SUMMARY');
  console.log('='.repeat(40));
  console.log(`✅ Valid: ${validCount}`);
  console.log(`⚠️  Needs Review: ${reviewCount}`);
  console.log(`❌ Invalid: ${invalidCount}`);
  console.log(`🔧 Errors: ${errorCount}`);
  
  // Save results
  await fs.writeFile('final-validation-results.json', JSON.stringify(results, null, 2));
  console.log('💾 Results saved to: final-validation-results.json');
  
  return results;
}

if (require.main === module) {
  finalValidation().catch(console.error);
}

module.exports = { finalValidation };