/**
 * Statistics Test Questions Data
 * Quiz questions for statistics practice testing
 */

export const statisticsQuestions = [
  {
    id: 1,
    category: 'Descriptive Statistics',
    difficulty: 'Basic',
    type: 'multiple-choice',
    question: "A clinical psychology study reports that participants had a mean anxiety score of 65 with a standard deviation of 12. If the scores are normally distributed, approximately what percentage of participants scored between 53 and 77?",
    options: [
      "34%",
      "68%", 
      "95%",
      "99.7%"
    ],
    correctAnswer: 1,
    explanation: "In a normal distribution, approximately 68% of values fall within one standard deviation of the mean. Mean ± 1 SD = 65 ± 12 = 53 to 77. This is the empirical rule (68-95-99.7 rule).",
    points: 4,
    timeLimit: 90,
    tags: ['normal-distribution', 'standard-deviation', 'empirical-rule']
  },
  {
    id: 2,
    category: 'Descriptive Statistics',
    difficulty: 'Basic',
    type: 'numerical-input',
    question: "Calculate the median for the following therapy session attendance data: 8, 12, 6, 15, 10, 14, 9, 11, 13 sessions",
    correctAnswer: 11,
    tolerance: 0,
    explanation: "First, order the data: 6, 8, 9, 10, 11, 12, 13, 14, 15. With 9 values, the median is the 5th value (middle position) = 11 sessions.",
    points: 3,
    timeLimit: 120,
    tags: ['median', 'central-tendency', 'ordering-data']
  },
  {
    id: 3,
    category: 'Inferential Statistics',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: "A researcher tests whether a new therapy is more effective than standard treatment. The p-value is 0.03. What can we conclude?",
    options: [
      "The null hypothesis is true",
      "There is a 3% chance the null hypothesis is true",
      "We reject the null hypothesis at α = 0.05",
      "The new therapy is definitely better"
    ],
    correctAnswer: 2,
    explanation: "With p = 0.03 < 0.05, we reject the null hypothesis at the 0.05 significance level. The p-value is NOT the probability that H₀ is true, and statistical significance doesn't guarantee practical significance.",
    points: 5,
    timeLimit: 120,
    tags: ['hypothesis-testing', 'p-value', 'significance']
  },
  {
    id: 4,
    category: 'Correlation & Regression',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: "A study finds r = -0.45 between depression scores and quality of life ratings. This indicates:",
    options: [
      "Depression causes poor quality of life",
      "A moderate negative relationship",
      "45% of depression is explained by quality of life",
      "The correlation is not significant"
    ],
    correctAnswer: 1,
    explanation: "r = -0.45 indicates a moderate negative correlation (|r| = 0.30-0.49 is moderate). Correlation doesn't imply causation. The coefficient of determination (r²) would be 0.20, meaning 20% shared variance.",
    points: 4,
    timeLimit: 100,
    tags: ['correlation', 'effect-size', 'interpretation']
  },
  {
    id: 5,
    category: 'Inferential Statistics',
    difficulty: 'Advanced',
    type: 'true-false',
    question: "A 95% confidence interval for the mean difference in treatment outcomes is (2.1, 8.7). This means there's a 95% probability that the true mean difference is between 2.1 and 8.7.",
    correctAnswer: false,
    explanation: "This is a common misconception. A 95% CI means that if we repeated the study many times, 95% of the intervals would contain the true parameter. The true parameter either is or isn't in this specific interval (probability = 0 or 1).",
    points: 5,
    timeLimit: 90,
    tags: ['confidence-intervals', 'interpretation', 'common-errors']
  },
  {
    id: 6,
    category: 'ANOVA',
    difficulty: 'Advanced',
    type: 'multiple-choice',
    question: "An ANOVA comparing three therapy groups yields F(2, 87) = 4.52, p = 0.013. What should the researcher do next?",
    options: [
      "Conclude that all groups are significantly different",
      "Conduct post-hoc tests to determine which groups differ",
      "Report that the groups are not significantly different",
      "Calculate effect size only"
    ],
    correctAnswer: 1,
    explanation: "A significant ANOVA (p < 0.05) indicates that at least one group differs from the others, but doesn't specify which pairs differ. Post-hoc tests (e.g., Tukey, Bonferroni) are needed for pairwise comparisons.",
    points: 6,
    timeLimit: 120,
    tags: ['ANOVA', 'post-hoc-tests', 'multiple-comparisons']
  },
  {
    id: 7,
    category: 'Research Design',
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    question: "Which research design would best control for individual differences when comparing two treatment approaches?",
    options: [
      "Between-subjects design",
      "Within-subjects (repeated measures) design",
      "Cross-sectional design",
      "Correlational design"
    ],
    correctAnswer: 1,
    explanation: "Within-subjects design uses the same participants in all conditions, effectively controlling for individual differences. Each person serves as their own control, reducing error variance and increasing statistical power.",
    points: 4,
    timeLimit: 90,
    tags: ['research-design', 'experimental-control', 'repeated-measures']
  },
  {
    id: 8,
    category: 'Effect Size',
    difficulty: 'Intermediate',
    type: 'numerical-input',
    question: "Two therapy groups have means of 78 and 71 with a pooled standard deviation of 10. Calculate Cohen's d effect size (round to 2 decimal places).",
    correctAnswer: 0.70,
    tolerance: 0.02,
    explanation: "Cohen's d = (M₁ - M₂) / SD_pooled = (78 - 71) / 10 = 7 / 10 = 0.70. This represents a medium-to-large effect size (Cohen: small=0.2, medium=0.5, large=0.8).",
    points: 5,
    timeLimit: 120,
    tags: ['effect-size', 'cohens-d', 'practical-significance']
  }
];

// Question bank metadata
export const questionMetadata = {
  totalQuestions: statisticsQuestions.length,
  categories: ['Descriptive Statistics', 'Inferential Statistics', 'Correlation & Regression', 'ANOVA', 'Research Design', 'Effect Size'],
  difficulties: ['Basic', 'Intermediate', 'Advanced'],
  types: ['multiple-choice', 'numerical-input', 'true-false'],
  maxPoints: statisticsQuestions.reduce((sum, q) => sum + q.points, 0)
};

export default statisticsQuestions;