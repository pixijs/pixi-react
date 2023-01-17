// In this monorepo linting is set up per workspace following the example from turborepo:
// https://turbo.build/repo/docs/handbook/linting
// Setting up the configs as modules works really nicely for parallelization and to handle includes/excludes, which can get
// super messy globally, but it doesn't play nicely with husky at all, which expects to be able to lint globally. It also
// doesn't easily allow us to lint the scripts and shared folders along with random root js files. This config exists to
// handle these problems and dynamically shepherds the package specific includes/excludes into a single global config.
// TODO: can we fix/improve this somehow?

const { existsSync, readdirSync } = require('fs');
const { join } = require('path');

const ignorePatterns = [];

try
{
    const packages = readdirSync('packages');

    for (const folder of packages)
    {
        const packagePath = join('packages', folder);
        const eslintPath = join(packagePath, '.eslintrc.js');

        if (existsSync(eslintPath))
        {
            // eslint-disable-next-line global-require
            const packageLintConfig = require(`./${eslintPath}`);
            const packagePatternToGlobalPattern = (packagePattern) => join('/', packagePath, packagePattern);

            ignorePatterns.push(...packageLintConfig.ignorePatterns.map(packagePatternToGlobalPattern));
        }
    }
}
catch (err)
{
    console.error('Error reading ignorePatterns from packages', err);
}

module.exports = {
    root: true,
    extends: ['pixi-react'],
    parserOptions: {
        project: ['tsconfig.eslint.json'],
        tsconfigRootDir: __dirname
    },
    ignorePatterns: [
        ...ignorePatterns,
        'dist',
        'node_modules'
    ]
};
