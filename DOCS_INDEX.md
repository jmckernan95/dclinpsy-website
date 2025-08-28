# Documentation Index

**Complete guide to DClinPsy Prep Hub documentation**

## 🚀 Getting Started
Start here for new Claude Code sessions or project onboarding:

### Essential Reading
1. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - **START HERE** - Quick project summary and architecture
2. **[README.md](./README.md)** - Complete project documentation and features
3. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide and hosting setup

## 🤖 AI Integration
Comprehensive documentation of the Gemini AI validation system:

### AI & Processing
4. **[AI_INTEGRATION.md](./AI_INTEGRATION.md)** - Complete AI validation pipeline documentation
5. **[SJT_PROCESSING_GUIDE.md](./SJT_PROCESSING_GUIDE.md)** - Step-by-step processing workflow

## 📋 Development & Structure
Technical documentation for developers:

### Code Structure
6. **[QUESTIONS_STRUCTURE.md](./QUESTIONS_STRUCTURE.md)** - Question data format specification
7. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guidelines for contributors

### Testing & Quality
8. **[TESTING.md](./TESTING.md)** - Testing procedures and protocols

## 📈 Project Management
Planning and tracking documentation:

### Status & Planning
9. **[TODO.md](./TODO.md)** - Outstanding tasks and future enhancements
10. **[CHANGES.md](./CHANGES.md)** - Change log and version history

### Legacy Documentation
11. **[REDESIGN_CHANGES.md](./REDESIGN_CHANGES.md)** - Historical redesign notes
12. **[COMPREHENSIVE-VALIDATION-REPORT.md](./COMPREHENSIVE-VALIDATION-REPORT.md)** - Detailed validation analysis

## 📁 File Organization

### Source Code Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── contexts/      # React Context providers
├── data/          # Static data files
├── utils/         # Helper functions
└── questions.js   # Main question bank (32 questions)
```

### Processing Scripts
```
scripts/
├── direct-question-extraction.js      # RTF to JSON extraction
├── validate-all-60-questions.js       # AI validation pipeline
├── deploy-validated-questions.js      # Deployment with quality checks
└── [legacy scripts]                   # Previous processing attempts
```

### Data Files
```
data/
└── processing-results/                 # All generated processing files
    ├── directly-extracted-questions.json
    ├── final-deployment-report.json
    └── [validation reports]
```

### Source Materials
```
DClinPsy SJT Questions, Answers, and Guidelines/
├── DClinPsy SJT Questions and Answers.rtf     # 60 source questions
└── DClinPsy BPS and HCPC Guidelines/          # Professional standards (5 PDFs)
```

## 🎯 Quick Reference

### For New Claude Code Sessions
1. Read **PROJECT_OVERVIEW.md** first (2 min read)
2. Check current status in **TODO.md**
3. Review **AI_INTEGRATION.md** if working with questions
4. Use **DEPLOYMENT.md** for any hosting changes

### For Development Work
1. **QUESTIONS_STRUCTURE.md** - Data format reference
2. **CONTRIBUTING.md** - Code standards and practices
3. **TESTING.md** - Testing procedures

### For AI/Processing Work
1. **AI_INTEGRATION.md** - Complete AI pipeline docs
2. **SJT_PROCESSING_GUIDE.md** - Step-by-step workflows
3. Check `data/processing-results/` for latest outputs

## 🔍 Finding Information

### Common Questions
- **"What does this project do?"** → PROJECT_OVERVIEW.md
- **"How do I deploy changes?"** → DEPLOYMENT.md  
- **"How does the AI work?"** → AI_INTEGRATION.md
- **"What's the question format?"** → QUESTIONS_STRUCTURE.md
- **"What needs to be done?"** → TODO.md
- **"How do I run tests?"** → TESTING.md

### File Locations
- **Live code**: `src/` directory
- **Processing scripts**: `scripts/` directory
- **Generated data**: `data/processing-results/` directory
- **Documentation**: Root directory (*.md files)

---

**Note**: This documentation is maintained to ensure efficient onboarding for new Claude Code sessions and smooth project continuity.