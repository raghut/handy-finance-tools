# Manual Test Cases: Interest Amount Calculator

## Page: Interest Amount Calculator

### Positive Test Cases
1. [TC-INTCALC-001][Critical] User should be able to navigate to the Interest Calculator by clicking "Interest Amount Calculator" from the home screen.
2. [TC-INTCALC-002][Critical] Page title should display "Interest Calculator".
3. [TC-INTCALC-003][Critical] User should be able to enter a valid principal amount.
4. [TC-INTCALC-004][Critical] User should be able to enter a valid interest rate.
5. [TC-INTCALC-005][Critical] User should be able to enter a valid time period in years.
6. [TC-INTCALC-006][Critical] Simple Interest should be selected by default.
7. [TC-INTCALC-007][High] User should be able to switch between Simple Interest and Compound Interest options.
8. [TC-INTCALC-008][Critical] User should be able to calculate interest by clicking "Calculate Interest" button.
9. [TC-INTCALC-009][Critical] For Simple Interest, the calculator should display correct Final Amount and Interest Amount using formula: Interest = (P × R × T) / 100.
10. [TC-INTCALC-010][Critical] For Compound Interest, the calculator should display correct Final Amount and Interest Amount using formula: Interest = P × ((1 + R/100)^T - 1).
11. [TC-INTCALC-011][High] Final Amount should be displayed with ₹ symbol and formatted with 2 decimal places.
12. [TC-INTCALC-012][High] Interest Amount should be displayed with ₹ symbol and formatted with 2 decimal places.
13. [TC-INTCALC-013][Medium] Calculation should complete in under 1 second.

### Negative Test Cases
14. [TC-INTCALC-014][High] Show "Principal amount is required" error when principal field is empty.
15. [TC-INTCALC-015][High] Show "Interest rate is required" error when interest rate field is empty.
16. [TC-INTCALC-016][High] Show "Time period is required" error when time period field is empty.
17. [TC-INTCALC-017][High] Show "Please enter a valid number" error when non-numeric value is entered in principal field.
18. [TC-INTCALC-018][High] Show "Please enter a valid number" error when non-numeric value is entered in interest rate field.
19. [TC-INTCALC-019][High] Show "Please enter a valid number" error when non-numeric value is entered in time period field.
20. [TC-INTCALC-020][Medium] Show "Principal must be greater than 0" error when principal is 0 or negative.
21. [TC-INTCALC-021][Medium] Show "Rate must be greater than 0" error when interest rate is 0 or negative.
22. [TC-INTCALC-022][Medium] Show "Time must be greater than 0" error when time period is 0 or negative.
23. [TC-INTCALC-023][Medium] Show "Rate should not exceed 100%" error when interest rate exceeds 100%.
24. [TC-INTCALC-024][Low] Show "Principal amount is too large" error when principal exceeds 1 billion.
25. [TC-INTCALC-025][Low] Show "Time period is too long" error when time period exceeds 100 years.
26. [TC-INTCALC-026][High] Prevent calculation when any validation error exists.

### Edge Cases
27. [TC-INTCALC-027][Medium] Calculate correctly when principal has decimal places (e.g., 1000.50).
28. [TC-INTCALC-028][Medium] Calculate correctly when interest rate has decimal places (e.g., 5.25%).
29. [TC-INTCALC-029][Medium] Calculate correctly when time period has decimal places for simple interest (e.g., 2.5 years).
30. [TC-INTCALC-030][Low] Calculate correctly with very small values (e.g., principal = 0.01, rate = 0.1%, time = 0.1 years).
31. [TC-INTCALC-031][Medium] Reset error messages when valid inputs are entered after invalid inputs.
32. [TC-INTCALC-032][Low] Show appropriate error for calculation that results in extremely large values.
33. [TC-INTCALC-033][Medium] Handle floating-point precision issues correctly in interest calculations.

### UI/UX Validation
34. [TC-INTCALC-034][Medium] All form fields should have appropriate labels and be properly aligned.
35. [TC-INTCALC-035][Medium] Input fields should have appropriate placeholder text.
36. [TC-INTCALC-036][Medium] Error messages should be displayed in red and be clearly visible below the respective input fields.
37. [TC-INTCALC-037][Medium] Final amount and interest amount should be displayed in a visually distinct way.
38. [TC-INTCALC-038][Low] Calculator container should be properly centered on the page.
39. [TC-INTCALC-039][Low] Button should have a hover effect indicating interactivity.
40. [TC-INTCALC-040][Medium] The radio button selection for interest type should be clear and easy to toggle.
41. [TC-INTCALC-041][Medium] Radio button labels should be clickable to select the respective option.

### Accessibility Tests
42. [TC-INTCALC-042][High] All form fields should have appropriate labels for screen readers.
43. [TC-INTCALC-043][Medium] Focus states should be visible for all interactive elements.
44. [TC-INTCALC-044][Medium] Calculator should be navigable using keyboard only.
45. [TC-INTCALC-045][Low] Error messages should be accessible to screen readers.
46. [TC-INTCALC-046][Medium] Calculation results should be announced to screen readers.


### Navigation Tests
51. [TC-INTCALC-051][High] Verify navigation from home screen to Interest Calculator when "Calculate Now" is clicked.
52. [TC-INTCALC-052][Medium] Verify URL changes to "/interest-calculator" when navigating to the Interest Calculator.
53. [TC-INTCALC-053][Medium] Verify browser back button functionality after navigating to the Interest Calculator. 