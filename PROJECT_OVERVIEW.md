# DClinPsy Prep Hub - Project Overview

**Quick Scan Guide for Claude Code Sessions**

## Project Summary
Complete preparation platform for Doctorate in Clinical Psychology applications. Features AI-validated SJT practice using Google Gemini 2.5 Flash, statistics learning, live psychology news, and comprehensive preparation resources.

## Current Status: Version 5
- ✅ **32 Validated Questions** deployed (28 original + 4 AI-validated)
- ✅ **Gemini AI Integration** fully operational
- ✅ **BPS/HCPC Compliance** validated against official guidelines
- ✅ **Live Deployment** at https://jmckernan95.github.io/dclinpsy-website
- ✅ **Full Feature Set** including SJT, Statistics, News, Blog, Events

## Architecture Overview

### Frontend (React 18.2.0)
```
src/
├── App.js                 # Main application with routing
├── components/           # Reusable UI components
│   ├── Header.js         # Navigation with auth integration
│   ├── Footer.js         # Site footer
│   └── [feature folders] # Organized by feature
├── pages/               # Route components
│   ├── Home.js          # Landing page with all features
│   ├── Practice.js      # SJT test interface
│   ├── Statistics/      # Statistics learning modules
│   └── [other pages]    # News, Blog, Events, etc.
├── contexts/            # React Context providers
├── data/                # Static data files
└── utils/               # Helper functions and utilities
```

### AI Processing Pipeline
```
scripts/
├── direct-question-extraction.js    # RTF → JSON extraction
├── validate-all-60-questions.js     # AI validation against BPS/HCPC
├── deploy-validated-questions.js    # Deployment with duplicate checking
└── process-sjt-questions.js         # Main processing pipeline
```

### Question Bank
- **File**: `src/questions.js` (32 questions total)
- **Format**: Array of objects with scenario, options, idealRanking, explanations, category
- **Categories**: Professional Boundaries, Risk Management, Safeguarding, etc.
- **Scoring**: Proximity-based (4 points max per answer, 200 points total per test)

## Key Features by Section

### 🧠 SJT Practice
- **32 Professional Questions** validated against BPS/HCPC standards
- **Click-to-rank Interface** for intuitive response ordering
- **Randomized Answer Order** prevents pattern memorization
- **Detailed Feedback** with professional explanations
- **Progress Tracking** with category-specific analytics

### 📊 Statistics Learning
- **Interactive Theory** modules covering key concepts
- **Practice Tests** with immediate feedback
- **Progress Tracking** across statistical topics

### 📰 News Integration
- **Live RSS Feeds** from BPS, APA, NHS
- **Auto-updating** content every 15 minutes
- **Categorized Display** by source and relevance

### 📚 Expert Resources
- **Blog Articles** on DClinPsy preparation
- **Professional Development** content
- **Application Guidance** and tips

### 🎯 Events & Opportunities
- **Conference Listings** for psychology events
- **Training Opportunities** and workshops
- **Volunteer Positions** for experience building

## Technical Implementation

### State Management
- **React Context** for authentication
- **LocalStorage** for user data persistence
- **Progressive Enhancement** for offline capability

### Authentication System
- **Age Verification** (18+ required)
- **PBKDF2 Encryption** for password security
- **Local-only Storage** (no external data transmission)

### AI Integration (Google Gemini 2.5 Flash)
- **Professional Validation** against BPS/HCPC guidelines
- **Confidence Scoring** (90%+ threshold for deployment)
- **Duplicate Detection** using similarity analysis
- **Cost Monitoring** with $50 budget limit

## File Organization

### Documentation (for easy Claude scanning)
```
├── PROJECT_OVERVIEW.md           # This file - quick project understanding
├── README.md                     # Main project documentation
├── DEPLOYMENT.md                 # Deployment and hosting guide
├── AI_INTEGRATION.md             # Comprehensive AI validation docs
├── SJT_PROCESSING_GUIDE.md       # Question processing workflow
├── QUESTIONS_STRUCTURE.md        # Question data format specification
└── TODO.md                       # Outstanding tasks and improvements
```

### Source Materials
```
DClinPsy SJT Questions, Answers, and Guidelines/
├── DClinPsy SJT Questions and Answers.rtf  # 60 source questions
└── DClinPsy BPS and HCPC Guidelines/       # Professional standards (5 PDFs)
```

### Generated Data
```
├── directly-extracted-questions.json        # Raw questions from RTF
├── final-deployment-report.json            # Latest deployment summary
├── simple-comprehensive-validation-report.json  # AI validation results
└── [various validation reports]             # Processing history
```

## Development Commands

### Daily Development
```bash
npm start              # Local development server (localhost:3000)
npm test               # Run test suite
npm run build          # Production build
npm run deploy         # Deploy to GitHub Pages
```

### AI Processing
```bash
node scripts/direct-question-extraction.js     # Extract from RTF
node scripts/validate-all-60-questions.js      # AI validation
node scripts/deploy-validated-questions.js     # Deploy validated questions
```

## Environment Requirements

### Dependencies
- **React 18.2.0** + Tailwind CSS 3.3.5
- **@google/generative-ai 0.21.0** for AI integration
- **pdf-parse 1.1.1** for guideline processing
- **fs-extra 11.2.0** for file operations

### Environment Variables
```env
GEMINI_API_KEY=your_api_key_here  # Google AI API access
```

## Deployment Status
- **Live URL**: https://jmckernan95.github.io/dclinpsy-website
- **Repository**: https://github.com/jmckernan95/dclinpsy-website
- **Platform**: GitHub Pages with gh-pages deployment
- **Auto-deploy**: `npm run deploy` builds and deploys automatically

## Current Priorities

### Completed ✅
- Full AI validation pipeline operational
- 32 professionally validated questions deployed
- Comprehensive documentation created
- All major features functional and tested

### Potential Enhancements
- **Question Bank Expansion**: Process remaining 56 source questions
- **Advanced Analytics**: Enhanced progress tracking and insights
- **Content Management**: Admin interface for question management
- **Performance Optimization**: Lazy loading and caching improvements

---

**For Claude Code**: This project is a fully functional, professionally validated DClinPsy preparation platform. All major systems are operational. Check specific documentation files for detailed information on any particular aspect. The AI integration is the most recent major addition and is fully documented in `AI_INTEGRATION.md`.