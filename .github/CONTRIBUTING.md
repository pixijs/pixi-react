# How to contribute

It is essential to the development of Pixi React that the community is empowered
to make changes and get them into the library. Here are some guidelines to make
that process silky smooth for all involved.

## Semantic Versioning

Pixi React follows [semantic versioning][semver]. We release patch versions for bugfixes, minor versions for new features,
and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor
version so that our users learn about the upcoming changes and migrate their code in advance.

## Reporting issues

To report a bug, request a feature, or even ask a question, make use of the GitHub Issues
section for [pixi-react][issues]. When submitting an issue please take the following steps:

1. **Search for existing issues.** Your question or bug may have already been answered or fixed,
   be sure to search the issues first before putting in a duplicate issue.

2. **Create an isolated and reproducible test case.** If you are reporting a bug, make sure you
   also have a minimal, runnable, code example that reproduces the problem you have.

3. **Include a live example.** After narrowing your code down to only the problem areas, make use of [CodeSandbox][codesandbox],
   [jsFiddle][fiddle], [jsBin][jsbin], or a link to your live site so that we can view a live example of the problem.

4. **Share as much information as possible.** Include browser version affected, your OS, version of
   the library, steps to reproduce, etc. "X isn't working!!!1!" will probably just be closed.

> NOTE: if you are looking for support, please visit the [Discord][discord].

## Contributing Changes

### Setting Up

To setup for making changes you will need to take a few steps, we've outlined them below:

1. Ensure you have node.js installed. We recommend that you install using [`nvm`][nvm]; alternatively you **can**
   download node.js from [nodejs.org][node]. Because pixi uses modern JS features, you will need a modern version
   of node. We recommend using the version defined in our [`.nvmrc`][nvmrc] file, which is generally the latest
   LTS version.  Currently (Jan 2024) the build is known to work with node v16 and v18; ***t**h**ere are reports of
   issues using v20***.

2. Fork the **[pixi-react][pixi-react]** repository, if you are unsure how to do this GitHub has a guides
   for the [command line][fork-cli] and for the [GitHub Client][fork-gui].

3. Next, run `npm install` from within your clone of your fork. That will install dependencies
   necessary to build Pixi-React.

4. Pixi React is set up as a monorepo, with separate packages for:
  - The main library - `packages/react`
  - The "animated" library, for working with `react-spring` - `packages/animated`
  - Their "legacy" counterparts for compatibility with `pixi.js-legacy` - `packages/react-**legacy**` and `packages/animated-legacy`
  - The sourcecode for the docs website, built with docusaurus - `packages/docs`

### Making a Change

Once you have node.js, the repository, and have installed dependencies are you almost ready to make your
change. The only other thing before you start is to checkout the correct branch. Which branch you should
make your change to (and send a PR to) depends on the type of change you are making.

Here is our branch breakdown:

- `master` - Make your change to the `master` branch if it is a bugfix with the current version or a backwards-compatible feature.
- `v6.x`, `v6.8.x`, `v6.7.x`, etc - Make your change to legacy branches (or tags) to patch old releases if your fix *only* applies to older versions.

Your change should be made directly to the branch in your fork, or to a branch in your fork made off of one of the above branches.

### Testing Your Change

You can test your change by using the automated tests packaged with React Pixi. You can run these tests by running `npm test`
from the command line, either from the project root to test all packages or from within an individual package to test only
that package. If you fix a bug please add a test that will catch that bug if it ever happens again. This prevents regressions
from sneaking in.

Commands:

- Run `npm run build` from the project root to build all packages.
- Run `npm run lint` from the project root to lint the whole project.
- Run `npm run test` from the project root to test all packages.
- Run `npm run test:watch` from within an individual package to run tests for that package as you make edits to code.

You can use the `docs` package as a way to test Pixi React features are working as expected. From within the `docs` package:

- Run `npm run start` to open a browser with a live reloading local version of the docs, navigate through the sections to see
  live code examples of specific Pixi React components and features.
- For now, when making code edits to different packages, you need to manually rebuild them for changes to be reflected in the
  `docs` - run `npm run build` again to do so.

### Submitting Your Change

After you have made and tested your change, commit and push it to your fork. Then, open a Pull Request
from your fork to the main **Pixi React** repository on the branch you used in the `Making a Change` section of this document.

## Quickie Code Style Guide

We use [`eslint`](https://eslint.org/) along with a custom configuration [`@pixi/eslint-config`][pixi-eslint] for code
formatting and linting. Run `npm run lint --fix` after making any changes to the code.

Our linter will catch most issues that may exist in your code. You can check the status of your code styling by simply
running `npm run lint`.

- Use 4 spaces for tabs, never tab characters.
- No trailing whitespace, blank lines should have no whitespace.
- Always favor strict equals `===` unless you *need* to use type coercion.
- Follow conventions already in the code, and listen to eslint.
- **Ensure changes are eslint validated.** After making a change be sure to run the build process to ensure that you didn't
  break anything.

[semver]: http://semver.org
[issues]: https://github.com/pixijs/pixi-react/issues
[fiddle]: http://jsfiddle.net
[jsbin]: http://jsbin.com
[codesandbox]: https://codesandbox.io
[discord]: https://discord.com/channels/734147990985375826/968068526566965279
[node]: http://nodejs.org
[nvmrc]: https://github.com/pixijs/pixi-react/blob/master/.nvmrc
[nvm]: https://github.com/nvm-sh/nvm
[pixi-react]: https://github.com/pixijs/pixi-react
[fork-cli]: https://help.github.com/articles/fork-a-repo/
[fork-gui]: https://guides.github.com/activities/forking/
[pixi-eslint]: https://github.com/pixijs/eslint-config

## Contributor Code of Conduct

[Code of Conduct](./CODE_OF_CONDUCT.md) is adapted from [Contributor Covenant, version 1.4](http://contributor-covenant.org/version/1/4)
