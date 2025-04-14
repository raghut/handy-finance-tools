# Manual Test Case Sentence Guidelines for AI

## 🔖 Purpose
Use this document as a **standard guide for AI tools (Cursor, Copilot, ChatGPT, etc.) to generate manual test case sentences** from PRDs and design screenshots.

These test case sentences are:
- Easy to **read and review** by QA, devs, and PMs.
- Serve as a **bridge step** before generating full automation test scripts.
- Help ensure **alignment with the product requirement** and user flow expectations.

---

## ✅ Inputs Required for Generating Test Case Sentences

When prompting AI to generate manual test case sentences, always provide:

1. **Product Requirement Document (PRD)** – Feature-level requirements and expected behaviors.
2. **UI Design Screenshots** – Visual layout and flow of the page (optional but highly recommended).
3. **Page or Component Name** – Helps label the test cases meaningfully.

---

## 🔄 Prompt to Use with AI
```
Based on the provided PRD and design screenshots, generate manual test case sentences for the <Page/Component Name>.

Each test case sentence should:
- Be written in simple, clear language.
- Describe one expected behavior per line.
- Be grouped into Positive, Negative, and Edge cases.
- Be easy to review by non-technical users.
- Include priority level (Critical, High, Medium, Low) for each test case.

Label each test case with a unique ID like TC-<PAGE>-001.
```

---

## 📄 Sample Output Format (For AI Response)
```markdown
## Page: Login Page

### Positive Test Cases
1. [TC-LOGIN-001][Critical] User should be able to log in with a valid email and password.
2. [TC-LOGIN-002][High] User should be redirected to the dashboard after successful login.
3. [TC-LOGIN-003][Medium] Login button should remain disabled until all fields are filled.

### Negative Test Cases
4. [TC-LOGIN-004][High] Show an error message when the email field is empty.
5. [TC-LOGIN-005][High] Show an error message when the password field is empty.
6. [TC-LOGIN-006][Medium] Show an error for invalid email format.

### Edge Cases
7. [TC-LOGIN-007][Medium] Prevent login when pressing enter with empty fields.
8. [TC-LOGIN-008][Low] Limit failed login attempts to three before showing captcha.

### UI/UX Validation
9. [TC-LOGIN-009][Medium] Login form should be properly centered on the page.
10. [TC-LOGIN-010][Low] Error messages should appear with the correct styling and color.

### Accessibility Tests
11. [TC-LOGIN-011][High] All form fields should have appropriate labels for screen readers.
12. [TC-LOGIN-012][Medium] Login form should be navigable using keyboard only.
```

---

## 📖 Guidelines for AI While Generating Sentences
- Keep each test case **focused on one behavior**.
- Prioritize test cases (Critical, High, Medium, Low) based on user impact.
- Use product terminology as provided in the PRD.
- Ensure logical flow from field input ➔ validation ➔ action ➔ result.
- Avoid UI implementation details like "class name" or "DOM structure".
- Use simple, non-technical language where possible.
- Include accessibility testing scenarios where relevant.
- Cover responsive behavior if the application has mobile/tablet views.
- Consider international/localization scenarios if applicable.
- Avoid repetitive test cases with only minor variations.

---

## 🎯 Test Case Prioritization Guidelines
- **Critical**: Core functionality without which the application cannot function.
- **High**: Important features used by most users regularly.
- **Medium**: Secondary features or edge cases with moderate impact.
- **Low**: Minor aspects, visual details, or rare edge cases.

Focus on covering critical paths first, then high-risk areas based on complexity and business impact.

---

## 🔹 Review Purpose
These sentences are intended for **stakeholder review** before automating.
- QA can ensure full scenario coverage.
- PM can confirm alignment with requirements.
- Dev can confirm if functionality exists or is planned.

Once finalized, these sentences can be fed to automation agents (e.g., Cursor) along with component code and HTML to generate automation test scripts.

---

**End of Guidelines**
Version: 1.0
Last Updated: 2023-11-15 