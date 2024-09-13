# Refactoring test with OpenAI o1 models, claude-3.5-sonnet and gpt-4o

This repo contains a test of how well state-of-the-art LLMs are able to refactor code.

The setup:

[Cursor](https://www.cursor.com/) and its chat was used in interacting with the models.

The `main` branch contains an imaginary, a bit of a gibberish 'book management service' (`bookService.ts`),
which tries to be intentionally hard-to-follow spaghetti code. There is also `app.ts` that
uses the book service, and unit tests (`bookService.test.ts`) that test out the basic
functionality of it.

(Fun fact: The code was created by claude-3.5-sonnet, but i first had to
teach it how to write bad code :D)

LLMs tested:

- claude-3.5-sonnet
- gpt-4o
- o1-mini
- o1-preview

At the beginning, the model gets the full code base as context + the following message:

```
I need help. I inherited a legacy code base that is some kind of a book management system.
I need to make changes to it but am too afraid because i don't know what it really does.
It's running in production and there are hundreds of users. It does have tests that pass
successfully. Please refactor the code base to be more maintainable. The tests cannot
change as they are crucial for ensuring it works as it should in production.
```

All of the LLMs were able to (eventually) make changes that still work and tests pass. Each has the changes its done on a separate branch and there's a corresponding Pull Request that can be used for review. Below is a more detailed description of the process.

## Each LLM's refactoring process

### claude-3.5-sonnet

[PR for claude-3.5-sonnet](https://github.com/sandst1/o1-refactoring-test/pull/2)

**Process**: After first try, book service code was refactored but tests & app not, so they were failing. Giving the failures to Claude and asking to fix them made things pass again. Also the app itself was failing, after one iteration Claude fixed that as well.

**Code quality**: mainly renamed things a bit (variables but not function parameters), created a new type Book but didn't rename the properties to something more readable, added some typings, replaced for loops with array methods

### gpt-4o

[PR for gpt-4o](https://github.com/sandst1/o1-refactoring-test/pull/1)

**Process**: After refactoring app, bookService and tests, one test was failing. This was because it was trying to find bookService from a folder `service` that never existed. After pointing this out, the import was fixed. After that, one test was still failing. 4o wasn't able to fix the test even after a few iterations and a fresh chat with the full codebase.

**Code quality**: renamed variables and function parameters, created a type Book And renamed the properties to something better, replaced for loops with array methods.

### o1-mini

[PR for o1-mini](https://github.com/sandst1/o1-refactoring-test/pull/3)

**Process**: Refactored app and bookService but tests were failing because of naming changes. After giving the test results, o1 decided to return to original function naming while preserving the structural code improvements. After this one test was failing, which o1 fixed.

App was still failing, o1-mini got confused by the long chat, and after I noticed the package.json was pointing to a (non-existent) backend folder, o1-mini fixed it and the app started working as well.

**Code quality**: renamed variables and function parameters, created a type Book, didn't rename the properties but added names in comment (:D), replaced for loops with array methods, replaced direct reference to BookService.bks with getAllBooks() method, edited comments,
updated `.gitignore`, renamed the project description in `package.json` from "An overly complex book management system" to "A maintainable book management system" :D

### o1-preview

[PR for o1-preview](https://github.com/sandst1/o1-refactoring-test/pull/4)

**Process**: Refactored app, tests and book service. App was working but all of the tests were failing. o1-preview fixed them in one go by adjusting bookService. After that the app wasn't working anymore because it wasn't adjusted, which was also fixed after pointing that out.

**Code quality**: renamed variables and function paramters, created a type Book, replaced for loops with array methods, replaced direct reference to BookService.bks with getAllBooks() method (but didn't use it everywhere), did not edit comments,

## Conclusion

Claude did more basic code and simpler changes but was fast and easier to work with. GPT-4o did most things correctly but failed in fixing the tests and hallucinated a non-existent folder.

Quality-wise, o1-mini and o1-preview did more complex code changes, o1-mini was even better than o1-preview in some sense (edited all the necessary files + some extra on first try).

In terms of cost, o1-mini used 0,56e and o1-preview 0,752e. Unfortunately I don't have the exact costs on Claude & GPT-4o as they are part of Cursor subscription. The price per 1M tokens (input/output) is as follows:

- claude-3.5-sonnet: $3 / $15
- gpt-4o: $5 / $15
- o1-mini: $3 / $12
- o1-preview: $15 / $60

From this POV and based on this LIMITED test of refactoring code, o1-mini seems to have the best code quality vs cost. Of course, it's slower than gpt-4o or claude-3.5-sonnet, but makes better code and more thorough changes. Then again, even if claude's code was not as thorough, it's clearly faster and I'm confident it's possible to prompt it to produce better code. So in everyday tasks that require small or moderate code changes, claude-3.5-sonnet seems to take the cake.

Based on this experience, I might not take o1 models for everyday use, but in a more complex problem definitely worth giving it a try. And for sure there are many other aspects than refactoring, where o1 models get to shine even more (like creating bigger things from scratch).
