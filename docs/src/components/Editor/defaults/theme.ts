import type { SandpackThemeProp } from '@codesandbox/sandpack-react';

export const dracula: SandpackThemeProp = {
    colors: {
        surface1: '#242426',
        surface2: '#444950',
        surface3: '#44475a',
        clickable: '#fff',
        base: '#f8f8f2',
        disabled: '#6272a4',
        hover: '#f8f8f2',
        accent: '#e91e63',
        error: '#f8f8f2',
        errorSurface: '#44475a',
    },
    syntax: {
        plain: '#f8f8f2',
        comment: {
            color: '#6272a4',
            fontStyle: 'italic',
        },
        keyword: '#ff79c6',
        tag: '#ff79c6',
        punctuation: '#ff79c6',
        definition: '#f8f8f2',
        property: '#50fa7b',
        static: '#bd93f9',
        string: '#f1fa8c',
    },
    font: {

        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
        size: '13px',
        lineHeight: '20px',
    },
};
