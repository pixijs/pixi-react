import clsx from 'clsx';
import styles from './index.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

function HomepageHeader()
{
    const { siteConfig } = useDocusaurusContext();

    return (
        <header className={clsx(styles.heroBanner)}>
            <div className="container">
                <Heading as="h1">
                    <img
                        src="/react/img/logo-main.svg"
                        alt="Logo"
                        width={'100%'}
                        style={{ maxHeight: 150 }}
                    />
                </Heading>
                <p className="hero__subtitle" style={{ marginTop: -30 }}>
                    {siteConfig.tagline}
                </p>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element
{
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout
            title={`${siteConfig.title}`}
            description="A CLI tool to create PixiJS projects"
        >
            <HomepageHeader />
            <main
                style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: -60,
                }}
            >
                <section
                    style={{
                        textAlign: 'left',
                        maxWidth: 800,
                        width: '100%',
                        padding: 20,
                    }}
                >
                    <img
                        src="/react/img/demo.gif"
                        alt="Demo GIF"
                        style={{
                            width: '100%',
                            maxWidth: 800,
                            marginBottom: 20,
                            borderRadius: 10, // Add this line for rounded borders
                            border: '2px solid #676767', // Optional: Add a border
                        }}
                    />
                    <p>With NPM:</p>
                    <pre>
                        <code>npm create pixi.js@latest</code>
                    </pre>
                    <p>With Yarn:</p>
                    <pre>
                        <code>yarn create pixi.js</code>
                    </pre>
                    <p>With PNPM:</p>
                    <pre>
                        <code>pnpm create pixi.js</code>
                    </pre>
                    <p>With Bun:</p>
                    <pre>
                        <code>bun create pixi.js</code>
                    </pre>
                </section>
            </main>
        </Layout>
    );
}
