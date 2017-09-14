const raf = window.requestAnimationFrame;

function attr(el, name, value) {
  if (value === undefined) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, value);
  }
}

// Event tracker
function createEventTracker() {
  const attrId = 'data-revealer-id';
  const event = 'transitionend';
  const map = {};
  let uid = 0;

  function ident(el) {
    const id = el.getAttribute(attrId);
    if (id !== null) return id;

    uid++;
    attr(el, attrId, uid);
    return '' + uid;
  }

  return function track(el, fn, d) {
    const id = ident(el);

    // Remove existing handler
    if (map[id]) el.removeEventListener(event, map[id]);
    if (!fn) return;

    // Track new handler
    map[id] = fn;
    el.addEventListener(event, fn);
  }
}

export default function revealer(options) {
  // Options
  options = options || {};
  const initialState = options.initialState || 'initial';
  const attrState = options.stateAttribute || 'data-revealer';
  const attrTrans = options.transitionAttribute || 'data-revealer-transition';

  // Events
  const track = createEventTracker();

  function is(el, state) {
    state = state || initialState;
    return (el.getAttribute(attrState) || initialState) === state;
  }

  function transition(el, state, cb) {
    const from = el.getAttribute(attrState) || initialState;
    const to = state || initialState;
    if (from === to) return;

    raf(function(){
      attr(el, attrTrans, from + ' > ' + to);

      raf(function(){
        attr(el, attrState, to);

        track(el, function(event){
          attr(el, attrTrans);
          if (cb) cb(event);
        });
      });
    });
  }

  return {
    is: is,
    transition: transition,
  };
}
