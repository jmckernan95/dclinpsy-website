# DClinPsy SJT Processing Pipeline Guide

A comprehensive guide for processing and validating DClinPsy SJT questions using Gemini 2.0 Pro API.

## 🚨 SECURITY FIRST

**CRITICAL:** Never commit API keys or sensitive training materials to Git!

### 1. Set Up API Key (Required)

```bash
# Get your API key from: https://aistudio.google.com/app/apikey
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# Verify .env is in .gitignore (already configured)
cat .gitignore | grep .env
```

### 2. Environment Setup

```bash
# All packages already installed
npm list @google/generative-ai pdf-parse rtf-parser dotenv fs-extra
```

## 📁 Materials Preparation

### Step 1: Add Your Materials

Place your DClinPsy materials in the following structure:

```
DClinPsy SJT Questions, Answers, and Guidelines/
├── DClinPsy SJT Questions and Answers.rtf
└── DClinPsy BPS and HCPC Guidelines/
    ├── BPS-Code-of-Ethics.pdf
    ├── HCPC-Standards.pdf
    └── [additional PDFs]
```

**Note:** The pipeline can also work with existing questions in the app if no RTF file is provided.

## 🤖 Processing Pipeline

### Available Commands

```bash
# Run individual steps
npm run process-questions    # Validate questions with AI
npm run test-questions      # Test data structure
npm run integrate-questions # Integrate into app

# Run complete pipeline
npm run validate-and-integrate  # Process + integrate
npm run full-pipeline          # Process + test + integrate
```

### Step-by-Step Process

#### 1. Initial Processing
```bash
npm run process-questions
```

**What it does:**
- Loads BPS/HCPC guidelines from PDFs
- Extracts questions from RTF or existing questions.js
- Validates each question against professional standards
- Generates improved feedback with guideline references
- Creates validation report with flagged issues
- Outputs: `validation-report.json` and `src/data/validated-sjt-questions.js`

#### 2. Review Results
```bash
# Check validation report
cat validation-report.json | head -20

# Or use the web interface
npm start
# Navigate to: http://localhost:3000/validation
```

**Review:**
- Number of flagged questions
- Average confidence scores
- Specific issues identified
- Recommendations for improvement

#### 3. Manual Review (if needed)

If questions are flagged for review:
- Use the web interface at `/validation`
- Review each flagged question
- Consider expert clinical psychologist input
- Make necessary adjustments

#### 4. Integration
```bash
npm run integrate-questions
```

**What it does:**
- Creates backups of existing questions
- Replaces current questions with validated versions
- Updates component imports
- Runs integration tests
- Outputs: `integration-report.json`

#### 5. Testing
```bash
npm run test-questions
npm start  # Test the app functionality
npm run build  # Ensure production build works
```

## 📊 Output Files

### Generated Files

| File | Description | Purpose |
|------|-------------|---------|
| `validation-report.json` | Detailed validation results | Review flagged questions |
| `src/data/validated-sjt-questions.js` | Validated question data | App integration |
| `integration-report.json` | Integration results | Verify successful integration |
| `test-results.json` | Structure validation | Ensure data integrity |
| `backups/[timestamp]/` | Original file backups | Rollback if needed |

### Validation Report Structure

```json
{
  "generatedAt": "2024-01-01T00:00:00.000Z",
  "summary": {
    "totalQuestions": 25,
    "validQuestions": 22,
    "flaggedQuestions": 3,
    "averageConfidence": 87
  },
  "categoryBreakdown": {
    "Professional Boundaries": 8,
    "Risk Management": 6,
    "Ethical Dilemmas": 5
  },
  "flaggedQuestions": [
    {
      "id": 15,
      "category": "Risk Management",
      "issues": ["Ranking may not align with current HCPC standards"],
      "recommendations": ["Review with risk assessment expert"],
      "confidenceScore": 65
    }
  ]
}
```

## 🎯 Validation Criteria

The AI validation checks for:

### Professional Standards Alignment
- ✅ BPS Code of Ethics compliance
- ✅ HCPC Standards adherence
- ✅ DClinPsy training level appropriateness
- ✅ Cultural sensitivity and inclusion

