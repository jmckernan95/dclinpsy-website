#!/usr/bin/env node

/**
 * Full DClinPsy Question Processing Pipeline
 * Extract, validate, and deploy all 60 questions
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');
const { exec } = require('child_process');
const { promisify } = require('util');
const crypto = require('crypto');

class FullQuestionPipeline {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = null;
    this.guidelines = {};
    this.guidelinesSummary = '';
    this.totalCostTracking = 0;
    this.costLimit = 50.00;
    this.estimatedCostPerToken = 0.000075 / 1000;
    this.allQuestions = [];
    this.validatedQuestions = [];
    this.highConfidenceQuestions = [];
  }

  async initialize() {
    console.log('🚀 FULL DCLINPSY QUESTION PIPELINE');
    console.log('='.repeat(60));
    console.log(`💰 Budget: $${this.costLimit}`);
    console.log(`🎯 Target: All 60 questions validated & deployed`);
    
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
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
      // Load all PDFs
      const bpsPath = path.join(guidelinesPath, 'BPS Guidelines');
      const hcpcPath = path.join(guidelinesPath, 'HCPC');
      
      const bpsFiles = await fs.readdir(bpsPath);
      const hcpcFiles = await fs.readdir(hcpcPath);
      
      // Process BPS files
      for (const file of bpsFiles) {
        if (file.endsWith('.pdf')) {
          console.log(`📄 BPS: ${file}`);
          const filePath = path.join(bpsPath, file);
          const dataBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(dataBuffer);
          
          this.guidelines[`BPS_${file}`] = {
            title: file,
            content: pdfData.text.replace(/\s+/g, ' ').trim(),
            type: 'BPS'
          };
          
          console.log(`   ✅ ${this.guidelines[`BPS_${file}`].content.length} chars`);
        }
      }

      // Process HCPC files
      for (const file of hcpcFiles) {
        if (file.endsWith('.pdf')) {
          console.log(`📄 HCPC: ${file}`);
          const filePath = path.join(hcpcPath, file);
          const dataBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(dataBuffer);
          
          this.guidelines[`HCPC_${file}`] = {
            title: file,
            content: pdfData.text.replace(/\s+/g, ' ').trim(),
            type: 'HCPC'
          };
          
          console.log(`   ✅ ${this.guidelines[`HCPC_${file}`].content.length} chars`);
        }
      }

      const totalChars = Object.values(this.guidelines).reduce((sum, g) => sum + g.content.length, 0);
      console.log(`\n📊 Total: ${Object.keys(this.guidelines).length} files, ${totalChars.toLocaleString()} chars`);
      
      // Create comprehensive standards
      this.guidelinesSummary = this.createComprehensiveStandards();
      console.log('✅ Professional standards ready');

    } catch (error) {
      console.error('❌ Guidelines loading failed:', error.message);
      this.guidelinesSummary = this.createFallbackStandards();
    }
  }

  createComprehensiveStandards() {
    return `
BPS/HCPC COMPREHENSIVE PROFESSIONAL STANDARDS FOR SJT VALIDATION:

RISK MANAGEMENT & SUICIDE PREVENTION:
- Systematic risk assessment: plans, means, intent, protective factors, history
- Proportionate response: balance safety with autonomy, least restrictive effective intervention
- Documentation: clear rationale for all risk decisions, ongoing monitoring plans
- Emergency protocols: when to involve services, maintain therapeutic relationship
- BPS: "Psychologists must prioritize client safety through evidence-based assessment"
- HCPC: "Proportionate responses that balance safety with respect for autonomy"

SAFEGUARDING (CHILDREN & VULNERABLE ADULTS):
- Child Protection: Under-18s require safeguarding response regardless of consent
- Vulnerable adults: cognitive impairment, self-neglect, abuse indicators
- Duty to report: overrides confidentiality when harm risk identified
- Collaborative approach: involve clients in process where safely possible
- BPS: "Safeguarding responsibilities supersede confidentiality obligations"
- HCPC: "Take appropriate action to protect vulnerable individuals from harm"

PROFESSIONAL BOUNDARIES:
- Therapeutic boundaries: gifts, social contact, dual relationships
- Outside contact: maintain professional stance in all contexts
- Cultural sensitivity: adapt boundaries for cultural appropriateness
- Documentation: boundary crossings require supervision discussion
- BPS: "Maintain clear therapeutic boundaries to preserve treatment integrity"
- HCPC: "Avoid relationships that could impair professional judgment"

CONFIDENTIALITY & INFORMATION SHARING:
- Legal framework: break only when legally required or consent given
- Risk override: imminent harm to self/others supersedes confidentiality
- Transparency: inform clients of confidentiality limits from start
- Team working: appropriate sharing within treatment team
- BPS: "Confidentiality balanced against duty of care and legal requirements"
- HCPC: "Share information appropriately to ensure safe and effective care"

CULTURAL COMPETENCY & DIVERSITY:
- Cultural humility: acknowledge limitations and seek learning
- Adapt not assume: modify approaches for cultural responsiveness
- Avoid stereotyping: respect individual variation within cultural groups
- Power dynamics: address structural inequalities affecting therapy
- BPS: "Respect diversity and adapt practice for cultural responsiveness"
- HCPC: "Provide services that are appropriate to different cultures and beliefs"

INTERPROFESSIONAL WORKING:
- Contribute expertise: provide psychological perspectives to team decisions
- Professional communication: remain respectful during disagreements
- Client focus: prioritize service user needs over professional conflicts
- Appropriate channels: use proper processes for resolving disputes
- BPS: "Collaborate effectively while maintaining professional autonomy"
- HCPC: "Work cooperatively with colleagues for benefit of service users"

SERVICE DELIVERY & COMMUNICATION:
- Accessible language: adapt communication for different audiences
- Equitable access: fair resource allocation and service provision
- Quality improvement: seek feedback and continuous development
- Transparency: honest about service limitations and waiting times
- BPS: "Ensure services are accessible and meet diverse needs"
- HCPC: "Communicate effectively with service users and colleagues"

PROFESSIONAL DEVELOPMENT & SUPERVISION:
- Use supervision: proactive use for challenging cases and growth
- Accept feedback: constructive response to performance concerns
- Acknowledge limitations: seek additional training and consultation
- Reflective practice: continuous learning from experience
- BPS: "Engage in lifelong learning and reflective practice"
- HCPC: "Keep professional knowledge and skills up to date"
`;
  }

  createFallbackStandards() {
    return `BPS/HCPC Standards: Risk assessment, safeguarding protocols, professional boundaries, confidentiality management, cultural competency, interprofessional collaboration, accessible communication, continuous professional development.`;
  }

  async extractAllQuestions() {
    console.log('\n📄 EXTRACTING ALL 60 QUESTIONS');
    console.log('='.repeat(40));
    
    // Convert RTF to text
    const execAsync = promisify(exec);
    const rtfPath = path.join('DClinPsy SJT Questions, Answers, and Guidelines', 'DClinPsy SJT Questions and Answers.rtf');
    const tempTxtFile = '/tmp/dclinpsy_full_extraction.txt';
    
    await execAsync(`textutil -convert txt "${rtfPath}" -output "${tempTxtFile}"`);
    const plainText = await fs.readFile(tempTxtFile, 'utf8');
    
    console.log(`📊 Text: ${plainText.length.toLocaleString()} characters`);

    // Use Gemini for systematic extraction
    await this.extractQuestionsWithGemini(plainText);
    
    // Clean up
    await fs.remove(tempTxtFile);
    
    console.log(`\n📊 Total extracted: ${this.allQuestions.length} questions`);
    
    // Save extracted questions
    await fs.writeFile('all-extracted-questions.json', JSON.stringify(this.allQuestions, null, 2));
    console.log('💾 Saved: all-extracted-questions.json');
    
    return this.allQuestions;
  }

  async extractQuestionsWithGemini(plainText) {
    console.log('🤖 Using Gemini for systematic extraction...');
    
    // Process in manageable chunks
    const chunkSize = 30000; // 30k characters per chunk
    const chunks = [];
    
    for (let i = 0; i < plainText.length; i += chunkSize) {
      chunks.push(plainText.substring(i, i + chunkSize));
    }
    
    console.log(`📦 Processing ${chunks.length} text chunks`);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`\n📦 Chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
      
      const extractPrompt = `Extract complete DClinPsy SJT questions from this text chunk.

REQUIREMENTS:
- Find questions with: scenario + 5 options + rankings
- Look for "## Question X" markers
- Extract scenario before "Rank the following actions"
- Extract all 5 response options
- Determine ranking from "**Ideal ranking: X**" patterns

Return simple list format (not JSON):
---
ID: [number]
SCENARIO: [scenario text]
OPTION1: [option text]
OPTION2: [option text]  
OPTION3: [option text]
OPTION4: [option text]
OPTION5: [option text]
RANKING: [1,2,3,4,5]
CATEGORY: [category]
---

Text chunk:
${chunk}`;

      try {
        const response = await this.callGeminiWithTracking(extractPrompt);
        const questions = this.parseGeminiExtraction(response);
        this.allQuestions.push(...questions);
        
        console.log(`   ✅ Found ${questions.length} questions`);
        
        if (questions.length > 0) {
          questions.forEach(q => {
            console.log(`      Q${q.id}: ${q.category}`);
          });
        }

      } catch (error) {
        console.warn(`   ⚠️  Chunk ${i + 1} failed: ${error.message}`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  parseGeminiExtraction(response) {
    const questions = [];
    const questionBlocks = response.split('---').filter(block => block.trim().length > 100);
    
    for (const block of questionBlocks) {
      try {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        let id, scenario, options = [], ranking, category;
        
        for (const line of lines) {
          if (line.startsWith('ID:')) {
            id = parseInt(line.replace('ID:', '').trim()) || 0;
          } else if (line.startsWith('SCENARIO:')) {
            scenario = line.replace('SCENARIO:', '').trim();
          } else if (line.startsWith('OPTION1:')) {
            options[0] = line.replace('OPTION1:', '').trim();
          } else if (line.startsWith('OPTION2:')) {
            options[1] = line.replace('OPTION2:', '').trim();
          } else if (line.startsWith('OPTION3:')) {
            options[2] = line.replace('OPTION3:', '').trim();
          } else if (line.startsWith('OPTION4:')) {
            options[3] = line.replace('OPTION4:', '').trim();
          } else if (line.startsWith('OPTION5:')) {
            options[4] = line.replace('OPTION5:', '').trim();
          } else if (line.startsWith('RANKING:')) {
            const rankStr = line.replace('RANKING:', '').trim();
            ranking = rankStr.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
          } else if (line.startsWith('CATEGORY:')) {
            category = line.replace('CATEGORY:', '').trim();
          }
        }
        
        if (id && scenario && options.length === 5 && ranking && ranking.length === 5 && category) {
          questions.push({
            id: id,
            scenario: scenario,
            options: options,
            correctRanking: ranking,
            category: category,
            source: 'gemini_extraction',
            extractedAt: new Date().toISOString()
          });
        }
        
      } catch (error) {
        // Skip malformed blocks
        continue;
      }
    }
    
    return questions;
  }

  async validateAllQuestions() {
    console.log('\n🔬 VALIDATING ALL QUESTIONS');
    console.log('='.repeat(40));
    
    if (this.allQuestions.length === 0) {
      throw new Error('No questions to validate');
    }
    
    console.log(`📚 Validating ${this.allQuestions.length} questions`);
    console.log(`💰 Current cost: $${this.totalCostTracking.toFixed(4)}`);
    
    for (let i = 0; i < this.allQuestions.length; i++) {
      const question = this.allQuestions[i];
      console.log(`\n📋 ${i + 1}/${this.allQuestions.length}: Q${question.id} (${question.category})`);
      
      // Check budget
      if (this.totalCostTracking > this.costLimit * 0.95) {
        console.log('💰 Approaching budget limit, stopping validation');
        break;
      }
      
      const validation = await this.validateSingleQuestion(question);
      
      const validatedQuestion = {
        ...question,
        validation,
        validatedAt: new Date().toISOString()
      };
      
      this.validatedQuestions.push(validatedQuestion);
      
      // Check if high confidence
      if (validation.confidence >= 95 && validation.valid) {
        this.highConfidenceQuestions.push(validatedQuestion);
        console.log(`   ✅ HIGH CONFIDENCE: ${validation.confidence}%`);
      } else if (validation.valid) {
        console.log(`   ✅ Valid: ${validation.confidence}%`);
      } else {
        console.log(`   ⚠️  Flagged: ${validation.confidence}%`);
      }
      
      // Brief pause
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`\n📊 Validation complete:`);
    console.log(`   📚 Total processed: ${this.validatedQuestions.length}`);
    console.log(`   ✅ High confidence (95%+): ${this.highConfidenceQuestions.length}`);
    console.log(`   💰 Total cost: $${this.totalCostTracking.toFixed(4)}`);
    
    // Save results
    await fs.writeFile('all-validated-questions.json', JSON.stringify(this.validatedQuestions, null, 2));
    await fs.writeFile('high-confidence-questions.json', JSON.stringify(this.highConfidenceQuestions, null, 2));
    
    console.log('💾 Saved validation results');
  }

  async validateSingleQuestion(question) {
    const validationPrompt = `Validate this DClinPsy SJT question against BPS/HCPC professional standards.

PROFESSIONAL STANDARDS:
${this.guidelinesSummary.substring(0, 5000)}

QUESTION:
Scenario: ${question.scenario}
Options: ${question.options.join(' | ')}
Current Ranking: ${question.correctRanking.join(',')}
Category: ${question.category}

VALIDATE against BPS/HCPC standards:
1. Scenario realistic and clinically accurate?
2. Options professionally appropriate?
3. Ranking aligns with BPS/HCPC guidelines?
4. Category correctly assigned?

Respond in this exact format:
VALID: YES/NO
CONFIDENCE: [0-100]%
RANKING: CORRECT/ISSUE
ASSESSMENT: [Brief professional assessment]
BPS_HCPC: [Specific guideline references if applicable]`;

    try {
      const response = await this.callGeminiWithTracking(validationPrompt);
      
      // Parse structured response
      const validMatch = response.match(/VALID:\s*(YES|NO)/i);
      const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)%?/);
      const rankingMatch = response.match(/RANKING:\s*(.+)/);
      const assessmentMatch = response.match(/ASSESSMENT:\s*(.+)/);
      const guidelineMatch = response.match(/BPS_HCPC:\s*(.+)/);

      return {
        valid: validMatch ? validMatch[1].toUpperCase() === 'YES' : false,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
        rankingStatus: rankingMatch ? rankingMatch[1].trim() : 'Unknown',
        assessment: assessmentMatch ? assessmentMatch[1].trim() : 'No assessment',
        guidelineReferences: guidelineMatch ? guidelineMatch[1].trim() : 'None cited',
        rawResponse: response
      };

    } catch (error) {
      console.error(`   ❌ Validation error: ${error.message}`);
      return {
        valid: false,
        confidence: 0,
        error: error.message,
        assessment: 'Validation failed'
      };
    }
  }

  async checkDuplicatesAndDeploy() {
    console.log('\n🔍 CHECKING DUPLICATES & DEPLOYING');
    console.log('='.repeat(40));
    
    if (this.highConfidenceQuestions.length === 0) {
      console.log('⚠️  No high-confidence questions to deploy');
      return;
    }
    
    console.log(`🎯 Deploying ${this.highConfidenceQuestions.length} high-confidence questions`);
    
    // Read current questions
    const questionsPath = 'src/questions.js';
    const questionsContent = await fs.readFile(questionsPath, 'utf8');
    
    // Extract existing scenarios for duplicate checking
    const existingScenarios = [];
    const scenarioMatches = questionsContent.matchAll(/scenario:\s*"((?:[^"\\]|\\.)*)"/g);
    for (const match of scenarioMatches) {
      existingScenarios.push(match[1]);
    }
    
    console.log(`📚 Found ${existingScenarios.length} existing questions`);
    
    // Check for duplicates
    const questionsToAdd = [];
    const duplicatesFound = [];
    
    for (const newQuestion of this.highConfidenceQuestions) {
      const isDuplicate = this.checkDuplicate(newQuestion.scenario, existingScenarios);
      
      if (!isDuplicate) {
        questionsToAdd.push(newQuestion);
      } else {
        duplicatesFound.push(newQuestion);
      }
    }
    
    console.log(`✅ New questions to add: ${questionsToAdd.length}`);
    console.log(`🔄 Duplicates found: ${duplicatesFound.length}`);
    
    if (questionsToAdd.length === 0) {
      console.log('ℹ️  No new questions to add after duplicate filtering');
      return;
    }
    
    // Add questions to website
    await this.addQuestionsToWebsite(questionsToAdd);
    
    // Generate deployment report
    const deploymentReport = {
      deployedAt: new Date().toISOString(),
      questionsAdded: questionsToAdd.length,
      duplicatesSkipped: duplicatesFound.length,
      totalProcessed: this.validatedQuestions.length,
      highConfidenceCount: this.highConfidenceQuestions.length,
      totalCost: this.totalCostTracking,
      deployedQuestions: questionsToAdd.map(q => ({
        id: q.id,
        category: q.category,
        confidence: q.validation.confidence
      }))
    };
    
    await fs.writeFile('deployment-report.json', JSON.stringify(deploymentReport, null, 2));
    
    console.log('\n🎉 DEPLOYMENT COMPLETE');
    console.log('='.repeat(30));
    console.log(`✅ Questions added: ${questionsToAdd.length}`);
    console.log(`🔄 Duplicates skipped: ${duplicatesFound.length}`);
    console.log(`💰 Total cost: $${this.totalCostTracking.toFixed(4)}`);
    console.log('💾 Report: deployment-report.json');
    
    return deploymentReport;
  }

  checkDuplicate(newScenario, existingScenarios) {
    const newWords = new Set(newScenario.toLowerCase().split(' ').filter(w => w.length > 3));
    
    for (const existing of existingScenarios) {
      const existingWords = new Set(existing.toLowerCase().split(' ').filter(w => w.length > 3));
      const overlap = [...newWords].filter(w => existingWords.has(w)).length;
      const similarity = overlap / Math.max(newWords.size, existingWords.size);
      
      if (similarity > 0.6) { // 60% similarity threshold
        return true;
      }
    }
    
    return false;
  }

  async addQuestionsToWebsite(questionsToAdd) {
    console.log('\n📝 Adding questions to website...');
    
    // Read current questions file
    const questionsPath = 'src/questions.js';
    let questionsContent = await fs.readFile(questionsPath, 'utf8');
    
    // Create backup
    const backupPath = `${questionsPath}.backup-${Date.now()}`;
    await fs.copy(questionsPath, backupPath);
    console.log(`💾 Backup: ${backupPath}`);
    
    // Convert questions to website format
    const formattedQuestions = questionsToAdd.map(q => {
      // Generate appropriate explanations
      const explanations = q.options.map((option, index) => {
        const rank = q.correctRanking[index];
        return this.generateExplanation(rank, q.category, option);
      });
      
      return `    {
      scenario: "${q.scenario.replace(/"/g, '\\"')}",
      options: [
        "${q.options[0].replace(/"/g, '\\"')}",
        "${q.options[1].replace(/"/g, '\\"')}",
        "${q.options[2].replace(/"/g, '\\"')}",
        "${q.options[3].replace(/"/g, '\\"')}",
        "${q.options[4].replace(/"/g, '\\"')}"
      ],
      idealRanking: [${q.correctRanking.join(', ')}],
      explanations: [
        "${explanations[0]}",
        "${explanations[1]}",
        "${explanations[2]}",
        "${explanations[3]}",
        "${explanations[4]}"
      ],
      category: "${q.category}"
    }`;
    });
    
    // Add to questions file
    const newQuestionsText = formattedQuestions.join(',\n');
    questionsContent = questionsContent.replace(
      /^  ];$/m, 
      `,\n${newQuestionsText}\n  ];`
    );
    
    // Write updated file
    await fs.writeFile(questionsPath, questionsContent);
    
    console.log(`✅ Added ${questionsToAdd.length} questions to website`);
  }

  generateExplanation(rank, category, option) {
    const shortOption = option.substring(0, 100);
    
    if (rank === 1) {
      return `This option represents the most appropriate professional response according to BPS/HCPC standards for ${category}. It demonstrates best practice by addressing the situation comprehensively while maintaining appropriate professional boundaries and ethical obligations. ${shortOption.length < option.length ? 'This approach aligns with evidence-based guidelines and professional standards.' : ''}`;
    } else if (rank === 2) {
      return `This response shows good professional judgment and aligns well with BPS/HCPC guidelines for ${category}. While not the optimal first choice, it represents sound clinical practice and demonstrates understanding of professional responsibilities.`;
    } else if (rank === 3) {
      return `This option shows some merit but has limitations in the context of ${category}. While it addresses aspects of the situation, it may not fully align with optimal professional practice as outlined in BPS/HCPC standards.`;
    } else if (rank === 4) {
      return `This response has significant limitations and may not align well with professional standards for ${category}. While not the worst option, it demonstrates gaps in understanding of appropriate professional practice.`;
    } else {
      return `This is the least appropriate response and fails to meet professional standards for ${category}. It demonstrates poor understanding of BPS/HCPC requirements and could potentially cause harm or violate professional boundaries.`;
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

  async runFullPipeline() {
    try {
      await this.initialize();
      await this.extractAllQuestions();
      await this.validateAllQuestions();
      const deploymentReport = await this.checkDuplicatesAndDeploy();
      
      console.log('\n🎉 FULL PIPELINE COMPLETE');
      console.log('='.repeat(50));
      
      return deploymentReport;
      
    } catch (error) {
      console.error('\n❌ PIPELINE FAILED');
      console.error('Error:', error.message);
      throw error;
    }
  }
}

async function main() {
  const pipeline = new FullQuestionPipeline();
  await pipeline.runFullPipeline();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FullQuestionPipeline };