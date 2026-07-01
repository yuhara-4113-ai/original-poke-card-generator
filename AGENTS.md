# Repository workflow notes

## Commit and push requests

- Inspect `git status -sb` and the diff before staging. Stage only the files in the requested scope.
- Prefer local `git add`, `git commit`, and `git push` when `.git` is writable.
- Treat GitHub authentication and local `.git` write permission as separate checks. A sandbox write failure is not an authentication failure.
- If local Git metadata cannot be written and approval is unavailable, use the connected GitHub Contents API as the fallback. Verify the resulting blob SHA on the target branch before reporting success.
- Do not use a stalled `update_ref` response as evidence of an authentication problem. Check the branch contents directly and switch to sequential `update_file` calls when needed.
- Report whether the remote branch was updated and whether local Git metadata still needs synchronization.

## Pull request language

- Write pull request titles and descriptions in Japanese unless the user explicitly requests another language. Keep code identifiers, commands, file paths, and product names in their original form where clearer.

## Pull request review workflow

- This Gemini-specific workflow expires on 2026-07-17. On or after that date, remove this section before continuing because the consumer review service is scheduled to be unavailable.
- After creating a pull request or pushing a code change, post `/gemini review` on the pull request and record the current head commit and request time. Documentation-only changes do not require another review.
- Poll for a Gemini Code Assist review submitted after the request time for up to five minutes. Treat the review as complete only when it covers the recorded head commit and all actionable comments have been evaluated.
- If Gemini does not respond within five minutes, report the timeout and treat Gemini review as unavailable; do not imply that Gemini approved or completed the review.
- Evaluate each Gemini comment against the repository's actual data flow and component contracts. Apply valid actionable feedback, and document why any rejected suggestion is unnecessary or harmful.
- Apply and push at most two rounds of fixes prompted by Gemini reviews. Count each pushed batch of review fixes as one round.
- After the first review-fix round, request another Gemini review and repeat this workflow. After the second review-fix round, do not apply further Gemini suggestions or request another review automatically; ask the user whether another fix round is necessary.
