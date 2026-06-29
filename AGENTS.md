# Repository workflow notes

## Commit and push requests

- Inspect `git status -sb` and the diff before staging. Stage only the files in the requested scope.
- Prefer local `git add`, `git commit`, and `git push` when `.git` is writable.
- Treat GitHub authentication and local `.git` write permission as separate checks. A sandbox write failure is not an authentication failure.
- If local Git metadata cannot be written and approval is unavailable, use the connected GitHub Contents API as the fallback. Verify the resulting blob SHA on the target branch before reporting success.
- Do not use a stalled `update_ref` response as evidence of an authentication problem. Check the branch contents directly and switch to sequential `update_file` calls when needed.
- Report whether the remote branch was updated and whether local Git metadata still needs synchronization.
