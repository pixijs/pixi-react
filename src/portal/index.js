import { useEffect, useRef, useState } from "react";
import { PixiFiber } from "../reconciler";
import { TYPES } from "../utils/element";
import { useApp } from "../hooks/useApp";
import { useTick } from "../hooks/useTick";

const { Container } = TYPES;

function getPortalById(app, id) {
  app.__portals = app.__portals || {};
  return app.__portals[id];
}

function setPortalById(app, id, container) {
  app.__portals[id] = container;
}

export function createPortal(children, container) {
  return PixiFiber.createPortal(children, container);
}

export function PortalContainer({ portalId, children, ...containerProps }) {
  const app = useApp();
  const ref = useRef(null);

  useEffect(() => {
    setPortalById(app, portalId, ref.current);
  }, [ref.current]);

  return (
    <Container ref={ref} {...containerProps} name={portalId}>
      {props.children}
    </Container>
  );
}

export default function Portal({ children, portalId }) {
  const app = useApp();
  const [container, setContainer] = useState(() =>
    getPortalById(app, portalId)
  );

  useTick(() => {
    if (container && !container.destroyed && container.name === portalId)
      return;
    setContainer(getPortalById(app, portalId));
  });

  return container ? createPortal(children, container) : null;
}
