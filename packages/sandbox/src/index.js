import React from 'react';
import ReactDOM from 'react-dom/client';
import { Assets } from 'pixi.js';
import App from './App';

async function init() {
    await Assets.load('https://pixijs.io/pixi-react/img/bunny.png');
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}

init();
