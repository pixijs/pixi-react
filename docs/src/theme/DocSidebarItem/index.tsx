import { type JSX } from 'react';
import DocSidebarItem from '@theme-original/DocSidebarItem';

interface DocSidebarItemProps
{
    item: {
        type: string;
        href?: string;
    };
    level: number;
    activePath: string;
}

/**
 * DocSidebarItemWrapper component
 * @param {DocSidebarItemProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function DocSidebarItemWrapper(props: DocSidebarItemProps): JSX.Element
{
    let color = props.item.type === 'category' && props.level === 1 ? 'var(--sidebar-category-color)' : 'grey';

    if (props.activePath === props.item.href)
    {
        color = 'var(--ifm-color-primary)';
    }

    return (
        <DocSidebarItem {...props} style={{ fontSize: '14px', marginTop: '0px', color }}></DocSidebarItem>
    );
}
