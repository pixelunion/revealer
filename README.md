# Revealer

Animate between states.

## Basic usage

[Codepen](https://codepen.io/thelornenelson/pen/oNNVrPB);

```js
import Revealer from '@pixelunion/revealer';

const revealer = new Revealer();

// Add a new animation using all defaults.
const animation = revealer.add(
  {
    el: document.querySelector('.to-animate');
  }
);

// Animate to state 'final';
animation.animateTo('final');
```

```scss
[data-revealer='initial'] {
  display: none;
  opacity: 0;
  background-color: red;
}

[data-revealer-transition] {
  display: block;
}

[data-revealer-transition="initial > final"] {
  transition: background-color 500ms, opacity 500ms;
}

[data-revealer-transition="final > initial"] {
  transition: background-color: 2000ms, opacity 2000ms;
}

[data-revealer='final'] {
  background-color: blue;
  opacity: 1;
}
```

## Using with animations

[Codepen](https://codepen.io/thelornenelson/pen/jOOROXJ)

```js
import Revealer from '@pixelunion/revealer';

const revealer = new Revealer();

// Add a new animation using all defaults.
const animation = revealer.add(
  {
    el: document.querySelector('.to-animate'),
    endEvent: 'animationend',
    hold: true,
  }
);

// Animate to state 'final';
animation.animateTo('final');
```

```scss
@keyframes change-color {
  0% {
    opacity: 0;
    background-color: red;
  }

  50% {
    background-color: green;
  }

  100% {
    opacity: 1;
    background-color: blue;
  }
}

[data-revealer='initial'] {
  display: none;
}

[data-revealer-transition],
[data-revealer='final'] {
  display: block;
}

[data-revealer-transition="initial > final"] {
  animation: change-color 500ms normal both;
}

[data-revealer-transition="final > initial"] {
  animation: change-color 2000ms reverse both;
}
```
