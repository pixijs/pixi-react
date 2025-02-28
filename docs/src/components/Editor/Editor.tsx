import { useState } from 'react';
import { dracula } from './defaults/theme';
import { EditorLayout } from './Sandpack/Layout';
import StylesFile from '!!raw-loader!./defaults/styles.css';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { githubLight } from '@codesandbox/sandpack-themes';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

export interface EditorProps
{
    viewType?: 'both' | 'editor' | 'preview';
    showConsole?: boolean;
    width?: number | string;
    height?: number | string;
    version?: 'v7' | 'v8';
    dependencies?: Record<string, string>;
    files?: Record<string, { code: string; hidden?: boolean; active?: boolean } | string>;
    fontSize?: number;
    handleEditorCodeChanged?: (nextSourceCode: string | undefined) => void;
}

const v7Dependencies = {
    'pixi.js': '^7',
    '@pixi/react': '^7',
    react: '^18',
    'react-dom': '^18',
};

const v8Dependencies = {
    '@pixi/react': 'beta',
    'pixi.js': '^8',
    'pixi-viewport': '^6',
    react: '^19',
    'react-dom': '^19',
};

export function Editor({
    viewType = 'both',
    showConsole = false,
    width = '100%',
    height = '100%',
    version = 'v8',
    dependencies,
    files = {},
    fontSize = 12,
    handleEditorCodeChanged,
}: EditorProps)
{
    const { colorMode } = useColorMode();

    const filesWithoutIndexJs = { ...files };

    // delete filesWithoutIndexJs['App.js'];

    const [filesState] = useState({
        '/styles.css': { code: StylesFile, hidden: true },
        'sandbox.config.json': { code: `{"infiniteLoopProtection": false}`, hidden: true },
        '/public/index.html': {
            code: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>`,
            hidden: true,
        },
        '/index.js': {
            code: `import React from "react";
            import { createRoot } from "react-dom/client";
            import "./styles.css";

            import App from "./App";

            const root = createRoot(document.getElementById("root"));
            root.render(
                <App />
            );`,
            hidden: true,
        },
        ...filesWithoutIndexJs,
    });

    dependencies ??= version === 'v7' ? v7Dependencies : v8Dependencies;

    return (
        <BrowserOnly>
            {() => (
                <SandpackProvider
                    template="react"
                    theme={colorMode === 'dark' ? dracula : githubLight}
                    files={filesState}
                    customSetup={{ dependencies }}
                    style={{ height, width, margin: '0 auto', maxWidth: '100%' }}
                    options={{ recompileDelay: 500 }}>
                    <EditorLayout
                        fontSize={fontSize}
                        handleEditorCodeChanged={handleEditorCodeChanged}
                        pixiVersion={dependencies['pixi.js']}
                        showConsole={showConsole}
                        viewType={viewType} />
                </SandpackProvider>
            )}
        </BrowserOnly>
    );
}
