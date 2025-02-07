import { ConsoleIcon, RoundedButton } from '@codesandbox/sandpack-react';

interface ConsoleCounterButtonProps
{
    onClick: () => void;
}
export const ConsoleCounterButton: React.FC<ConsoleCounterButtonProps> = ({ onClick }: ConsoleCounterButtonProps) => (
    <RoundedButton
        style={{
            position: 'relative',
        }}
        onClick={onClick}
    >
        <ConsoleIcon />
    </RoundedButton>
);
