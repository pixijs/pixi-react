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
    dependencies?: Record<string, string>;
    files?: Record<string, { code: string; hidden?: boolean; active?: boolean } | string>;
    fontSize?: number;
    handleEditorCodeChanged?: (nextSourceCode: string | undefined) => void;
}

export function Editor({
    viewType = 'both',
    showConsole = false,
    width = '100%',
    height = '100%',
    dependencies = { 'pixi.js': '^7', '@pixi/react': 'latest', react: '^18', 'react-dom': '^18' },
    files = { 'App.js': '// Your code here' },
    fontSize = 12,
    handleEditorCodeChanged,
}: EditorProps)
{
    const { colorMode } = useColorMode();

    const filesWithoutIndexJs = { ...files };

    delete filesWithoutIndexJs['App.js'];

    const [filesState] = useState({
        '/styles.css': { code: StylesFile, hidden: true },
        'sandbox.config.json': { code: `{"infiniteLoopProtection": false}`, hidden: true },
        'App.js': {
            code: (files['App.js'] as string) ?? '// Your code here',
            hidden: false,
            active: true,

        },
        ...filesWithoutIndexJs,
    });

    return (
        <BrowserOnly>
            {() => (
                <SandpackProvider
                    template="react"
                    theme={colorMode === 'dark' ? dracula : githubLight}
                    files={filesState}
                    customSetup={{ dependencies, entry: 'index.html' }}
                    style={{ height, width, margin: '0 auto', maxWidth: '100%' }}
                    options={{
                        recompileDelay: 500,
                    }}
                >
                    <EditorLayout
                        {...{
                            handleEditorCodeChanged,
                            viewType,
                            showConsole,
                            fontSize,
                            pixiVersion: dependencies['pixi.js'],
                        }}
                    />
                </SandpackProvider>
            )}
        </BrowserOnly>
    );
}
