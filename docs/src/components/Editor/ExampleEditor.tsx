import { Editor, type EditorProps } from './Editor';
import { useContainerClassNameModifier } from './useContainerClassNameModifier';

export function ExampleEditor(props: EditorProps)
{
    // hack the .container class to add a modifier
    useContainerClassNameModifier('example', true);

    return <Editor height="calc(100vh - 325px)" fontSize={14} {...props} />;
}
