import clsx from 'clsx';
import { type JSX } from 'react';
import CTA from './CTA';
import styles from './index.module.css';
import ExampleApp from '!!raw-loader!../examples/basic/App';
import ExampleBunnySprite from '!!raw-loader!../examples/basic/BunnySprite';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { EmbeddedEditor } from '@site/src/components/Editor/EmbeddedEditor';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

function HomepageHeader()
{
    const { siteConfig } = useDocusaurusContext();

    return (
        <header className={clsx(styles.heroBanner)}>
            <div className="container">
                <Heading as="h1">
                    <img src="/img/logo-main.svg" alt="Logo" width={'100%'} style={{ maxHeight: 150 }} />
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
        <Layout title={`${siteConfig.title}`} description="A CLI tool to create PixiJS projects">
            <HomepageHeader />
            <main
                style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: -60,
                    marginBottom: 60,
                }}>
                <section
                    style={{
                        textAlign: 'center',
                        maxWidth: 800,
                        width: '100%',
                        padding: 20,
                    }}>
                    <div
                        style={{
                            border: '2px solid #676767',
                            borderRadius: 10,
                            marginBottom: 40,
                            maxWidth: 800,
                            width: '100%',
                        }}>
                        <EmbeddedEditor
                            files={{
                                'App.js': ExampleApp,
                                'BunnySprite.js': ExampleBunnySprite,
                            }}
                            viewType={'both'}
                            width={'100%'} />
                    </div>
                    <CTA label="Get Started" link="getting-started/intro" />
                </section>
            </main>
        </Layout>
    );
}
