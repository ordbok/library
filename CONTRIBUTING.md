Reporting New Issues
====================

1. Read the Documentation
-------------------------

Please [read the README](https://github.com/ordbok/core) and [check the core API](https://ordbok.github.io/core) before reporting new issues, even if you think you have found a bug.

Issues that ask questions answered in the documentation will be closed without elaboration.


2. Search for Duplicates
------------------------

[Search existing issues](https://github.com/ordbok/core/search?type=Issues) before reporting a new one.

Some search tips:
 * *Don't* restrict your search to only open issues. An issue with a title similar to yours may have been closed as a duplicate of one with a less-findable title.
 * Check for synonyms. For example, if your bug involves an interface, it likely also occurs with type aliases or classes.
 * Search for the title of the issue you're about to report. This sounds obvious but 80% of the time this is sufficient to find a duplicate when one exists.
 * Read more than the first page of results. Many issues here use the same words so relevancy sorting is not particularly strong.
 * If you have a crash, search for the first few topmost function names shown in the call stack.


3. Do You Have a Question?
--------------------------

The issue tracker is for **issues**, in other words, bugs and suggestions.
If you have a *question*, please use [Stack Overflow](http://stackoverflow.com/questions/tagged/ordbok), your favorite search engine, or other resources.


4. Did You Found a Bug?
-----------------------

When logging a bug, please be sure to include the following:
- The version of ORDBOK you're using (run `npx ordbok-assembler --version`).
- What version of TypeScript you're using (run `npx tsc --v`).
- If at all possible, an *isolated* way to reproduce the behavior.
- The behavior you expect to see, and the actual behavior.


5. Do You Have a Suggestion?
----------------------------

Suggestions are also accepted in the issue tracker.

In general, things we find useful when reviewing suggestions are:
- A description of the problem you're trying to solve
- An overview of the suggested solution
- Examples of how the suggestion would work in various scenarios
- If relevant, precedent in other languages can be useful for establishing context and expected behavior



Instructions for Contributing Code
==================================

Advices
-------

If you like to contribute code, an issue report is required, which has been [labelled "contribute"](https://github.com/ordbok/core/issues?q=is%3Aopen+is%3Aissue+label%3A%22contribute%22) by a project maintainer.

Design changes will not be accepted at this time. If you have a design change proposal, please log a suggestion issue.


Legal
-----

You will need to complete a Contributor License Agreement (CLA). Briefly, this agreement testifies that you are granting us permission to use the submitted change according to the terms of the project's license, and that the work being submitted is under appropriate copyright.

Please submit a Contributor License Agreement (CLA) before submitting a pull request. Download the agreement ([ORDBOK Contribution License Agreement.pdf](https://ordbok.github.io/ordbok-contribution-license-agreement.pdf)), sign, scan, and email it back to <cla@ordbok.one>. Be sure to include your github user name along with the agreement. Once we have received the signed CLA, we'll review the request. 


Pull Request
------------

Your pull request should: 
- Include a description of what your change intends to do
- Contain child commits of a reasonably recent commit in the **master** branch
- Contain no merge commits
- Have clear commit messages
- Build and run without errors (`npm run build`)
- Avoid line ending issues, preferable set `autocrlf = input` and `whitespace = cr-at-eol` in your git configuration