### Question Quality
- ✅ Realistic clinical scenarios
- ✅ Clear, unambiguous options
- ✅ Appropriate difficulty level
- ✅ Logical ranking progression

### Feedback Quality
- ✅ Comprehensive explanations
- ✅ Guideline references included
- ✅ Professional reasoning explicit
- ✅ Educational value high

## 🚨 Common Issues & Solutions

### API-Related Issues

**Issue:** "API key not found"
```bash
# Solution: Check .env file
cat .env
echo "GEMINI_API_KEY=your_actual_key_here" > .env
```

**Issue:** "Rate limit exceeded"
```bash
# Solution: The pipeline includes automatic delays
# Wait and retry, or increase delays in process-sjt-questions.js
```

### Data Issues

**Issue:** "No questions found to process"
```bash
# Check existing questions file
ls -la src/questions.js

# Or add RTF file to materials folder
ls -la "DClinPsy SJT Questions, Answers, and Guidelines/"
```

**Issue:** "PDF parsing failed"
```bash
# Check PDF files are readable
file "DClinPsy SJT Questions, Answers, and Guidelines/DClinPsy BPS and HCPC Guidelines/"*.pdf
```

### Integration Issues

**Issue:** "Component imports failed"
```bash
# Restore from backup
npm run integrate-questions  # Has automatic backup/restore
```

**Issue:** "Build fails after integration"
```bash
# Check for syntax errors
npm run build
# If needed, restore backup and investigate
```

## 🔧 Customization

### Adjusting Validation Criteria

Edit `scripts/process-sjt-questions.js`:

```javascript
// Modify validation prompt for different standards
const validationPrompt = `
  Focus on these specific criteria:
  - Enhanced cultural competency requirements
  - Updated supervision standards
  - Recent BPS guideline changes
  ...
`;
```

### Adding New Categories

Edit the categorization logic:

```javascript
const categories = {
  'Your New Category': ['keyword1', 'keyword2'],
  // Add more categories as needed
};
```

### Custom Confidence Thresholds

Modify flagging criteria:

```javascript
if (validation.confidenceScore < 75) {  // Adjust threshold
  this.warnings.push(`Low confidence: ${validation.confidenceScore}%`);
}
```

## 📈 Quality Assurance

### Best Practices

1. **Validation Review:**
   - Always review flagged questions manually
   - Get expert clinical psychologist input for major changes
   - Test with small groups before full deployment

2. **Testing Protocol:**
   - Run complete test suite before deployment
   - Check all question categories are represented
   - Verify randomization and scoring work correctly

3. **Documentation:**
   - Keep detailed records of validation decisions
   - Document any manual overrides or corrections
   - Maintain versioning of question sets

### Quality Metrics

Target benchmarks:
- ✅ Validation confidence: >85%
- ✅ Flagged questions: <10%
- ✅ Category coverage: All 8 domains
- ✅ Question count: 25+ validated questions

## 🔒 Security & Compliance

### Data Protection
- ✅ API keys secured in environment variables
- ✅ Training materials excluded from Git
- ✅ Validation data stored locally only
- ✅ No personal or sensitive data exposed

### Professional Standards
- ✅ All content validated against current BPS/HCPC guidelines
- ✅ Cultural competency requirements met
- ✅ Appropriate for DClinPsy training level
- ✅ Regular updates to reflect guideline changes

## 📞 Support & Troubleshooting

### Getting Help

1. **Check logs:** All scripts provide detailed console output
2. **Review reports:** Check JSON reports for detailed information
3. **Test incrementally:** Use individual commands to isolate issues
4. **Web interface:** Use `/validation` page for visual review

### Common Commands

```bash
# Quick health check
npm run test-questions

# Full validation with existing questions
npm run process-questions

# Review results
cat validation-report.json | jq '.summary'

# Integrate if all looks good
npm run integrate-questions

# Deploy updated questions
npm run deploy
```

---

**Last Updated:** ${new Date().toISOString()}
**Version:** 2.0.0
**Pipeline Status:** ✅ Ready for Production