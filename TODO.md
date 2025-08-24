# Development Roadmap & TODO

Planned improvements and feature requests for the DClinPsy SJT Practice App v3+.

## ✅ Completed in v3.0
- [x] **Expand question bank**: Added 13+ questions across 7 clinical domains
- [x] **Balance categories**: Implemented intelligent category mixing for diverse tests  
- [x] **Session history**: Complete test history tracking with localStorage
- [x] **Progress analytics**: Category performance breakdown and trends
- [x] **Study recommendations**: Personalized guidance based on performance patterns

## High Priority

### Enhanced Question Bank
- [ ] **Expand question bank further**: Target 50+ questions total across all categories
- [ ] **Clinical Decision-Making questions**: Add more scenarios for this core domain
- [ ] **Quality assurance**: Review all explanations for alignment with latest BPS/HCPC guidelines
- [ ] **Difficulty levels**: Implement beginner/intermediate/advanced question categorization

### Advanced Functionality
- [ ] **Filter by category**: Allow users to practice specific domains (e.g., only Risk Management questions)
- [ ] **Custom test length**: Option to select 5, 10, or 20 questions per test  
- [ ] **Timer feature**: Optional exam-condition timing (2-3 minutes per question)
- [ ] **Adaptive testing**: Adjust question difficulty based on performance

## Medium Priority

### User Experience
- [ ] **Progress analytics dashboard**: 
  - Performance trends over time
  - Category-specific strengths/weaknesses
  - Detailed score breakdowns
  - Improvement recommendations
- [ ] **Export results**: Save/print test results as PDF
- [ ] **Accessibility enhancements**:
  - Screen reader compatibility
  - Keyboard navigation
  - High contrast mode
  - Font size options
- [ ] **Mobile responsive design**: Optimize for tablet and phone usage

### Educational Features
- [ ] **Study mode**: Review questions with immediate feedback before ranking
- [ ] **Explanation library**: Browse all explanations organized by category
- [ ] **Reference materials**: Quick access to BPS/HCPC guideline summaries
- [ ] **Glossary**: Define key professional terms and concepts
- [ ] **Case study mode**: Extended scenarios with multiple related questions

## Low Priority

### Technical Improvements
- [ ] **Performance optimization**: 
  - Lazy loading for large question banks
  - Better state management (Context API or Redux)
  - Code splitting for faster initial load
- [ ] **PWA features**: Offline capability for practicing without internet
- [ ] **Data persistence**: Save progress to local storage or cloud
- [ ] **User accounts**: Personal profiles and progress tracking across devices

### Advanced Features
- [ ] **Adaptive testing**: AI-driven question selection based on performance
- [ ] **Peer comparison**: Anonymous benchmarking against other users
- [ ] **Collaborative features**: Study groups and shared practice sessions
- [ ] **Multimedia scenarios**: Audio/video clinical vignettes
- [ ] **Multi-language support**: Welsh language option for UK compliance

### Administrative
- [ ] **Question bank management**: Admin interface for adding/editing questions
- [ ] **Analytics dashboard**: Usage statistics and performance insights
- [ ] **Automated testing**: Unit tests for scoring logic and randomization
- [ ] **Content validation**: Automated checks for question quality and consistency

## Recently Identified Issues

### Code Organization
- [ ] **Extract utilities**: Move scoring logic to `utils/scoring.js`
- [ ] **Component separation**: Break down the main component into smaller, focused components
- [ ] **Custom hooks**: Extract state management logic into reusable hooks
- [ ] **Constants file**: Centralize category definitions and configuration

### Bug Fixes & Improvements
- [ ] **Responsive design**: Better mobile and tablet layouts
- [ ] **Loading states**: Improved loading indicators and error handling
- [ ] **Accessibility**: ARIA labels and semantic HTML improvements
- [ ] **Performance**: Optimize re-renders and state updates

## Future Considerations

### Integration Possibilities
- [ ] **LMS integration**: Connect with learning management systems
- [ ] **University partnerships**: Branded versions for specific institutions
- [ ] **Professional development**: CPD tracking and certification features
- [ ] **Research platform**: Anonymous data collection for SJT research

### Content Expansion
- [ ] **Other healthcare professions**: Adapt for nursing, medicine, etc.
- [ ] **International versions**: Adapt for other countries' professional standards
- [ ] **Specialized tracks**: Child psychology, neuropsychology, etc.
- [ ] **Real case studies**: Based on anonymized clinical scenarios

## Contributing

To suggest new features or improvements:
1. Check if the item is already listed in this TODO
2. Create an issue in the GitHub repository with detailed description
3. Consider submitting a pull request if you can implement the feature
4. Follow the guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md)

## Priority Ranking Criteria

**High Priority**: Core functionality that directly improves the learning experience
**Medium Priority**: Features that enhance usability and provide additional value
**Low Priority**: Nice-to-have features that add polish or advanced capabilities

Items may be re-prioritized based on user feedback and technical feasibility.