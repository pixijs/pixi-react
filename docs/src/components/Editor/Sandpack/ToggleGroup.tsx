import { type FC, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

interface ToggleGroupProps
{
    onSelectionChange: (selected: 'editor' | 'preview' | 'both') => void;
    defaultSelection?: string;
}

export const ToggleGroup: FC<ToggleGroupProps> = ({ onSelectionChange, defaultSelection = 'both' }) =>
{
    const [selected, setSelected] = useState<string>(defaultSelection);
    const { colorMode } = useColorMode();

    const handleClick = (button: 'editor' | 'preview' | 'both') =>
    {
        setSelected(button);
        onSelectionChange(button);
    };

    const buttonStyle = {
        height: '100%',
        width: 'max-content',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: colorMode === 'dark' ? '#F6F8FA' : '#2E3138',
        border: 'none',
    };

    const selectedBackgroundColor = colorMode === 'dark' ? '#22232A' : '#e2e2e2';

    return (
        <div
            style={{
                height: 32,
                width: '100%',
                overflow: 'hidden',
                backgroundColor: colorMode === 'dark' ? '#2E3138' : '#F6F8FA',
                display: 'flex',
                justifyContent: 'right',
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
            }}
        >
            <button
                onClick={() => handleClick('editor')}
                style={{ backgroundColor: selected === 'editor' ? selectedBackgroundColor : 'transparent', ...buttonStyle }}
            >
                Editor
            </button>
            <button
                onClick={() => handleClick('preview')}
                style={{ backgroundColor: selected === 'preview' ? selectedBackgroundColor : 'transparent', ...buttonStyle }}
            >
                Preview
            </button>
            <button
                onClick={() => handleClick('both')}
                style={{ backgroundColor: selected === 'both' ? selectedBackgroundColor : 'transparent', ...buttonStyle }}
            >
                Both
            </button>
        </div>
    );
};
