import { Application, Container, Graphics } from 'pixi.js';
import React from 'react';
import { createApplication, extend } from '@pixi/react';

// Extend the library with the Pixi components we want to use
extend({ Container, Graphics });

// Create a PixiJS application
const app = new Application();

async function initializeApp() {
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });

  // Add the canvas to the page
  document.body.appendChild(app.canvas);

  // Hook into the application with React
  const { useApp, useTick, createRoot } = createApplication(app);

  // Create React components that use Pixi
  const RotatingSquare = ({ x, y }) => {
    const [rotation, setRotation] = React.useState(0);

    // Use the tick hook to animate
    useTick((ticker) => {
      setRotation(r => r + 0.01 * ticker.deltaTime);
    });

    return (
      <pixiContainer x={x} y={y} rotation={rotation}>
        <pixiGraphics
          draw={(graphics) => {
            graphics.clear();
            graphics.rect(-50, -50, 100, 100);
            graphics.fill(0xff0000);
          }}
        />
      </pixiContainer>
    );
  };

  const AppInfoDisplay = () => {
    const app = useApp();
    
    React.useEffect(() => {
      console.log('Canvas dimensions:', app.canvas.width, app.canvas.height);
    }, [app]);

    return (
      <pixiContainer x={10} y={10}>
        <pixiGraphics
          draw={(graphics) => {
            graphics.clear();
            graphics.rect(0, 0, 200, 60);
            graphics.fill(0x000000, 0.5);
          }}
        />
      </pixiContainer>
    );
  };

  // Create multiple independent roots
  const containerA = new Container();
  const containerB = new Container();
  const containerC = new Container();

  app.stage.addChild(containerA, containerB, containerC);

  // Each root maintains its own state
  const rootA = createRoot(containerA, <RotatingSquare x={200} y={200} />);
  const rootB = createRoot(containerB, <RotatingSquare x={400} y={200} />);
  const rootC = createRoot(containerC, <AppInfoDisplay />);

  return { rootA, rootB, rootC };
}

// Initialize the application
initializeApp()
  .then((roots) => {
    console.log('Application initialized with roots:', roots);
  })
  .catch((error) => {
    console.error('Failed to initialize application:', error);
  });
