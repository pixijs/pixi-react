import { useFileLanguage } from './useFileLanguage';
import { usePixiMonaco } from './usePixiDefinitions';
import { FileTabs, SandpackStack, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import { Editor, useMonaco } from '@monaco-editor/react';

import type { CSSProperties } from 'react';

interface MonacoViewProps
{
    fontSize?: number;
    style?: CSSProperties;
    pixiVersion: string;
    handleEditorCodeChanged?: (nextSourceCode: string | undefined) => void;
}
export function MonacoView({ fontSize = 12, style, pixiVersion, handleEditorCodeChanged }: MonacoViewProps)
{
    const { code, updateCode } = useActiveCode();
    const { sandpack } = useSandpack();
    const monaco = useMonaco();
    const language = useFileLanguage(sandpack.activeFile);
    const { colorMode } = useColorMode();

    usePixiMonaco(monaco, pixiVersion);

    return (
        <SandpackStack style={{ height: '100%', margin: 0, ...style }}>
            <FileTabs />
            <div style={{ flex: 1, paddingTop: 8, background: colorMode === 'dark' ? '#1e1e1e' : '#FFFFFE' }}>
                <Editor
                    width="100%"
                    height="100%"
                    language={language}
                    theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
                    key={sandpack.activeFile}
                    defaultValue={code}
                    onChange={(value) =>
                    {
                        updateCode(value || '');
                        handleEditorCodeChanged?.(value);
                    }}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontSize,
                    }}
                />
            </div>
        </SandpackStack>
    );
}
