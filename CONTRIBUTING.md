# How to Contribute

Government employees, members of the public, and the private sector are encouraged to contribute to this repository!

## Git Workflow Strategy

We strictly follow a structured Git workflow to keep our history clean and reviewable:

1. **Always branch off a fresh main:**
   ````bash
   git checkout main && git pull
   ````
2. **Create a descriptive feature/chore branch:** Use a branch type prefix (e.g., `feat/` or `chore/`):
   ````bash
   git switch -c feat/my-awesome-improvement
   ````
3. **Submit a Pull Request:** Push to your feature branch and open a PR pointing back to `main`.
4. **Commit changes using Conventional Commits:** Ensure your commit messages match the Conventional Commit format (e.g., `feat(frontend): add new route` or `chore(hygiene): establish templates`).
