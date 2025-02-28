import { useState } from 'react';
import { MonacoView } from '../Monaco/MonacoView';
import { ConsoleCounterButton } from './ConsoleCounterButton';
import { ToggleGroup } from './ToggleGroup';
import { SandpackConsole, SandpackLayout, SandpackPreview, SandpackStack } from '@codesandbox/sandpack-react';

import type { EditorProps } from '../Editor';

export function EditorLayout(
    props: Required<Pick<EditorProps, 'viewType' | 'showConsole' | 'fontSize'>> & {
        pixiVersion: string;
        handleEditorCodeChanged?: (nextSourceCode: string | undefined) => void;
    },
)
{
    const { viewType, showConsole, fontSize, pixiVersion } = props;
    const [consoleVisibility, setConsoleVisibility] = useState(showConsole);
    const [viewSelection, setViewSelection] = useState<string>(viewType);

    const actionsChildren = (
        <>
            {/* <ToggleCodeButton onClick={() => setCodeVisibility((prev) => !prev)} visible={codeVisibility} /> */}
            <ConsoleCounterButton onClick={() => setConsoleVisibility((prev) => !prev)} />
        </>
    );

    const handleSelectionChange = (selected: string) =>
    {
        setViewSelection(selected);
    };

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <SandpackLayout
                style={{
                    height: '100%',
                    overflow: 'hidden',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    flexWrap: 'nowrap',
                    // TODO: change to column when screen is small
                    // flexDirection: 'column'
                }}
            >
                <MonacoView
                    fontSize={fontSize}
                    style={{
                        flexGrow: viewSelection !== 'preview' ? 1 : 0,
                        flexShrink: viewSelection !== 'preview' ? 1 : 0,
                        flexBasis: viewSelection === 'editor' ? '100%' : 0,
                        width: '100%',
                        overflow: 'hidden',
                    }}
                    pixiVersion={pixiVersion}
                    handleEditorCodeChanged={props.handleEditorCodeChanged}
                />
                <SandpackStack style={{ height: '100%', width: '100%' }}>
                    <SandpackPreview
                        style={{
                            flexGrow: viewSelection !== 'editor' ? 100 : 0,
                            flexShrink: viewSelection !== 'editor' ? 100 : 0,
                            flexBasis: viewSelection !== 'editor' ? '100%' : 0,
                            overflow: 'hidden',
                        }}
                        showOpenInCodeSandbox={false}
                        actionsChildren={actionsChildren}
                    />
                    {consoleVisibility && (
                        <div
                            style={{
                                flexGrow: consoleVisibility ? 35 : 0,
                                flexShrink: consoleVisibility ? 35 : 0,
                                flexBasis: consoleVisibility ? '35%' : 0,
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <SandpackConsole showHeader={false} />
                        </div>
                    )}
                </SandpackStack>
            </SandpackLayout>
            <ToggleGroup onSelectionChange={handleSelectionChange} defaultSelection={viewSelection} />
        </div>
    );
}
