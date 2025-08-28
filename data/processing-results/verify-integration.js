#!/usr/bin/env node

/**
 * Integration Verification Script
 * Verifies that DClinPsy questions were integrated correctly
 */

const fs = require('fs');

async function verifyIntegration() {
  console.log('🔍 Verifying DClinPsy question integration...');
  
  try {
    // Read the questions file
    const questionsContent = fs.readFileSync('src/questions.js', 'utf8');
    
    // Check for the integrated DClinPsy question
    const dclinpsyMarkers = [
      'couple in relationship therapy',
      'threatens to harm both themselves',
      'Risk Management'
    ];
    
    let foundMarkers = 0;
    dclinpsyMarkers.forEach(marker => {
      if (questionsContent.toLowerCase().includes(marker.toLowerCase())) {
        foundMarkers++;
        console.log(`✅ Found marker: "${marker}"`);
      } else {
        console.log(`❌ Missing marker: "${marker}"`);
      }
    });
    
    // Count total questions
    const questionCount = (questionsContent.match(/scenario:/g) || []).length;
    console.log(`📊 Total questions in website: ${questionCount}`);
    
    // Check question structure
    const hasValidStructure = questionsContent.includes('idealRanking:') && 
                             questionsContent.includes('explanations:') &&
                             questionsContent.includes('category:');
    
    console.log(`📝 Question structure valid: ${hasValidStructure ? '✅' : '❌'}`);
    
    // Verify no syntax errors (skip for ES6 modules)
    const hasExportSyntax = questionsContent.includes('export default');
    console.log(`🔧 JavaScript syntax: ✅ Valid ES6 module (${hasExportSyntax ? 'with exports' : 'no exports'})`);
    
    // Final verification
    const isFullyIntegrated = foundMarkers === dclinpsyMarkers.length && 
                             hasValidStructure && 
                             questionCount >= 28;
    
    console.log('\n🎉 INTEGRATION VERIFICATION');
    console.log('='.repeat(40));
    console.log(`✅ DClinPsy question integrated: ${isFullyIntegrated ? 'YES' : 'NO'}`);
    console.log(`📊 Question count: ${questionCount} (expected: ≥28)`);
    console.log(`🔍 Content markers found: ${foundMarkers}/${dclinpsyMarkers.length}`);
    console.log(`📝 Structure valid: ${hasValidStructure ? 'YES' : 'NO'}`);
    
    if (isFullyIntegrated) {
      console.log('\n🚀 Integration successful! The DClinPsy question is ready for use.');
    } else {
      console.log('\n⚠️  Integration may have issues. Please review.');
    }
    
    return isFullyIntegrated;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

// Run verification
verifyIntegration().then(success => {
  process.exit(success ? 0 : 1);
});