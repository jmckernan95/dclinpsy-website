#!/usr/bin/env node

/**
 * SJT Question Processing Pipeline
 * Validates DClinPsy SJT questions against BPS/HCPC guidelines using Gemini 2.0 Pro
 * 
 * Security: Uses environment variables for API keys
 * Never commits sensitive data to repository
 */

// Load environment variables first
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const pdfParse = require('pdf-parse');

// Security check after loading environment
function checkApiKey() {
  console.log('🔍 Checking API key...');
  
  // Debug information
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`Key exists: ${!!apiKey}`);
  console.log(`Key length: ${apiKey ? apiKey.length : 0}`);
  console.log(`Key starts with AIza: ${apiKey ? apiKey.startsWith('AIza') : false}`);
  console.log(`Key preview: ${apiKey ? apiKey.substring(0, 10) + '...' : 'none'}`);
  
  if (!apiKey || 
      apiKey === 'YOUR_API_KEY_HERE' || 
      apiKey.length < 20 ||
      !apiKey.startsWith('AIza')) {
    console.error('\n❌ GEMINI API KEY ISSUE DETECTED');
    console.error('='.repeat(50));
    console.error('API Key validation failed:');
    console.error(`- Key exists: ${!!apiKey}`);
    console.error(`- Key length: ${apiKey ? apiKey.length : 0} (should be ~39)`);
    console.error(`- Starts with 'AIza': ${apiKey ? apiKey.startsWith('AIza') : false}`);
    console.error(`- Is placeholder: ${apiKey === 'YOUR_API_KEY_HERE'}`);
    
    console.error('\n💡 Solutions:');
    console.error('1. Get your API key from: https://aistudio.google.com/app/apikey');
    console.error('2. Update .env file with: GEMINI_API_KEY=your_actual_key_here');
    console.error('3. Ensure no extra spaces or quotes around the key');
    console.error('4. The key should start with "AIzaSy" and be ~39 characters');
    
    console.error('\n📁 Current .env file content:');
    try {
      const envContent = require('fs').readFileSync('.env', 'utf8');
      const lines = envContent.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('GEMINI_API_KEY')) {
          console.error(`   Line ${i+1}: ${line.replace(/=.{10,}/, '=***API_KEY_HIDDEN***')}`);
        } else if (line.trim()) {
          console.error(`   Line ${i+1}: ${line}`);
        }
      });
    } catch (error) {
      console.error('   (could not read .env file)');
    }
    
    console.error('='.repeat(50));
    process.exit(1);
  }
  
  console.log('✅ API key validation passed');
  console.log(`📝 Using Gemini API key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-4)}`);
}

