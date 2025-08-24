# Question Data Structure

This document explains the data structure used for SJT questions in the DClinPsy Practice App.

## Complete Example

```javascript
{
  id: 1,
  category: "Professional Boundaries",
  scenario: "You have been providing therapy to a client for six months, and they have made significant progress. In your final session, they present you with a gift-wrapped package containing an expensive watch that you know costs at least £300. They mention that they wanted to thank you for \"changing their life.\"",
  options: [
    "Thank the client but explain that you cannot accept expensive gifts due to professional boundaries, and suggest alternative ways they might express their gratitude.",
    "Suggest that instead of giving you a gift, they could write a letter of feedback about the service that could help improve care for others.",
    "Politely refuse the gift, explaining it's against your organization's policy to accept gifts valued over a certain amount.",
    "Accept the gift but document it thoroughly in your notes and inform your supervisor.",
    "Accept the gift to avoid appearing ungrateful, but later donate it to charity."
  ],
  idealRanking: [1, 2, 3, 4, 5],
  explanations: [
    "This option directly addresses the boundary concern while validating the client's gratitude. The BPS Code of Ethics emphasizes maintaining appropriate professional boundaries...",
    "This response redirects the client's gratitude toward a constructive alternative that benefits the wider service...",
    "This response maintains professional boundaries by referencing organizational policy as the rationale...",
    "This approach recognizes the need for transparency and supervision but fails to address the boundary issue directly...",
    "This is the least appropriate action as it creates a significant boundary violation without transparency..."
  ]
}
```

## Data Structure Fields

### Required Fields

- **scenario** (string): The clinical scenario description that sets the context
- **options** (array of strings): Exactly 5 response options representing different approaches
- **idealRanking** (array of integers): The correct ranking [1, 2, 3, 4, 5] where 1=most appropriate, 5=least appropriate
- **explanations** (array of strings): Detailed explanations for each option, referencing BPS/HCPC guidelines
- **category** (string): The clinical domain/category for the question

### Optional Fields

- **id** (integer): Unique identifier for the question

## Parallel Array Structure

**CRITICAL**: The three main arrays must be parallel-indexed:

```javascript
options[0] ←→ idealRanking[0] ←→ explanations[0]
options[1] ←→ idealRanking[1] ←→ explanations[1]
options[2] ←→ idealRanking[2] ←→ explanations[2]
options[3] ←→ idealRanking[3] ←→ explanations[3]
options[4] ←→ idealRanking[4] ←→ explanations[4]
```

- `options[i]` contains the response text
- `idealRanking[i]` contains the correct rank for that response (1-5)
- `explanations[i]` contains the explanation for why that response deserves that rank

## Ranking System

- **1** = Most appropriate response (best clinical practice)
- **2** = Second most appropriate 
- **3** = Middle/neutral response
- **4** = Second least appropriate
- **5** = Least appropriate response (poorest clinical practice)

## Categories

Current categories in the question bank:

- **Professional Boundaries**: Maintaining appropriate therapeutic relationships
- **Risk Management**: Assessing and managing clinical risks
- **Ethical Dilemmas**: Navigating complex ethical decisions
- **Diversity & Inclusion**: Cultural sensitivity and inclusivity
- **Clinical Decision-Making**: Evidence-based clinical choices
- **Interprofessional Working**: Collaborating with other professionals
- **Trainee Development**: Supporting learning and supervision
- **Service Delivery**: Organizational and service-level decisions

## Writing Quality Explanations

Each explanation should:

1. **Reference standards**: Cite BPS Code of Ethics, HCPC Standards, or relevant guidelines
2. **Explain reasoning**: Why this option is ranked at this position
3. **Consider consequences**: What outcomes this choice might lead to
4. **Maintain clinical context**: Keep focus on professional psychology practice
5. **Be proportional**: Most appropriate options get longer, more positive explanations

### Example Explanation Structure

```javascript
"This response [describes the action] while [explains the professional principle]. 
The [BPS/HCPC guideline] emphasizes [relevant standard]. 
This approach demonstrates [clinical skill/wisdom] by [specific benefit], 
which [therapeutic outcome/professional benefit]. 
[Additional context about why this ranking is appropriate]."
```

## Adding New Questions

1. **Choose a realistic scenario** based on actual clinical practice situations
2. **Write 5 distinct options** covering the range from excellent to poor practice
3. **Rank options carefully** ensuring clear differentiation between ranks
4. **Write detailed explanations** that educate about professional standards
5. **Assign appropriate category** from the existing list
6. **Review for accuracy** against current BPS/HCPC guidelines

## Data File Location

Questions are stored in: `/src/questions.js`

Export format:
```javascript
const questions = [
  // Array of question objects
];

export default questions;
```

## Randomization Handling

The app automatically handles randomization of option display order while preserving the correct mapping between options, rankings, and explanations. The data structure remains unchanged - randomization is handled at the presentation layer.

## Validation Checklist

Before adding a new question, verify:

- [ ] Scenario represents realistic DClinPsy-level decision making
- [ ] Exactly 5 options provided
- [ ] idealRanking contains exactly [1, 2, 3, 4, 5] in some order
- [ ] explanations array has exactly 5 entries
- [ ] All arrays are parallel-indexed correctly
- [ ] Explanations reference appropriate professional standards
- [ ] Category matches existing categories
- [ ] Question tests clinical judgment, not factual knowledge
- [ ] Options represent genuinely different approaches
- [ ] Ranking reflects authentic professional standards