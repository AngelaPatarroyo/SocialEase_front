# Workflow Status Badges

Add these badges to your README.md to show the status of your CI/CD pipeline:

## Basic CI Pipeline Status

```markdown
![CI Pipeline](https://github.com/{username}/{repository}/workflows/CI%20Pipeline/badge.svg)
```

## Full CI/CD Pipeline Status

```markdown
![CI/CD Pipeline](https://github.com/{username}/{repository}/workflows/CI%20Pipeline/badge.svg)
```

## Deployment Status

```markdown
![Deploy to Vercel](https://github.com/{username}/{repository}/workflows/Deploy%20to%20Vercel/badge.svg)
```

## Usage Instructions

1. Replace `{username}` with your GitHub username
2. Replace `{repository}` with your repository name
3. Add the badge to your README.md file

## Example

```markdown
# SocialEase - Social Confidence Learning Platform

[![CI Pipeline](https://github.com/yourusername/socialease-frontend/workflows/CI%20Pipeline/badge.svg)](https://github.com/yourusername/socialease-frontend/actions)

A comprehensive web application designed to help users build social confidence...
```

## Badge Colors

- 🟢 **Green**: All checks passing
- 🟡 **Yellow**: Some checks failing
- 🔴 **Red**: Multiple checks failing
- ⚪ **Gray**: Workflow not running

## Click to View Details

Users can click on the badge to see:
- Detailed workflow runs
- Job status and logs
- Test results and coverage
- Build artifacts
- Deployment history
