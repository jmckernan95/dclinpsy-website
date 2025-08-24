# Contributing to DClinPsy SJT Practice App

Thank you for your interest in contributing to this educational resource for DClinPsy candidates!

## Overview

This project aims to provide high-quality practice for Situational Judgment Tests based on authentic clinical psychology scenarios aligned with BPS and HCPC professional standards.

## Types of Contributions

### 1. Question Content
- **Adding new SJT questions** across all clinical domains
- **Improving existing explanations** for accuracy and clarity
- **Reviewing content** for alignment with current professional guidelines

### 2. Code Improvements  
- **Bug fixes** and performance optimizations
- **Feature development** from the TODO list
- **UI/UX enhancements** and accessibility improvements

### 3. Documentation
- **Updating guides** and documentation
- **Adding examples** and clarifications
- **Translating content** (future consideration)

## Writing SJT Questions

### Professional Standards
Questions must align with current guidelines:
- **BPS Code of Ethics and Conduct** (latest version)
- **HCPC Standards of Conduct, Performance and Ethics**
- **BPS Practice Guidelines** for Clinical Psychology
- **NICE guidelines** where relevant

### Question Quality Criteria

#### Scenarios Should:
- ✅ Represent realistic DClinPsy-level decision making
- ✅ Present genuine ethical/clinical dilemmas
- ✅ Be relevant to UK clinical psychology practice
- ✅ Avoid obvious right/wrong answers
- ✅ Test professional judgment, not factual knowledge

#### Avoid:
- ❌ Scenarios requiring specialized technical knowledge
- ❌ Questions with culturally biased content
- ❌ Situations unlikely in UK healthcare settings
- ❌ Overly complex multi-part scenarios

### Writing the 5 Response Options

**Range**: Create options spanning excellent to poor professional practice

**Distribution guideline**:
- **Rank 1**: Exemplary practice (gold standard approach)
- **Rank 2**: Good practice (solid professional approach)
- **Rank 3**: Acceptable practice (meets minimum standards)
- **Rank 4**: Questionable practice (concerning but not harmful)
- **Rank 5**: Poor practice (clearly inappropriate/harmful)

**Option Quality**:
- Each option should be a genuinely plausible response
- Avoid obviously absurd or extreme options
- Ensure clear differentiation between ranking levels
- Keep options roughly equal in length and complexity

### Writing Explanations

Each explanation should be **comprehensive and educational**:

#### Required Elements:
1. **Clear reasoning** for the ranking position
2. **Reference to professional standards** (BPS/HCPC guidelines)
3. **Explanation of consequences** or outcomes
4. **Professional learning point** for the reader

#### Structure Template:
```
"This response [describes action] while [explains principle]. 
The [BPS/HCPC standard] emphasizes [relevant guideline]. 
This approach demonstrates [professional quality] by [specific benefit], 
which [therapeutic/professional outcome]. 
[Additional context about ranking rationale]."
```

#### Length Guidelines:
- **Rank 1 (Best)**: 80-120 words (most detailed)
- **Rank 2**: 60-100 words
- **Rank 3**: 60-100 words  
- **Rank 4**: 60-100 words
- **Rank 5 (Worst)**: 80-120 words (detailed warnings)

### Categories & Balance

Ensure questions cover all domains:
- Professional Boundaries
- Risk Management  
- Ethical Dilemmas
- Diversity & Inclusion
- Clinical Decision-Making
- Interprofessional Working
- Trainee Development
- Service Delivery

## Code Style Guidelines

### React Components
- Use functional components with hooks
- Keep components focused and single-responsibility
- Use descriptive variable and function names
- Include PropTypes for props validation

### Formatting
- Use Prettier for code formatting
- Follow ESLint configuration
- Use consistent indentation (2 spaces)
- Keep lines under 100 characters where possible

### State Management
- Use React hooks for local state
- Consider Context API for shared state
- Avoid unnecessary re-renders
- Keep state close to where it's used

### File Organization
```
src/
├── components/        # Reusable UI components
├── utils/            # Helper functions
├── data/             # Question data and constants
├── hooks/            # Custom React hooks
└── styles/           # CSS and styling
```

## Testing New Questions

Before submitting new questions:

1. **Self-review checklist**:
   - [ ] Scenario is realistic and appropriate
   - [ ] All 5 options are plausible responses
   - [ ] Ranking reflects authentic professional standards
   - [ ] Explanations reference current guidelines
   - [ ] Content is free from bias or discrimination

2. **Peer review**: Have another clinical psychology professional review
3. **Test with candidates**: If possible, get feedback from DClinPsy applicants
4. **Professional validation**: Ensure alignment with current standards

## Submission Process

### For Question Content

1. **Fork the repository**
2. **Add questions** to `/src/questions.js` following the data structure
3. **Test locally** to ensure proper formatting
4. **Submit pull request** with:
   - Clear description of additions
   - Rationale for ranking decisions
   - References to professional guidelines used

### For Code Changes

1. **Check TODO.md** for priority features
2. **Create an issue** to discuss major changes
3. **Fork and create feature branch**
4. **Write tests** for new functionality
5. **Submit pull request** with:
   - Clear description of changes
   - Screenshots for UI changes
   - Performance impact notes

## Review Process

### Content Review
All question submissions undergo:
- **Technical review**: Data structure and formatting
- **Professional review**: Alignment with BPS/HCPC standards
- **Educational review**: Learning value and clarity
- **Bias check**: Cultural sensitivity and inclusivity

### Code Review
Code submissions are reviewed for:
- **Functionality**: Does it work as intended?
- **Code quality**: Maintainable and readable?
- **Performance**: No significant impact on app speed?
- **Accessibility**: Maintains or improves accessibility?

## Recognition

Contributors are recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **Academic citations** if used in research

## Professional Ethics

By contributing, you agree to:
- **Accuracy**: Ensure content reflects current professional standards
- **Confidentiality**: Do not base scenarios on real cases without anonymization
- **Professional integrity**: Maintain high standards of professional practice
- **Educational focus**: Prioritize learning value over other considerations

## Questions & Support

- **General questions**: Open an issue with the 'question' label
- **Professional standards**: Reference current BPS/HCPC documentation
- **Technical issues**: Check existing issues before creating new ones
- **Content disputes**: Provide professional guideline references

## Code of Conduct

- Be respectful in all interactions
- Welcome new contributors and questions
- Focus on constructive feedback
- Maintain professional standards in discussions
- Report any concerning behavior to maintainers

---

**Note**: This is an educational resource. All contributors should verify current professional standards independently, as guidelines may change over time.