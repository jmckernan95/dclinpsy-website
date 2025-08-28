# AI Integration Documentation

## Overview

The DClinPsy Prep Hub uses Google Gemini 2.5 Flash AI to validate all practice questions against official BPS (British Psychological Society) and HCPC (Health and Care Professions Council) professional guidelines. This ensures all content meets the highest professional standards for clinical psychology training.

## Architecture

### Google Gemini 2.5 Flash Integration
- **Model**: `gemini-2.5-flash` (primary) with `gemini-1.5-flash-002` fallback
- **API**: Google Generative AI SDK (@google/generative-ai)
- **Cost Limit**: $50.00 per processing run
- **Token Cost**: ~$0.000075 per 1,000 tokens
- **Configuration**: Low temperature (0.1) for consistent professional validation

### Processing Pipeline

#### 1. Question Extraction (`scripts/direct-question-extraction.js`)
- Converts RTF files to plain text using macOS `textutil`
- Extracts 60 questions from source materials
- Categorizes questions based on content analysis
- Generates structured JSON with scenarios, options, and rankings

#### 2. Guideline Processing (`scripts/process-sjt-questions.js`)
- Loads and parses 5 PDF guideline documents (451,242 characters total):
  - BPS Code of Ethics and Conduct.pdf
  - BPS Practice Guidelines.pdf
  - BPS Code of Human Research Ethics.pdf
  - BPS Guidance on ethical competence.pdf
  - HCPC Standards of conduct.pdf
- Creates comprehensive validation standards for AI reference

#### 3. AI Validation (`scripts/validate-all-60-questions.js`)
- Processes questions in batches of 3 to manage API limits
- Validates each question against professional standards:
  - Scenario realism for the clinical domain
  - Response option appropriateness
  - Ranking accuracy per BPS/HCPC guidelines
  - Category assignment correctness
- Generates confidence scores (0-100%) for each question

#### 4. Quality Filtering
- High-confidence threshold: 90%+ for deployment
- Duplicate detection using 60% similarity threshold
- Manual question integration with 90% confidence rating

#### 5. Deployment (`scripts/deploy-validated-questions.js`)
- Loads validated questions from multiple sources
- Performs duplicate checking against existing question bank
- Integrates questions into `src/questions.js`
- Creates automatic backups before modification
- Validates JavaScript syntax post-deployment

## Validation Standards

The AI validates questions against comprehensive BPS/HCPC standards:

### Risk Management
- Systematic assessment: plans, means, intent, protective factors
- Proportionate response: balance safety with autonomy
- Documentation requirements for all risk decisions

### Safeguarding
- Children (under-18): protection overrides confidentiality
- Vulnerable adults: cognitive impairment, self-neglect indicators
- Mandatory reporting when harm risk identified

### Professional Boundaries
- Therapeutic limits: gifts, social contact, dual relationships
- Consistent boundaries in all contexts
- Cultural adaptation while maintaining professional integrity

### Confidentiality
- Break only when legally required or consent given
- Imminent harm overrides confidentiality
- Transparency about limits from therapy start

### Service Delivery
- Equitable access regardless of background
- Fair resource allocation and waiting list management
- Accessible communication for diverse audiences

## Current Status

### Question Bank
- **Total Questions**: 32 (28 original + 4 newly validated)
- **Categories Added**: 
  - Interprofessional Working: 1 question (95% confidence)
  - Safeguarding: 2 questions (90% confidence)
  - Professional Boundaries: 1 question (90% confidence)

### Processing Results
- **Source Questions**: 60 extracted from DClinPsy materials
- **Validation Candidates**: 11 high-quality questions identified
- **Deployment Success**: 4 questions passed duplicate checking and deployed
- **Duplicates Prevented**: 4 similar questions filtered out

## Files and Scripts

### Core Processing Scripts
```
scripts/
├── direct-question-extraction.js      # RTF to JSON question extraction
├── validate-all-60-questions.js       # Comprehensive AI validation
├── deploy-validated-questions.js      # Question deployment with duplicate checking
├── process-sjt-questions.js          # Main validation pipeline
└── [legacy processing scripts]        # Previous iterations and experiments
```

### Source Materials
```
DClinPsy SJT Questions, Answers, and Guidelines/
├── DClinPsy SJT Questions and Answers.rtf    # 60 practice questions
└── DClinPsy BPS and HCPC Guidelines/         # Professional standards PDFs
```

### Generated Files
```
├── directly-extracted-questions.json          # Raw extracted questions
├── final-deployment-report.json              # Deployment summary
├── simple-comprehensive-validation-report.json # Validation results
└── [other validation reports]                 # Processing history
```

## Environment Setup

### Required Environment Variables
```env
GEMINI_API_KEY=your_api_key_here
```

### Dependencies
```json
{
  "@google/generative-ai": "^0.21.0",
  "dotenv": "^17.2.1",
  "fs-extra": "^11.2.0",
  "pdf-parse": "^1.1.1"
}
```

## Usage

### Running the Complete Pipeline
```bash
# Extract questions from source materials
node scripts/direct-question-extraction.js

# Validate questions against BPS/HCPC guidelines
node scripts/validate-all-60-questions.js

# Deploy validated questions to website
node scripts/deploy-validated-questions.js
```

### Cost Management
- Real-time cost tracking during processing
- Automatic stopping at 90% of $50 budget limit
- Estimated costs displayed before processing begins

## Quality Assurance

### Validation Criteria
1. **Professional Accuracy**: Responses align with BPS/HCPC standards
2. **Scenario Realism**: Clinical situations are authentic and relevant
3. **Ranking Logic**: Option ordering reflects professional best practices
4. **Category Fit**: Questions are correctly categorized by clinical domain

### Duplicate Prevention
- MD5 hashing of scenario content for exact match detection
- Word overlap analysis for similarity detection (60% threshold)
- Cross-reference with existing website question bank

### Deployment Safety
- Automatic backup creation before any file modification
- JavaScript syntax validation after deployment
- Rollback capability if validation fails

## Future Enhancements

### Potential Improvements
- **Continuous Validation**: Regular re-validation of existing questions
- **Feedback Integration**: Incorporate user feedback into validation process
- **Advanced NLP**: Enhanced similarity detection and categorization
- **Multi-Model Validation**: Cross-validation using multiple AI models
- **Real-time Processing**: Live question validation during content creation

### Scalability Considerations
- **Batch Processing**: Optimize for larger question sets
- **Cost Optimization**: Implement more efficient token usage
- **Caching**: Store validation results for faster reprocessing
- **API Management**: Handle rate limits and quotas automatically

---

**Last Updated**: August 2024  
**AI Model**: Google Gemini 2.5 Flash  
**Integration Version**: 1.0.0