import styles from './index.module.css';
import Link from '@docusaurus/Link';

import type React from 'react';

export interface CTAOptions
{
    label: string;
    link: string;
    white?: boolean;
    outline?: boolean;
    style?: React.CSSProperties;
    anim?: string;
}

export default function CTA(opts: CTAOptions): JSX.Element
{
    let classNames = styles.button;

    if (opts.anim)
    {
        classNames += ` ${opts.anim}`;
    }

    return (
        <Link className={classNames} to={opts.link} style={opts?.style || {}}>
            <div className={styles.buttonShadow}>
                <div></div>
            </div>
            <span>{opts.label}</span>
            <svg
                className="next"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 23 14"
                xmlSpace="preserve"
            >
                <line x1="22" y1="7" x2="16" y2="1"></line>
                <line x1="22" y1="7" x2="16" y2="13"></line>
                <line x1="0" y1="7" x2="23" y2="7"></line>
            </svg>
        </Link>
    );
}
