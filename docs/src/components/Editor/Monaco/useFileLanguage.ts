import { useMemo } from 'react';

const getFileExtension = (filename: string): string =>
{
    const parts = filename.split('.');

    return parts[parts.length - 1];
};

const getLanguage = (filename: string): string =>
{
    const extension = getFileExtension(filename);

    if (extension === 'js')
    {
        return 'javascript';
    }

    if (extension === 'ts')
    {
        return 'typescript';
    }

    if (extension === 'vert' || extension === 'frag')
    {
        return 'glsl';
    }

    return extension;
};

export const useFileLanguage = (filename: string) =>
{
    const language = useMemo(() => getLanguage(filename), [filename]);

    return language;
};
