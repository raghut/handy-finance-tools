# Manual Test Cases: EMI Calculator

## Page: EMI Calculator

### Positive Test Cases
1. [TC-EMI-001][Critical] User should be able to access the EMI Calculator from the home screen by clicking "Calculate Now" button.
2. [TC-EMI-002][Critical] User should be able to enter a valid loan amount in the "Loan Amount (in ₹)" field.
3. [TC-EMI-003][Critical] User should be able to enter a valid interest rate in the "Interest Rate (% per annum)" field.
4. [TC-EMI-004][Critical] User should be able to enter a valid loan term in the "Loan Term (in Years)" field.
5. [TC-EMI-005][Critical] User should be able to click the "Calculate EMI" button after filling all required inputs.
6. [TC-EMI-006][Critical] System should display the calculated monthly EMI in the format: "Your monthly EMI is ₹X,XXX".
7. [TC-EMI-007][High] All input fields should have placeholders set to "0".
8. [TC-EMI-008][High] Calculator should correctly apply the EMI formula: EMI = [P × R × (1+R)^N]/[(1+R)^N - 1].
9. [TC-EMI-009][Medium] Resetting the inputs should clear the previously calculated result.
10. [TC-EMI-010][Medium] Calculated result should be rounded to 2 decimal places.

### Negative Test Cases
11. [TC-EMI-011][High] Show an error message when the loan amount field is left blank and Calculate EMI is clicked.
12. [TC-EMI-012][High] Show an error message when the interest rate field is left blank and Calculate EMI is clicked.
13. [TC-EMI-013][High] Show an error message when the loan term field is left blank and Calculate EMI is clicked.
14. [TC-EMI-014][Medium] System should not accept non-numeric characters in the loan amount field.
15. [TC-EMI-015][Medium] System should not accept non-numeric characters in the interest rate field.
16. [TC-EMI-016][Medium] System should not accept non-numeric characters in the loan term field.
17. [TC-EMI-017][Medium] Show an appropriate error for negative values in the loan amount field.
18. [TC-EMI-018][Medium] Show an appropriate error for negative values in the interest rate field.
19. [TC-EMI-019][Medium] Show an appropriate error for negative values in the loan term field.

### Edge Cases
20. [TC-EMI-020][Medium] Calculate EMI for very large loan amounts (e.g., 999,999,999).
21. [TC-EMI-021][Medium] Calculate EMI for a very high interest rate (e.g., 99%).
22. [TC-EMI-022][Medium] Calculate EMI for a very long loan term (e.g., 30 years).
23. [TC-EMI-023][Medium] Calculate EMI for a very short loan term (e.g., 1 year).
24. [TC-EMI-024][Medium] Calculate EMI for a very small loan amount (e.g., 1000).
25. [TC-EMI-025][Medium] Calculate EMI for a very low interest rate (e.g., 1%).
26. [TC-EMI-026][Low] Verify calculation is correct when all input fields have decimal values.
27. [TC-EMI-027][Low] Verify behavior when interest rate is set to 0%.

### UI/UX Validation
28. [TC-EMI-028][High] Verify that the layout matches the design screenshot with all elements properly positioned.
29. [TC-EMI-029][High] "Calculate EMI" button should have blue background with white text as specified.
30. [TC-EMI-030][Medium] Content should be center-aligned on desktop view.
31. [TC-EMI-031][Medium] Content should be center-aligned and responsive on mobile view.
32. [TC-EMI-032][Medium] Input field labels should be clearly visible and properly aligned.
33. [TC-EMI-033][Low] EMI result should be displayed with proper formatting and styling.
34. [TC-EMI-034][Low] Verify input fields have appropriate width and padding.

### Accessibility Tests
35. [TC-EMI-035][High] All form fields should have appropriate labels for screen readers.
36. [TC-EMI-036][Medium] EMI Calculator should be navigable using keyboard only.
37. [TC-EMI-037][Medium] Error messages should be announced to screen readers.
38. [TC-EMI-038][Medium] Calculate EMI button should be accessible via keyboard.
39. [TC-EMI-039][Low] Verify appropriate color contrast for all text elements.

### Navigation Tests
40. [TC-EMI-040][High] Verify navigation from home screen to EMI calculator when "Calculate Now" is clicked.
41. [TC-EMI-041][Medium] Verify URL changes to "/emi-calculator" when navigating to the EMI Calculator.
42. [TC-EMI-042][Medium] Verify browser back button functionality after navigating to the EMI Calculator. 