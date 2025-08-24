/**
 * Statistics Theory Topics Data
 * Educational content structure for statistics concepts
 */

export const statisticsTopics = [
  {
    id: 'descriptive-stats',
    title: 'Descriptive Statistics',
    slug: 'descriptive-statistics',
    category: 'Fundamentals',
    difficulty: 'Basic',
    estimatedTime: '15 minutes',
    description: 'Central tendency, variability, and distribution characteristics',
    sections: [
      {
        id: 'central-tendency',
        title: 'Measures of Central Tendency',
        content: `
# Measures of Central Tendency

Central tendency describes the center or typical value of a dataset.

## Mean (Average)
- **Definition**: Sum of all values divided by the number of values
- **Formula**: x̄ = Σx / n
- **Best for**: Normally distributed data without extreme outliers
- **Example**: Scores: 85, 90, 78, 92, 88 → Mean = 86.6

## Median
- **Definition**: Middle value when data is ordered from smallest to largest
- **Best for**: Skewed distributions or data with outliers
- **Example**: Scores: 78, 85, 88, 90, 92 → Median = 88

## Mode
- **Definition**: Most frequently occurring value(s)
- **Best for**: Categorical data or identifying common responses
- **Example**: Scores: 85, 90, 85, 92, 85 → Mode = 85

## When to Use Each Measure
- **Normal distribution**: Mean is preferred
- **Skewed distribution**: Median is more representative
- **Categorical data**: Mode is most appropriate
        `,
        formulas: [
          { name: 'Mean', formula: 'x̄ = Σx / n' },
          { name: 'Median', formula: 'Middle value of ordered dataset' },
          { name: 'Mode', formula: 'Most frequent value(s)' }
        ]
      },
      {
        id: 'variability',
        title: 'Measures of Variability',
        content: `
# Measures of Variability

Variability describes how spread out the data points are.

## Range
- **Definition**: Difference between highest and lowest values
- **Formula**: Range = Maximum - Minimum
- **Limitation**: Sensitive to outliers

## Standard Deviation
- **Definition**: Average distance of data points from the mean
- **Sample formula**: s = √[Σ(x - x̄)² / (n-1)]
- **Population formula**: σ = √[Σ(x - μ)² / N]
- **Interpretation**: Larger SD = more variability

## Variance
- **Definition**: Square of the standard deviation
- **Sample variance**: s² = Σ(x - x̄)² / (n-1)
- **Population variance**: σ² = Σ(x - μ)² / N

## Practical Applications
- **Quality control**: Monitor consistency in manufacturing
- **Research**: Compare variability between groups
- **Finance**: Assess investment risk (higher SD = higher risk)
        `,
        formulas: [
          { name: 'Range', formula: 'Max - Min' },
          { name: 'Standard Deviation (sample)', formula: 's = √[Σ(x - x̄)² / (n-1)]' },
          { name: 'Variance (sample)', formula: 's² = Σ(x - x̄)² / (n-1)' }
        ]
      }
    ],
    practiceProblems: [
      {
        question: "Calculate the mean, median, and mode for: 12, 15, 18, 15, 22, 19, 15",
        answer: "Mean = 16.57, Median = 15, Mode = 15",
        explanation: "Order the data first: 12, 15, 15, 15, 18, 19, 22. Mean = 116/7 = 16.57. Median is the middle value (15). Mode is the most frequent value (15 appears 3 times)."
      }
    ]
  },
  {
    id: 'inferential-stats',
    title: 'Inferential Statistics',
    slug: 'inferential-statistics',
    category: 'Advanced',
    difficulty: 'Intermediate',
    estimatedTime: '25 minutes',
    description: 'Hypothesis testing, confidence intervals, and statistical significance',
    sections: [
      {
        id: 'hypothesis-testing',
        title: 'Hypothesis Testing',
        content: `
# Hypothesis Testing

The process of using sample data to make inferences about population parameters.

## Key Concepts

### Null Hypothesis (H₀)
- Statement of no effect or no difference
- What we assume to be true until proven otherwise
- Example: "There is no difference in therapy effectiveness between groups"

### Alternative Hypothesis (H₁ or Hₐ)
- Statement that contradicts the null hypothesis
- What we want to provide evidence for
- Can be one-tailed or two-tailed

### P-value
- Probability of obtaining observed results (or more extreme) if H₀ is true
- **p < 0.05**: Evidence against null hypothesis (statistically significant)
- **p ≥ 0.05**: Insufficient evidence to reject null hypothesis

## Steps in Hypothesis Testing
1. State hypotheses (H₀ and H₁)
2. Choose significance level (α = 0.05)
3. Collect data and calculate test statistic
4. Determine p-value
5. Make decision: Reject or fail to reject H₀
6. Interpret results in context

## Common Mistakes
- Accepting the null hypothesis (we only "fail to reject")
- Confusing statistical significance with practical significance
- Multiple testing without correction
        `,
        formulas: [
          { name: 'One-sample t-test', formula: 't = (x̄ - μ) / (s / √n)' },
          { name: 'Two-sample t-test', formula: 't = (x̄₁ - x̄₂) / √[(s₁²/n₁) + (s₂²/n₂)]' }
        ]
      },
      {
        id: 'confidence-intervals',
        title: 'Confidence Intervals',
        content: `
# Confidence Intervals

A range of values that likely contains the true population parameter.

## 95% Confidence Interval
- If we repeated the study 100 times, about 95 intervals would contain the true parameter
- **NOT**: "95% chance the parameter is in this interval"

## Interpretation
- **Wide interval**: Less precision, smaller sample size
- **Narrow interval**: More precision, larger sample size
- **Interval excludes zero**: Evidence of significant effect

## Formula for Mean (t-distribution)
CI = x̄ ± t(α/2, df) × (s / √n)

Where:
- t(α/2, df) = critical t-value
- df = degrees of freedom (n - 1)
- s = sample standard deviation
- n = sample size

## Clinical Psychology Applications
- Effect size estimates for therapy outcomes
- Mean difference in pre-post treatment scores
- Prevalence rates in population studies
        `,
        formulas: [
          { name: 'CI for mean', formula: 'x̄ ± t(α/2, df) × (s / √n)' },
          { name: 'CI for proportion', formula: 'p̂ ± z(α/2) × √[p̂(1-p̂)/n]' }
        ]
      }
    ],
    practiceProblems: [
      {
        question: "A therapy study shows mean improvement of 12 points (SD = 4, n = 25). Calculate 95% CI.",
        answer: "CI = 12 ± 1.65, or (10.35, 13.65)",
        explanation: "Using t(0.025, 24) = 2.064, SE = 4/√25 = 0.8, CI = 12 ± 2.064 × 0.8 = 12 ± 1.65"
      }
    ]
  },
  {
    id: 'correlation-regression',
    title: 'Correlation & Regression',
    slug: 'correlation-regression',
    category: 'Relationships',
    difficulty: 'Intermediate',
    estimatedTime: '20 minutes',
    description: 'Examining relationships between variables',
    sections: [
      {
        id: 'correlation',
        title: 'Correlation Analysis',
        content: `
# Correlation Analysis

Measures the strength and direction of linear relationships between variables.

## Pearson Correlation Coefficient (r)
- **Range**: -1 to +1
- **Interpretation**:
  - r = +1: Perfect positive correlation
  - r = 0: No linear correlation
  - r = -1: Perfect negative correlation

## Effect Size Guidelines (Cohen, 1988)
- **Small**: |r| = 0.10 to 0.29
- **Medium**: |r| = 0.30 to 0.49
- **Large**: |r| = 0.50 to 1.0

## Important Considerations
- **Correlation ≠ Causation**: Strong correlation doesn't imply cause-effect
- **Outliers**: Can dramatically affect correlation coefficients
- **Non-linear relationships**: May not be captured by Pearson's r
- **Restriction of range**: Can artificially lower correlations

## Clinical Applications
- Relationship between therapy alliance and outcomes
- Correlation between symptoms and quality of life
- Association between treatment adherence and improvement
        `,
        formulas: [
          { name: 'Pearson r', formula: 'r = Σ[(x - x̄)(y - ȳ)] / √[Σ(x - x̄)²Σ(y - ȳ)²]' },
          { name: 'Coefficient of determination', formula: 'r² = proportion of variance explained' }
        ]
      },
      {
        id: 'regression',
        title: 'Linear Regression',
        content: `
# Linear Regression

Predicts values of one variable based on another variable.

## Simple Linear Regression
- **Equation**: y = a + bx + e
- **a** (intercept): y-value when x = 0
- **b** (slope): change in y for each unit increase in x
- **e** (error): residual or unexplained variance

## Key Assumptions
1. **Linearity**: Relationship is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of residuals
4. **Normality**: Residuals are normally distributed

## R-squared (R²)
- Proportion of variance in y explained by x
- Range: 0 to 1 (higher = better fit)
- R² = 0.25 means x explains 25% of variance in y

## Clinical Applications
- Predicting treatment outcome from baseline symptoms
- Estimating therapy duration from problem severity
- Modeling dose-response relationships
        `,
        formulas: [
          { name: 'Slope', formula: 'b = Σ[(x - x̄)(y - ȳ)] / Σ(x - x̄)²' },
          { name: 'Intercept', formula: 'a = ȳ - b(x̄)' },
          { name: 'R-squared', formula: 'R² = (correlation)² = r²' }
        ]
      }
    ],
    practiceProblems: [
      {
        question: "If r = 0.60 between therapy sessions attended and improvement scores, what percentage of variance is explained?",
        answer: "36%",
        explanation: "R² = r² = (0.60)² = 0.36 = 36%. The number of therapy sessions explains 36% of the variance in improvement scores."
      }
    ]
  }
];

export default statisticsTopics;