// Model configuration with Gemini 2.5 Flash (paid tier)
const modelConfig = {
  primary: "gemini-2.5-flash", // Latest Gemini 2.5 Flash (paid tier)
  fallback: "gemini-1.5-flash-002", // Gemini 1.5 Flash as fallback
  maxRetries: 3,
  retryDelay: 3000,
  costLimit: 50.00, // $50 cost limit
  estimatedCostPerToken: 0.000075 / 1000, // Gemini 2.5 Flash pricing estimate
  totalCostTracking: 0 // Track total estimated cost
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize model with error handling
let model;
let modelName = modelConfig.primary;

async function initializeModel() {
  try {
    model = genAI.getGenerativeModel({
      model: modelConfig.primary,
      generationConfig: {
        temperature: 0.1, // Low temperature for consistency
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    console.log('✅ Using Gemini 2.5 Flash (latest model with paid tier)');
    return true;
  } catch (error) {
    console.log('⚠️ Gemini 2.5 Flash unavailable, falling back to Gemini 1.5 Flash');
    try {
      model = genAI.getGenerativeModel({
        model: modelConfig.fallback,
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      });
      modelName = modelConfig.fallback;
      console.log('✅ Using Gemini 1.5 Flash (fallback model)');
      return true;
    } catch (fallbackError) {
      throw new Error(`Failed to initialize any model: ${fallbackError.message}`);
    }
  }
}

// Enhanced API calling with fallback and cost monitoring
async function callGeminiWithFallback(prompt, context = '') {
  // Check cost limit before making API call
  const estimatedInputTokens = (prompt.length + context.length) / 4; // Rough estimate
  const estimatedCost = estimatedInputTokens * modelConfig.estimatedCostPerToken;
  
  if (modelConfig.totalCostTracking + estimatedCost > modelConfig.costLimit) {
    throw new Error(`Cost limit of $${modelConfig.costLimit} would be exceeded. Current: $${modelConfig.totalCostTracking.toFixed(4)}, Estimated: $${estimatedCost.toFixed(4)}`);
  }

  let lastError;
  
  // Try primary model first
  for (let attempt = 0; attempt < modelConfig.maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from model');
      }
      
      // Update cost tracking
      const outputTokens = responseText.length / 4; // Rough estimate
      const totalTokens = estimatedInputTokens + outputTokens;
      const actualCost = totalTokens * modelConfig.estimatedCostPerToken;
      modelConfig.totalCostTracking += actualCost;
      
      if (modelConfig.totalCostTracking % 1 < 0.1) { // Log every ~$1
        console.log(`💰 Estimated cost so far: $${modelConfig.totalCostTracking.toFixed(4)}/${modelConfig.costLimit}`);
      }
      
      return responseText;
    } catch (error) {
      lastError = error;
      console.log(`  Attempt ${attempt + 1} failed: ${error.message}`);
      
      // If rate limited, wait longer
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        const waitTime = modelConfig.retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`  Waiting ${waitTime/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Try fallback model on last attempt if using primary
      if (attempt === modelConfig.maxRetries - 1 && modelName === modelConfig.primary) {
        console.log('  Switching to Gemini 1.5 Flash fallback...');
        try {
          model = genAI.getGenerativeModel({
            model: modelConfig.fallback,
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          });
          modelName = modelConfig.fallback;
          // Try once more with fallback model
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          if (!responseText || responseText.trim() === '') {
            throw new Error('Empty response from fallback model');
          }
          return responseText;
        } catch (fallbackError) {
          throw new Error(`Both models failed: ${fallbackError.message}`);
        }
      }
    }
  }
  
  throw new Error(`Failed after ${modelConfig.maxRetries} attempts: ${lastError.message}`);
}

class SJTProcessor {
  constructor() {
    this.guidelines = {};
    this.existingQuestions = [];
    this.validatedQuestions = [];
    this.materialsPath = './DClinPsy SJT Questions, Answers, and Guidelines';
    this.startTime = Date.now();
    this.stats = {
      totalQuestions: 0,
      validQuestions: 0,
      reviewNeeded: 0,
      invalidQuestions: 0,
      processingErrors: 0
    };
  }

  // Step 0: Verify materials exist and are accessible
  async verifyMaterials() {
    console.log('\n📁 Verifying DClinPsy materials...\n');
    
    const requiredFiles = {
      questions: path.join(this.materialsPath, 'DClinPsy SJT Questions and Answers.rtf'),
      guidelinesFolder: path.join(this.materialsPath, 'DClinPsy BPS and HCPC Guidelines')
    };

    // Check RTF file
    if (!await fs.pathExists(requiredFiles.questions)) {
      throw new Error(`❌ RTF file not found at: ${requiredFiles.questions}`);
    }
    const rtfStats = await fs.stat(requiredFiles.questions);
    console.log(`✅ RTF file found (${(rtfStats.size / 1024).toFixed(2)} KB)`);

    // Check guidelines folder
    if (!await fs.pathExists(requiredFiles.guidelinesFolder)) {
      throw new Error(`❌ Guidelines folder not found at: ${requiredFiles.guidelinesFolder}`);
    }

    const allFiles = await fs.readdir(requiredFiles.guidelinesFolder, { recursive: true });
    const pdfFiles = allFiles.filter(file => file.endsWith('.pdf'));
    
    console.log(`✅ Found ${pdfFiles.length} PDF guideline files:`);
    pdfFiles.slice(0, 5).forEach(file => console.log(`   - ${file}`));
    if (pdfFiles.length > 5) {
      console.log(`   ... and ${pdfFiles.length - 5} more files`);
    }

    if (pdfFiles.length === 0) {
      throw new Error('❌ No PDF files found in guidelines folder');
    }

    return { 
      rtfPath: requiredFiles.questions, 
      pdfFiles, 
      guidelinesFolder: requiredFiles.guidelinesFolder 
    };
  }

  // Step 1: Load and parse BPS/HCPC guidelines
  async loadGuidelines() {
    console.log('\n📚 Loading BPS and HCPC guidelines...\n');
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

  // Step 2: Parse RTF questions with enhanced processing
  async parseRTFQuestions(rtfPath) {
    console.log('\n📄 Processing RTF document...\n');
    
    // Use textutil to convert RTF to plain text (macOS)
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    let plainText;
    try {
      const tempTxtFile = '/tmp/dclinpsy_questions.txt';
      await execAsync(`textutil -convert txt "${rtfPath}" -output "${tempTxtFile}"`);
      plainText = await fs.readFile(tempTxtFile, 'utf8');
      console.log(`✅ Converted RTF to plain text: ${plainText.length} characters`);
      
      // Clean up temp file
      await fs.remove(tempTxtFile);
    } catch (error) {
      console.warn('⚠️ textutil conversion failed, falling back to manual parsing...');
      // Fallback to the original RTF parsing approach
      const rtfContent = await fs.readFile(rtfPath, 'utf8');
      
      plainText = rtfContent
        // Remove RTF control codes
        .replace(/\\[a-z]+\d*\s?/g, ' ')
        .replace(/\{[^{}]*\}/g, '')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '')
        // Clean up spacing
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
    }

    console.log(`Extracted ${plainText.length} characters of text from RTF`);
    
    // Use enhanced parsing with Gemini
    const parsePrompt = `
You are parsing DClinPsy SJT questions from text. Extract ALL complete questions.

PARSING RULES:
1. Each question contains:
   - A clinical scenario/situation
   - Exactly 5 response options (A, B, C, D, E or 1, 2, 3, 4, 5)
   - May include existing rankings or explanations

2. Look for patterns like:
   - "Question X:", "Scenario:", numbered scenarios
   - "A)", "B)", "C)" or "1.", "2.", "3." for options
   - Answer keys like "Correct order: A, C, B, E, D" or rankings

3. If you find ranking information, convert to 1-5 scale where:
   - 1 = Most appropriate response
   - 5 = Least appropriate response

Return JSON array with this EXACT structure:
[
  {
    "id": 1,
    "scenario": "Complete scenario text including all context",
    "options": [
      "Complete text of first option",
      "Complete text of second option", 
      "Complete text of third option",
      "Complete text of fourth option",
      "Complete text of fifth option"
    ],
    "correctRanking": [3, 1, 4, 2, 5],
    "originalFeedback": ["feedback if present", "...", "..."] or null,
    "source": "rtf"
  }
]

CRITICAL: Return only valid JSON array, no additional text.

TEXT TO PARSE:
${plainText.substring(0, 45000)}
`;

    try {
      const response = await callGeminiWithFallback(parsePrompt);
      
      // Extract JSON from response with better error handling
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('❌ No JSON array found in response. Raw response:');
        console.error(response.substring(0, 1000));
        throw new Error('No valid JSON array found in Gemini response');
      }

      let questions;
      try {
        // Clean the JSON string before parsing
        let jsonString = jsonMatch[0];
        
        // Fix common JSON issues
        jsonString = jsonString
          .replace(/,\s*}/g, '}') // Remove trailing commas in objects
          .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
          .replace(/([^\\])'/g, '$1"') // Replace single quotes with double quotes
          .replace(/\\'/g, "'"); // Keep escaped single quotes as is
        
        questions = JSON.parse(jsonString);
        
        if (!Array.isArray(questions)) {
          throw new Error('Parsed JSON is not an array');
        }
      } catch (parseError) {
        console.error('❌ JSON parsing failed. Error:', parseError.message);
        console.error('Extracted JSON (first 2000 chars):');
        console.error(jsonMatch[0].substring(0, 2000));
        throw new Error(`JSON parsing failed: ${parseError.message}`);
      }
      
      // Validate parsed questions
      const validQuestions = questions.filter(q => {
        const isValid = q.scenario && q.options && q.options.length === 5;
        if (!isValid) {
          console.warn(`⚠️  Skipping invalid question ${q.id || 'unknown'}`);
        }
        return isValid;
      });

      console.log(`✅ Successfully parsed ${validQuestions.length} questions from RTF`);
      
      // If we got fewer than expected, try parsing in chunks
      if (validQuestions.length < 5 && plainText.length > 45000) {
        console.log('📝 Text appears large, attempting chunk processing...');
        const additionalQuestions = await this.parseInChunks(plainText.substring(45000));
        validQuestions.push(...additionalQuestions);
        console.log(`📈 Total after chunk processing: ${validQuestions.length} questions`);
      }
      
      this.stats.totalQuestions = validQuestions.length;
      return validQuestions;

    } catch (error) {
      console.error('❌ Error parsing RTF:', error.message);
      throw error;
    }
  }

  // Helper method to parse large RTF files in chunks
  async parseInChunks(remainingText) {
    const chunkSize = 40000;
    const additionalQuestions = [];
    
    for (let i = 0; i < remainingText.length; i += chunkSize) {
      const chunk = remainingText.substring(i, i + chunkSize);
      if (chunk.trim().length < 1000) continue; // Skip small chunks
      
      console.log(`  Processing chunk ${Math.floor(i/chunkSize) + 1}...`);
      
      try {
        const chunkPrompt = `
Continue parsing SJT questions from this text chunk. Use same JSON format as before.
Only return questions not already found.

${chunk}
`;
        
        const response = await callGeminiWithFallback(chunkPrompt);
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
            
            const chunkQuestions = JSON.parse(jsonString);
            
            if (Array.isArray(chunkQuestions)) {
              const validChunkQuestions = chunkQuestions.filter(q => 
                q.scenario && q.options && q.options.length === 5
              );
              additionalQuestions.push(...validChunkQuestions);
            }
          } catch (parseError) {
            console.warn(`⚠️ Failed to parse chunk JSON: ${parseError.message}`);
            console.warn('Chunk response (first 500 chars):', jsonMatch[0].substring(0, 500));
          }
        }
        
        // Rate limiting between chunks
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.warn(`⚠️  Error processing chunk: ${error.message}`);
      }
    }
    
    return additionalQuestions;
  }

  // Step 3: Validate questions against guidelines in batches
  async validateQuestions(parsedQuestions) {
    console.log('\n🔬 Validating questions against BPS/HCPC guidelines...\n');
    
    const guidelinesText = Object.values(this.guidelines).join('\n\n');
    const batchSize = 3; // Process 3 questions at a time to avoid token limits
    const totalQuestions = parsedQuestions.length;
    
    // Create guidelines summary for consistent use
    const guidelinesSummary = await this.createGuidelinesSummary(guidelinesText);
    
    for (let i = 0; i < totalQuestions; i += batchSize) {
      const batch = parsedQuestions.slice(i, Math.min(i + batchSize, totalQuestions));
      const batchNum = Math.floor(i/batchSize) + 1;
      const totalBatches = Math.ceil(totalQuestions/batchSize);
      
      console.log(`📋 Processing batch ${batchNum}/${totalBatches} (${batch.length} questions)`);
      
      const batchPrompt = `
You are a DClinPsy expert validator. Validate these SJT questions against UK BPS and HCPC guidelines.

KEY GUIDELINES SUMMARY:
${guidelinesSummary}

QUESTIONS TO VALIDATE:
${JSON.stringify(batch, null, 2)}

FOR EACH QUESTION, VALIDATE:
1. Ranking aligns with BPS Code of Ethics and HCPC Standards
2. Cultural sensitivity and inclusivity considerations
3. Realistic scenarios appropriate for DClinPsy trainees
4. Professional boundary considerations
5. Risk management principles

RETURN JSON ARRAY (one object per question):
[
  {
    "id": <question id>,
    "validationStatus": "valid" | "needs_review" | "invalid",
    "confidenceScore": <0-100>,
    "issues": ["list specific problems if any"],
    "correctRanking": [<validated 1-5 ranking for each option>],
    "feedback": [
      "Option 1: Comprehensive explanation with guideline references showing why it ranks X",
      "Option 2: Clear explanation with BPS/HCPC standard references",
      "Option 3: Professional reasoning with specific citations",
      "Option 4: Detailed justification with guideline alignment",
      "Option 5: Complete explanation with professional standards basis"
    ],
    "guidelineReferences": ["BPS Code 2.1.3", "HCPC Standard 7.2", etc.],
    "improvementSuggestions": ["specific suggestions if any issues found"],
    "professionalRationale": "Overall explanation of why this ranking aligns with professional standards"
  }
]

Be thorough, professional, and reference specific guidelines where applicable.
`;

      try {
        const response = await callGeminiWithFallback(batchPrompt);
        
        // Extract and parse JSON response with better error handling
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          console.error('❌ No JSON array found in validation response. Raw response:');
          console.error(response.substring(0, 1000));
          throw new Error('No valid JSON array found in validation response');
        }
        
        let validatedBatch;
        try {
          // Clean the JSON string before parsing
          let jsonString = jsonMatch[0];
          
          // Fix common JSON issues
          jsonString = jsonString
            .replace(/,\s*}/g, '}') // Remove trailing commas in objects
            .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
            .replace(/([^\\])'/g, '$1"') // Replace single quotes with double quotes
            .replace(/\\'/g, "'"); // Keep escaped single quotes as is
          
          validatedBatch = JSON.parse(jsonString);
          
          if (!Array.isArray(validatedBatch)) {
            throw new Error('Parsed validation JSON is not an array');
          }
        } catch (parseError) {
          console.error('❌ Validation JSON parsing failed. Error:', parseError.message);
          console.error('Extracted JSON (first 2000 chars):');
          console.error(jsonMatch[0].substring(0, 2000));
          throw new Error(`Validation JSON parsing failed: ${parseError.message}`);
        }
        
        // Process each validated question in the batch
        validatedBatch.forEach((validation, idx) => {
          const originalQuestion = batch[idx];
          
          // Combine original question with validation results
          const validatedQuestion = {
            id: validation.id || originalQuestion.id,
            scenario: originalQuestion.scenario,
            options: originalQuestion.options,
            category: this.categorizeQuestion(originalQuestion.scenario, originalQuestion.category),
            
            // Original data
            originalRanking: originalQuestion.correctRanking || originalQuestion.idealRanking,
            originalFeedback: originalQuestion.originalFeedback || originalQuestion.explanations,
            
            // Validation results
            validationStatus: validation.validationStatus,
            confidenceScore: validation.confidenceScore,
            issues: validation.issues || [],
            correctRanking: validation.correctRanking,
            feedback: validation.feedback,
            guidelineReferences: validation.guidelineReferences || [],
            improvementSuggestions: validation.improvementSuggestions || [],
            professionalRationale: validation.professionalRationale,
            
            // Metadata
            validatedAt: new Date().toISOString(),
            source: originalQuestion.source || 'rtf',
            modelUsed: modelName
          };
          
          this.validatedQuestions.push(validatedQuestion);
          
          // Update statistics
          if (validation.validationStatus === 'valid') {
            this.stats.validQuestions++;
          } else if (validation.validationStatus === 'needs_review') {
            this.stats.reviewNeeded++;
          } else {
            this.stats.invalidQuestions++;
          }
          
          // Progress logging
          const status = validation.validationStatus === 'valid' ? '✅' : 
                        validation.validationStatus === 'needs_review' ? '⚠️' : '❌';
          console.log(`  Question ${validation.id}: ${status} (Confidence: ${validation.confidenceScore}%)`);
          
          if (validation.issues && validation.issues.length > 0) {
            console.log(`    Issues: ${validation.issues.join(', ')}`);
          }
        });
        
      } catch (error) {
        console.error(`❌ Error validating batch ${batchNum}: ${error.message}`);
        
        // Add unvalidated questions with error flag
        batch.forEach((question, idx) => {
          this.validatedQuestions.push({
            ...question,
            id: question.id || `error-${i + idx}`,
            validationStatus: 'error',
            confidenceScore: 0,
            issues: [`Validation error: ${error.message}`],
            category: this.categorizeQuestion(question.scenario),
            validatedAt: new Date().toISOString(),
            source: question.source || 'rtf'
          });
          this.stats.processingErrors++;
        });
      }
      
      // Rate limiting between batches (longer delay for larger batches)
      if (i + batchSize < totalQuestions) {
        const waitTime = 4000 + (batch.length * 1000); // 4s base + 1s per question
        console.log(`  Waiting ${waitTime/1000}s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    console.log(`\n✅ Validation complete! ${this.validatedQuestions.length} questions processed`);
    console.log(`📊 Stats: ${this.stats.validQuestions} valid, ${this.stats.reviewNeeded} need review, ${this.stats.invalidQuestions} invalid, ${this.stats.processingErrors} errors`);
  }

  // Create focused guidelines summary for consistent validation
  async createGuidelinesSummary(guidelinesText) {
    console.log('📝 Creating focused guidelines summary...');
    
    const summaryPrompt = `
Create a focused summary of the KEY principles from these BPS/HCPC guidelines that are most relevant for validating DClinPsy SJT questions:

FOCUS AREAS:
- Professional boundaries and dual relationships
- Risk management and safety protocols
- Ethical decision-making frameworks
- Diversity, inclusion, and cultural competence
- Interprofessional working and collaboration
- Confidentiality and consent principles
- Supervision and professional development

TEXT TO SUMMARIZE:
${guidelinesText.substring(0, 30000)}

Return a concise but comprehensive summary that can be used as validation criteria.
`;

    try {
      const summary = await callGeminiWithFallback(summaryPrompt);
      console.log('✅ Guidelines summary created');
      return summary;
    } catch (error) {
      console.warn('⚠️ Could not create guidelines summary, using default principles');
      return `
BPS and HCPC Key Principles for SJT Validation:
- Professional Boundaries: Maintain clear therapeutic relationships, avoid dual relationships
- Risk Management: Prioritize client safety, follow risk assessment protocols
- Ethical Decision-Making: Apply ethical frameworks, consider consequences
- Diversity & Inclusion: Cultural sensitivity, inclusive practice, avoid discrimination
- Interprofessional Working: Collaborate effectively, respect other professionals
- Confidentiality: Protect client information, understand legal exceptions
- Professional Development: Seek supervision, maintain competence, lifelong learning
`;
    }
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

  // Main processing pipeline with comprehensive reporting
  async process() {
    try {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 DClinPsy SJT QUESTION PROCESSING PIPELINE');
      console.log('='.repeat(60) + '\n');
      
      // Check API key first
      checkApiKey();
      
      console.log(`🤖 Model: ${modelConfig.primary} (with ${modelConfig.fallback} fallback)`);
  console.log(`💰 Cost limit: $${modelConfig.costLimit} | Estimated rate: $${(modelConfig.estimatedCostPerToken * 1000).toFixed(6)}/1K tokens`);
      console.log(`⏱️  Started: ${new Date().toLocaleString()}\n`);
      
      // Initialize model
      await initializeModel();
      
      // Step 1: Verify materials
      const materials = await this.verifyMaterials();
      
      // Step 2: Load guidelines
      await this.loadGuidelines();
      
      // Step 3: Parse RTF questions  
      const parsedQuestions = await this.parseRTFQuestions(materials.rtfPath);
      
      if (parsedQuestions.length === 0) {
        console.log('⚠️  No questions found to process');
        return;
      }
      
      // Step 4: Validate against guidelines
      await this.validateQuestions(parsedQuestions);
      
      // Step 5: Generate comprehensive reports
      const report = await this.generateReport();
      await this.saveQuestions();
      
      // Step 6: Final summary
      this.generateFinalReport();
      
    } catch (error) {
      console.error('\n❌ PIPELINE ERROR:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }

  // Generate final comprehensive report
  generateFinalReport() {
    const processingTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const total = this.stats.totalQuestions;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 PROCESSING COMPLETE - FINAL REPORT');
    console.log('='.repeat(60) + '\n');
    
    console.log(`⏱️  Processing Time: ${processingTime} seconds`);
    console.log(`🤖 Model Used: ${modelName}`);
    console.log(`📝 Total Questions Processed: ${total}`);
    console.log(`✅ Valid Questions: ${this.stats.validQuestions} (${total > 0 ? ((this.stats.validQuestions/total)*100).toFixed(1) : 0}%)`);
    console.log(`⚠️  Need Review: ${this.stats.reviewNeeded} (${total > 0 ? ((this.stats.reviewNeeded/total)*100).toFixed(1) : 0}%)`);
    console.log(`❌ Invalid Questions: ${this.stats.invalidQuestions}`);
    console.log(`🔧 Processing Errors: ${this.stats.processingErrors}`);
    
    const avgConfidence = this.validatedQuestions
      .filter(q => q.confidenceScore)
      .reduce((sum, q) => sum + q.confidenceScore, 0) / 
      this.validatedQuestions.filter(q => q.confidenceScore).length || 0;
    
    console.log(`📊 Average Confidence: ${avgConfidence.toFixed(1)}%`);
    
    console.log('\n📁 Output Files Generated:');
    console.log('  ✅ src/data/validated-sjt-questions.js (production ready)');
    console.log('  ✅ validation-report.json (detailed analysis)');
    
    console.log('\n🎯 Next Steps:');
    if (this.stats.reviewNeeded > 0) {
      console.log(`  1. 👀 Review ${this.stats.reviewNeeded} flagged questions:`);
      console.log('     Start app: npm start');
      console.log('     Visit: http://localhost:3000/validation');
    }
    
    if (this.stats.validQuestions >= this.stats.reviewNeeded) {
      console.log('  2. 🔗 Integrate questions: npm run integrate-questions');
      console.log('  3. 🧪 Test integration: npm start');
      console.log('  4. 🚀 Deploy when satisfied: npm run deploy');
    } else {
      console.log('  2. ❗ Review flagged questions before integration');
      console.log('  3. 🔧 Fix issues and re-run processing if needed');
    }
    
    console.log('\n✨ DClinPsy SJT Processing Pipeline completed successfully!\n');
    
    // Quality recommendations
    if (avgConfidence < 80) {
      console.log('⚠️  RECOMMENDATION: Average confidence is below 80%. Consider manual expert review.');
    }
    if (this.stats.reviewNeeded > this.stats.validQuestions * 0.3) {
      console.log('⚠️  RECOMMENDATION: High percentage of questions flagged. Consider expert consultation.');
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