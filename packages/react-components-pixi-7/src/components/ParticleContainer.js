import { ParticleContainer as PixiParticleContainer } from '@pixi/particle-container';

const ParticleContainer = (root, props) =>
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

    const container = new PixiParticleContainer(maxSize, properties, batchSize, autoResize);

    container.willUnmount = (instance, child, parent) =>
    {
        instance.destroy(destroyOptions);
    };

    return container;
};

export default ParticleContainer;
