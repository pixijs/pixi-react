import { useEffect } from 'react';
import { registerGLSL } from './glsl';

import type { Monaco } from '@monaco-editor/react';

function getStorageValue<T>(key: string, defaultValue: T)
{
    // getting stored value
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved as string) as T;

    return initial || defaultValue;
}

export const getPixiDefinitions = async (version: string) =>
{
    const key = `pixi-definitions-${version}`;
    const value = getStorageValue(key, null);

    if (!value)
    {
        try
        {
            const response = await fetch(`https://cdn.jsdelivr.net/npm/pixi.js@${version}/dist/pixi.js.d.ts`);
            const pixiTypes = await response.text();

            if (pixiTypes.startsWith('// Generated by dts-bundle-generator'))
            {
                localStorage.setItem(key, JSON.stringify(pixiTypes));

                return pixiTypes;
            }

            return null;
        }
        catch (error)
        {
            console.error('Failed to fetch pixi.js types:', error);

            return null;
        }
    }

    return value;
};

export const usePixiMonaco = (monaco: Monaco | null, version = 'latest') =>
{
    useEffect(() =>
    {
        const handleEditorWillMount = async (monaco: Monaco) =>
        {
            const pixiTypes = await getPixiDefinitions(version);

            const pixiModuleDeclaration = `declare module 'pixi.js' { ${pixiTypes} }`;
            const shaderModuleDeclaration = `
            declare module '*.wgsl' {
                const shader: 'string';
                export default shader;
            }

            declare module '*.vert' {
                const shader: 'string';
                export default shader;
            }

            declare module '*.frag' {
                const shader: 'string';
                export default shader;
            }`;

            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                pixiModuleDeclaration,
                `file:///node_modules/pixi.js/index.d.ts`,
            );
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
                pixiModuleDeclaration,
                `file:///node_modules/pixi.js/index.d.ts`,
            );

            monaco.languages.typescript.typescriptDefaults.addExtraLib(shaderModuleDeclaration);
            monaco.languages.typescript.javascriptDefaults.addExtraLib(shaderModuleDeclaration);

            registerGLSL(monaco);
        };

        if (monaco)
        {
            void handleEditorWillMount(monaco);
        }
    }, [monaco, version]);
};
