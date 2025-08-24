# Testing Checklist - DClinPsy SJT Practice App v2

This document provides comprehensive testing procedures to verify the randomization fix and overall app functionality.

## Pre-Testing Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Open browser developer tools (F12)
   - Check console for any errors

## Critical Randomization Testing

### ✅ **Test 1: Answer Options Appear in Different Orders**

**Procedure:**
1. Start a new test
2. Note the order of answer options for the first question
3. Restart the app (refresh page)
4. Start another new test
5. Compare the order of answer options for the same question type

**Expected Result:**
- [ ] Answer options appear in different positions across test sessions
- [ ] The same clinical scenario shows options in varied orders
- [ ] No predictable pattern (e.g., best answer always first)

**Pass Criteria:** Options display in genuinely random order

---

### ✅ **Test 2: Scoring Remains Accurate After Randomization**

**Procedure:**
1. Start a test and note which option appears in position 1
2. Rank that option as "1" (most appropriate)
3. Complete all rankings and submit
4. Check the score for that option

**Expected Result:**
- [ ] If you correctly identified the most appropriate option, you get 4/4 points
- [ ] If you ranked a middle option as #1, you get fewer points
- [ ] Scoring reflects actual clinical appropriateness, not display position

**Pass Criteria:** Scoring logic works correctly regardless of display order

---

### ✅ **Test 3: Feedback Correctly Matches Each Option**

**Procedure:**
1. Complete a question ranking
2. Submit and view feedback
3. Verify each option's explanation matches its content
4. Check that explanations reference the correct ranking (1-5)

**Expected Result:**
- [ ] Option text matches its explanation
- [ ] "Most appropriate" explanations correspond to rank 1 options
- [ ] "Least appropriate" explanations correspond to rank 5 options
- [ ] No mismatched content between options and explanations

**Pass Criteria:** All explanations correctly correspond to their options

---

## Core Functionality Testing

### ✅ **Test 4: Question Loading and Navigation**

**Procedure:**
1. Load the app and wait for questions to load
2. Verify question counter shows "1 of 10"
3. Complete first question and proceed to next
4. Navigate through all 10 questions

**Expected Result:**
- [ ] All 10 questions load without errors
- [ ] Question counter updates correctly (1 of 10, 2 of 10, etc.)
- [ ] Each question displays scenario, options, and category tag
- [ ] No duplicate questions in a single test session

**Pass Criteria:** Smooth navigation through complete test

---

### ✅ **Test 5: Ranking Interface Functionality**

**Procedure:**
1. Click on different options to rank them
2. Try clicking on an already-ranked option to deselect it
3. Ensure you can rank all 5 options before submitting
4. Try to submit with incomplete rankings

**Expected Result:**
- [ ] Clicking unranked options adds them to ranking (shows number badge)
- [ ] Clicking ranked options removes them and reorders remaining ranks
- [ ] Submit button is disabled until all 5 options are ranked
- [ ] Submit button becomes active only when all options are ranked

**Pass Criteria:** Intuitive and reliable ranking interface

---

### ✅ **Test 6: Score Calculation and Display**

**Procedure:**
1. Complete a full test session
2. Review the results summary page
3. Check individual question breakdowns
4. Verify total score calculation

**Expected Result:**
- [ ] Overall score shows earned/possible points and percentage
- [ ] Individual question scores sum to total score
- [ ] Performance color coding works (green for good, red for poor)
- [ ] Score breakdown shows each question's category and performance

**Pass Criteria:** Accurate score calculation and clear presentation

---

## User Experience Testing

### ✅ **Test 7: Category Tags Display Properly**

**Procedure:**
1. Go through multiple questions
2. Check that each question shows a category tag
3. Verify category names are readable and appropriate

**Expected Result:**
- [ ] Category tags appear for all questions
- [ ] Categories match the clinical domain (e.g., "Professional Boundaries")
- [ ] Tag styling is consistent and readable

**Pass Criteria:** Clear category identification

---

### ✅ **Test 8: Test Management Functions**

**Procedure:**
1. Complete a test and reach results page
2. Click "Generate New Test" - verify new questions load
3. Complete another test and click "Retry This Test"
4. Verify the same questions appear but can be attempted again

**Expected Result:**
- [ ] "Generate New Test" provides different questions
- [ ] "Retry This Test" resets the same test for another attempt
- [ ] Both options clear previous rankings and scores

