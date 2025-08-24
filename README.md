# DClinPsy SJT Practice App v3

Interactive practice tool for Doctorate in Clinical Psychology Situational Judgment Tests, designed to help candidates prepare for DClinPsy applications by practicing clinical decision-making based on BPS and HCPC guidelines.

## Features

### Core Features
- **Click-to-Rank System**: Intuitive interface for ordering response options from most to least appropriate
- **Randomized Answer Order**: Response options appear in random order to eliminate predictability and test true clinical judgment
- **Automatic Scoring**: Proximity-based scoring system that rewards accurate clinical reasoning
- **Detailed Feedback**: Comprehensive explanations aligned with BPS/HCPC professional guidelines

### New in v3: Category Mixing & Progress Tracking
- **Category Mixing**: Each test includes questions from multiple clinical domains for balanced practice
- **Category Performance Analysis**: Detailed breakdown showing strengths and areas for development across different clinical domains
- **Progress Dashboard**: Comprehensive tracking of test history, performance trends, and personalized study recommendations
- **Test History**: Automatic saving of all test attempts with detailed analytics
- **Performance Highlights**: Identification of strongest and weakest clinical areas
- **Study Recommendations**: AI-generated suggestions based on individual performance patterns

## Scoring System

Each question is worth **20 points total** (5 answers × 4 points maximum each):

- **Exact match**: 4 points
- **±1 position**: 3 points  
- **±2 positions**: 2 points
- **±3 positions**: 1 point
- **±4 positions**: 0 points

**Total possible score**: 200 points (10 questions × 20 points each)

## Question Categories

The app covers all major clinical domains relevant to DClinPsy applications:

- **Professional Boundaries**: Maintaining appropriate therapeutic relationships and professional limits
- **Risk Management**: Assessing and managing clinical risks including self-harm, suicide, and safeguarding
- **Ethical Dilemmas**: Navigating complex ethical decisions in clinical practice
- **Diversity & Inclusion**: Cultural sensitivity, accessibility, and inclusive practice
- **Clinical Decision-Making**: Evidence-based clinical choices and assessment practices
- **Interprofessional Working**: Collaborating effectively within multidisciplinary teams
- **Trainee Development**: Professional growth, supervision, and reflective practice
- **Service Delivery**: System-level decisions, resource management, and service efficiency

## Version History

### Version 3 (Current) - Category Mixing & Progress Tracking
- **Category Mixing Algorithm**: Ensures each test includes questions from multiple domains
- **Enhanced Results Page**: Category-specific performance breakdown with visual progress bars
- **Progress Dashboard**: Historical performance tracking with trends and insights
- **Test History**: Automatic saving of all attempts with detailed analytics
- **Performance Analytics**: Streak tracking, performance trends, and personalized recommendations
- **Study Recommendations**: Targeted suggestions based on category performance patterns

### Version 2 - Randomized Answer Order
- **Randomized Answer Order**: Response options appear in different positions for each question
- Eliminates predictability and tests genuine clinical judgment rather than pattern recognition
- Maintains accurate scoring and feedback regardless of display order

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Testing
```bash
npm test
```
Launches the test runner in interactive watch mode

### Build for Production
```bash
npm run build
```
Builds the app for production in the `build` folder

### Deploy to GitHub Pages
```bash
npm run deploy
```
Deploys the built app to GitHub Pages (requires gh-pages setup)

## Project Structure

```
src/
├── App.js              # Main application component
├── App.css             # Application styles
├── questions.js        # Question bank data
├── index.js            # React app entry point
├── index.css           # Global styles
└── [test files]        # Testing utilities
```

## Key Technologies

- **React 18.2.0**: Modern React with hooks
- **Tailwind CSS 3.3.5**: Utility-first CSS framework
- **Create React App**: Build toolchain and development server
- **GitHub Pages**: Deployment platform

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding questions and contributing to the codebase.

## Question Structure

See [QUESTIONS_STRUCTURE.md](./QUESTIONS_STRUCTURE.md) for detailed information about the data format and structure.

## Development Roadmap

See [TODO.md](./TODO.md) for planned improvements and feature requests.

---

**Note**: This practice tool is designed to supplement, not replace, formal DClinPsy preparation programs. Always refer to official BPS and HCPC guidelines for authoritative information on professional standards.
