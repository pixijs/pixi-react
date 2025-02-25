import { Editor, type EditorProps } from './Editor';

export function EmbeddedEditor(props: EditorProps)
{
    return <Editor height={600} width={800} viewType={'preview'} {...props} />;
}
