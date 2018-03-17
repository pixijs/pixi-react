import "regenerator-runtime/runtime";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.map";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

import invariant from 'fbjs/lib/invariant';
import { Container } from 'pixi.js';
import PixiFiber, { PACKAGE_NAME, VERSION } from '../reconciler'; // cache root containers

export var roots = new Map();
/**
 * Renderer
 *
 * @param {any} element
 * @param {Container} container (i.e. the Stage)
 * @returns {Promise<void>}
 */

function render(_x, _x2, _x3) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(element, container, callback) {
    var root;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            invariant(container instanceof Container, 'Invalid argument `container`, expected instance of `PIXI.Container`.');
            root = roots.get(container);

            if (!root) {
              // get the flushed fiber container
              root = PixiFiber.createContainer(container);
              roots.set(container, root);
            } // schedules a top level update


            PixiFiber.updateContainer(element, node, null, callback); // inject into react devtools

            PixiFiber.injectIntoDevTools({
              bundleType: process.env.NODE_ENV === 'development' ? 1 : 0,
              version: VERSION,
              rendererPackageName: PACKAGE_NAME,
              findHostInstanceByFiber: PixiFiber.findHostInstance
            }); // parse input and returns output here ?
            // return the root instance

            return _context.abrupt("return", PixiFiber.getPublicRootInstance(node));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _render.apply(this, arguments);
}