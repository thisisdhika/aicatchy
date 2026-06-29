# Branch Protection Rules

## Setup (github.com → Settings → Branches → Add rule)

### main (Production)
| Rule | Value |
|------|-------|
| Branch name pattern | `main` |
| Require a pull request before merging | ✅ |
| Require approvals | 1 |
| Dismiss stale reviews | ✅ |
| Require status checks to pass | ✅ |
| Status checks | `pnpm typecheck`, `pnpm build` |
| Require branches to be up to date | ✅ |
| Require conversation resolution | ✅ |
| Do not allow bypassing | ✅ (except admins) |
| Restrict pushes to specific teams | ✅ (only @thisisdhika) |

### develop
| Rule | Value |
|------|-------|
| Branch name pattern | `develop` |
| Require a pull request before merging | ✅ |
| Require approvals | 1 (optional for hotfix) |
| Require status checks to pass | ✅ |
| Allow admins to bypass | ✅ |
| Require linear history | ❌ (squash merges preferred) |

### staging
| Rule | Value |
|------|-------|
| Branch name pattern | `staging` |
| Require pull request | ❌ (deploy branch, not merged into) |
| Restrict pushes | ✅ (only @thisisdhika) |

## Merge Strategy
- **feature → develop**: Squash merge
- **develop → staging**: Squash merge (for integration testing)
- **staging → main**: Squash merge (clean history)
- **hotfix → main**: Create from main, squash merge back to main + develop
