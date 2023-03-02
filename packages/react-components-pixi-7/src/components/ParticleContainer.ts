import { ParticleContainer as PixiParticleContainer } from '@pixi/particle-container';
import type { ExpandoContainer, ExpandoParticleContainer, PropsType } from '../types';

export type ParticleContainerProps = PropsType & {
    maxSize?: number;
    batchSize?: number;
    autoResize?: boolean;
};

const ParticleContainer = (_root: ExpandoContainer, props: ParticleContainerProps) =>
{
    const { maxSize = 1500, batchSize = 16384, autoResize = false } = props;

    const properties = {
        ...{
            vertices: false,
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            tint: true,
        },
        ...(props.properties || {}),
    };

    const destroyOptions = {
        ...{
            children: false,
            texture: false,
            baseTexture: false,
        },
        ...(props.destroyOptions || {}),
    };

    const container: ExpandoParticleContainer = new PixiParticleContainer(maxSize, properties, batchSize, autoResize);

    container.willUnmount = (instance) =>
    {
        instance.destroy(destroyOptions);
    };

    return container;
};

export default ParticleContainer;
