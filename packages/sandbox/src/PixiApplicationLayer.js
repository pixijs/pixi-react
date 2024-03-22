import React from 'react';
import { Application, Container, Sprite } from 'pixi.js';
import { createRoot } from '@pixi/react';
import { UIWithAppProvider } from './UI';

export default class PixiApplicationLayer
{
    iteration = 0;

    constructor(domContainer)
    {
        this.app = new Application();
        this.app.ticker.add(this.update.bind(this));

        domContainer.appendChild(this.app.view);

        this.gameContainer = new Container();
        this.reactContainer = new Container();

        this.bunny = Sprite.from('https://pixijs.io/pixi-react/img/bunny.png');
        this.gameContainer.addChild(this.bunny);

        this.app.stage.addChild(this.gameContainer);
        this.app.stage.addChild(this.reactContainer);

        this.root = createRoot(this.reactContainer);
        this.root.render(<UIWithAppProvider app={this.app} />);
    }

    update(delta)
    {
        this.iteration += 0.05 * delta;
        const i = this.iteration;

        const x = 400 + Math.sin(i) * 100;
        const y = 300 + Math.sin(i / 1.5) * 100;
        const rotation = Math.sin(i) * Math.PI;
        const anchor = Math.sin(i / 2);

        this.bunny.position.set(x, y);
        this.bunny.rotation = rotation;
        this.bunny.anchor.set(anchor);
    }
}

