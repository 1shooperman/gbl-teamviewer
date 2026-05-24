---
name: update-pr
description: Update the github pull request description based on the git diff between this branch and the default branch.
allowed-tools: [Read, Write, Edit, Bash(git log *), Bash(git -C *), Bash(git diff *), Bash(git add *), Bash(git commit *), Bash(git push *)]
user-invocable: true
---

## Instruction

Use the gh cli tool to update the github pull request description based on the outputs from the 3 sub-agents.


