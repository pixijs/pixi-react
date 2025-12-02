import { themes as prismThemes } from 'prism-react-renderer';

import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
    title: 'PixiJS React',
    tagline: 'Write PixiJS applications using React declarative style.',
    favicon: 'img/favicon.png',

    // Set the production url of your site here
    url: 'https://react.pixijs.io',
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'pixijs', // Usually your GitHub org/user name.
    projectName: 'pixi-react', // Usually your repo name.
    deploymentBranch: 'gh-pages', // Branch that GitHub pages will deploy to.
    trailingSlash: true,

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    future: {
        // eslint-disable-next-line camelcase
        experimental_faster: true,
    },

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: './sidebars.ts',
                    editUrl:
                        'https://github.com/pixijs/pixi-react/tree/main/docs/',
                    lastVersion: 'current',
                    versions: {
                        '7.x': {
                            label: 'v7.x',
                            path: '7.x',
                            banner: 'none',
                            badge: true,
                        },
                        current: {
                            label: 'v8.x',
                            path: '/',
                            banner: 'none',
                            badge: false,
                        },
                    },
                    breadcrumbs: false
                },
                blog: {
                    showReadingTime: true,
                    editUrl:
                        'https://github.com/pixijs/pixi-react/tree/main/docs/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/ogimage.jpg',
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: true,
            respectPrefersColorScheme: false,
        },
        navbar: {
            title: 'React',
            logo: {
                alt: 'PixiJS Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'docs',
                    position: 'left',
                    label: 'Docs',
                    items: [
                        {
                            type: 'doc',
                            docId: 'getting-started/intro',
                            position: 'left',
                            label: 'Guides',
                        }]
                },

                {
                    type: 'docsVersionDropdown',
                    position: 'right',
                    dropdownActiveClassDisabled: true,
                },
                {
                    href: 'https://opencollective.com/pixijs',
                    className: 'header-link header-open-col-link',
                    'aria-label': 'Open Collective',
                    position: 'right',
                },
                {
                    href: 'https://twitter.com/pixijs',
                    position: 'right',
                    className: 'header-link header-twitter-link',
                    'aria-label': 'Twitter account',
                },
                {
                    href: 'https://discord.gg/zqbXQAADuM',
                    position: 'right',
                    className: 'header-link header-discord-link',
                    'aria-label': 'Discord server',
                },
                {
                    href: 'https://github.com/pixijs/pixi-react',
                    position: 'right',
                    className: 'header-link header-github-link',
                    'aria-label': 'GitHub repository',
                },
            ],
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
