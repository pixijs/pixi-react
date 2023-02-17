import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactApplicationLayer from './ReactApplicationLayer';
import PixiApplicationLayer from './PixiApplicationLayer';

const root = ReactDOM.createRoot(document.getElementById('reactRoot'));

root.render(
    <React.StrictMode>
        <ReactApplicationLayer />
    </React.StrictMode>
);

const pixiRoot = new PixiApplicationLayer(document.getElementById('pixiRoot'));