**Pass Criteria:** Test management works as intended

---

## Error Handling Testing

### ✅ **Test 9: No Console Errors During Normal Use**

**Procedure:**
1. Keep browser developer tools open during testing
2. Complete normal user workflow (start test, rank options, submit, navigate)
3. Monitor console for JavaScript errors

**Expected Result:**
- [ ] No JavaScript errors in console during normal operation
- [ ] No warning messages about missing data or broken functionality
- [ ] Smooth operation without browser performance issues

**Pass Criteria:** Clean console output during normal use

---

### ✅ **Test 10: Responsive Design and Accessibility**

**Procedure:**
1. Test on different screen sizes (desktop, tablet, mobile)
2. Try keyboard navigation (Tab key to move between elements)
3. Test with high contrast mode if available

**Expected Result:**
- [ ] Interface adapts to different screen sizes
- [ ] All interactive elements are keyboard accessible
- [ ] Text remains readable at various zoom levels
- [ ] Color contrast is sufficient for visibility

**Pass Criteria:** Accessible across devices and user needs

---

## Edge Case Testing

### ✅ **Test 11: Rapid Clicking and Unusual Interaction**

**Procedure:**
1. Try clicking multiple options very quickly
2. Try to submit while still clicking options
3. Navigate back and forth between questions rapidly

**Expected Result:**
- [ ] App handles rapid interactions gracefully
- [ ] No duplicate rankings or corrupted state
- [ ] Interface remains stable during stress testing

**Pass Criteria:** Robust handling of unusual interaction patterns

---

### ✅ **Test 12: Browser Refresh and Session Handling**

**Procedure:**
1. Start a test, complete some questions
2. Refresh the browser page
3. Check if test state is preserved or resets appropriately

**Expected Result:**
- [ ] App handles refresh gracefully (either preserves state or starts fresh cleanly)
- [ ] No broken state or corrupted data after refresh
- [ ] User can continue or restart without issues

**Pass Criteria:** Graceful handling of browser refresh

---

## Performance Testing

### ✅ **Test 13: Loading Speed and Responsiveness**

**Procedure:**
1. Time how long the app takes to load initially
2. Note response time when clicking options and submitting
3. Check smooth scrolling and transitions

**Expected Result:**
- [ ] Initial load completes in under 3 seconds on reasonable connection
- [ ] Option selection and submission feel responsive (under 0.5s)
- [ ] Smooth animations and transitions without lag

**Pass Criteria:** Responsive performance throughout use

---

## Final Integration Testing

### ✅ **Test 14: Complete User Journey**

**Procedure:**
1. Complete an entire test session from start to finish
2. Try different ranking strategies (random, careful consideration, etc.)
3. Review all feedback and explanations
4. Start a new test to ensure everything resets properly

**Expected Result:**
- [ ] Seamless flow from start to completion
- [ ] All features work together cohesively
- [ ] Educational value is clear and helpful
- [ ] User feels the randomization improves authenticity

**Pass Criteria:** Excellent end-to-end user experience

---

## Regression Testing

### ✅ **Test 15: Backward Compatibility**

**Procedure:**
1. Verify all original features still work
2. Check that existing question data displays correctly
3. Ensure no previous functionality was broken

**Expected Result:**
- [ ] All pre-v2 features function identically
- [ ] Question bank loads and displays correctly
- [ ] Scoring system maintains accuracy
- [ ] User interface remains familiar and intuitive

**Pass Criteria:** No regression in existing functionality

---

## Testing Summary Report

After completing all tests, document:

### Overall Status
- [ ] All critical tests pass
- [ ] Randomization works correctly
- [ ] No major bugs or issues found
- [ ] Ready for production use

### Issues Found (if any)
- List any bugs discovered during testing
- Note severity level (critical, major, minor)
- Include steps to reproduce

### Performance Notes
- App loading speed: _____ seconds
- User interaction responsiveness: _____ (good/fair/poor)
- Browser compatibility tested: _____ (Chrome/Firefox/Safari/etc.)

### Recommendations
- Any suggested improvements based on testing
- Areas that might need future attention
- User experience observations

---

**Testing Date:** _____________  
**Tester:** _____________  
**Browser/OS:** _____________  
**Overall Status:** ✅ PASS / ❌ FAIL / ⚠️ NEEDS REVIEW