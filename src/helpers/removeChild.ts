/**
 * Removes elements from our scene and disposes of them.
 *
 * @param {*} parentInstance
 * @param {*} child
 * @returns
 */
export function removeChild(parentInstance: any, child: any)
{
    if (!child)
    {
        return;
    }

    // Remove material, geometry, fog, etc.
    if (child.attach && (typeof parentInstance[child.attach] !== 'undefined'))
    {
        parentInstance[child.attach] = null;
    }
    else
    {
        parentInstance.remove(child);
    }

    // Safely dispose of element
    if (child.type !== 'Scene')
    {
        if (child.dispose)
        {
            child.dispose();
        }

        // Dispose of its properties as well
        for (const property in child)
        {
            // if (property.dispose) // not a thing in pixi
            // {
            //     property.dispose();
            // }

            delete child[property];
        }
    }
}
