/**
 * Sets or removes an attribute on an element
 * @param {HTMLElement} el Target element
 * @param {String} name Attribute name
 * @param {String} [value]  Attribute value. If blank, attribute will be removed.
 */
function attr(el, name, value) {
  if (value === undefined) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, value);
  }
}

/**
 * Represents an HTML element with associate states
 */
class Animation {
  /**
   * @param {Object} options
   * @param {HTMLElement}  options.el Target element
   * @param {String} [options.state=initial] Initial state. This is also the default state.
   * @param {String} [options.stateAttribute=data-revealer] Attribute name to update with state.
   * @param {String} [options.stateChangeAttribute=data-revealer-transition] Attribute name to update with change of state.
   * @param {String} [options.endEvent=transitionend] Event name to listen for at end of state change.
   * @param {Boolean} [options.hold=false] If true, changeAttribute will not be removed until the next state change.
   * @param {Function} [options.atStart] Callback to execute immediate after applying stateChangeAttribute.
   */
  constructor(options) {
    this.el = options.el;

    this.state = options.state || 'initial';
    this.initialState = this.state;
    this.stateAttribute = options.stateAttribute || 'data-revealer';
    this.stateChangeAttribute = options.stateChangeAttribute || 'data-revealer-transition';
    this.endEvent = options.endEvent || 'transitionend';
    this.hold = !!options.hold;
    this.atStart = options.atStart || (() => { /* do nothing */ });

    this.activeEventHandler = null;
  }

  /**
   * Returns target element
   *
   * @return {HTMLElement} Target element
   */
  el() {
    return this.el;
  }

  /**
   * Returns current state
   *
   * @return {String} Current state
   */
  state() {
    return this.state;
  }

  /**
   * Check if a state is active
   * @param {String} state State to compare
   *
   * @return {Boolean}
   */
  is(state) {
    return state === this.state;
  }

  /**
   * Sequences a change to a new state.
   * @param {String} state Target state
   *
   * @return {Promise} Resolves when endEvent triggered
   */
  animateTo(state) {
    const from = this.el.dataset[this.stateAttribute] || this.state;
    const to = state || this.initialState;

    return new Promise(resolve => {
      if (from === to) return resolve(to, null);
      // If hold is set, should this keep the attribute and remove the value only?
      attr(this.el, this.stateChangeAttribute);

      window.requestAnimationFrame(() => {
        attr(this.el, this.stateChangeAttribute, from + ' > ' + to);
        this.atStart({ el: this.el, from, to});

        window.requestAnimationFrame(() => {
          this.el.removeEventListener(this.endEvent, this.activeEventHandler);

          this.activeEventHandler = e => {
            // Ignore any events bubbling up
            if (e.target !== this.el) return;
            this.el.removeEventListener(this.endEvent, this.activeEventHandler);
            if (!this.hold) {
              attr(this.el, this.stateChangeAttribute);
            }
            resolve(to, e);
          };

          this.el.addEventListener(this.endEvent, this.activeEventHandler);

          attr(this.el, this.stateAttribute, to);
          this.state = to;
        });
      });
    });
  }

  /**
   * Remove any event listeners
   * @private
   */
  _unload() {
    this.el.removeEventListener(this.endEvent, this.activeEventHandler);
    this.activeEventHandler = null;
  }
}

/**
 * Manage state changes for a set of elements
 */
export default class Revealer {
  constructor() {
    this.animations = new Map();
  }

  /**
   * Add a new element and return an animation for that element. If element already has an associated animation, return that animation.
   * @param {Object} options
   * @param {HTMLElement}  options.el Target element
   * @param {String} [options.state=initial] Initial state. This is also the default state.
   * @param {String} [options.stateAttribute=data-revealer] Attribute name to update with state.
   * @param {String} [options.stateChangeAttribute=data-revealer-transition] Attribute name to update with change of state.
   * @param {String} [options.endEvent=transitionend] Event name to listen for at end of state change.
   * @param {Boolean} [options.hold=false] If true, changeAttribute will not be removed until the next state change.
   * @param {Function} [options.atStart] Callback to execute immediate after applying stateChangeAttribute.
   *
   * @return {Animation}
   */
  add(options) {
    if (this.animations.has(options.el)) return this.animations.get(options.el);

    const animation = new Animation(options);
    this.animations.set(options.el, animation);
    return animation;
  }

  /**
   * Remove a single animation
   * @param {Animation} animation Animation to remove. Any event listeners will also be removed.
   */
  remove(animation) {
    this.animations.delete(animation.el());
    animation._unload();
  }

  /**
   * Remove all animations, including all event listeners.
   */
  removeAll() {
    this.animations.forEach(animation => animation._unload());
  }
}
