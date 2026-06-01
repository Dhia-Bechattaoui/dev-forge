# Beginner Contribution Guide

Welcome to DevForge! If you have never made an open-source contribution before, this guide will walk you through exactly how to do it. It takes less than 2 minutes!

We have fully automated the review process. If you follow these instructions perfectly, your Pull Request will be **automatically merged** and your name will appear on the live site!

## Step 1: Fork the Repository
Click the **Fork** button in the top-right corner of this page to create your own copy of DevForge on your GitHub account.

## Step 2: Edit the Data File
You can do this entirely in your browser!
1. In your forked repository, navigate to `data/contributors.json`.
2. Click the pencil icon in the top right corner to edit the file.
3. Scroll to the very bottom of the file.
4. Add a comma `,` after the last closing brace `}`, and then paste your information like this:
```json
  {
    "name": "Your Name",
    "github": "YourGitHubUsername",
    "language": "JavaScript",
    "role": "Frontend Developer"
  }
```

## Step 3: Commit Your Changes
1. Scroll down to the **Commit changes** box.
2. For the commit message, type something simple like: `data-update: added my profile`.
3. Select **"Commit directly to the main branch"** (or create a new branch if you prefer).
4. Click the green **Commit changes** button.

## Step 4: Open a Pull Request!
1. Go back to the main page of your forked repository.
2. You will see a banner saying your branch is ahead of `lingdojo/dev-forge`. Click **Contribute**, then **Open pull request**.
3. Make sure the base repository is `lingdojo/dev-forge` (or wherever the main repo is hosted) and the base branch is `main`.
4. Add the label `good-first-issue` or `data-update` if possible.
5. Click **Create pull request**!

## What Happens Next?
Our robot reviewer will immediately check your JSON file to make sure it is formatted correctly. 
If it looks good, the robot will automatically approve your PR and merge it! 

Congratulations on your contribution!
