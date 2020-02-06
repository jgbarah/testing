AFRAME.registerComponent('mixadora', {
  schema: {
    withTotem: {type: 'boolean', default: true}
  },

  init: function () {
    let el = this.el;

    if (this.data.withTotem) {
      let totem = document.createElement('a-entity');
      totem.setAttribute('mixadora-remote', {});
      el.appendChild(totem);
    };
  }
});

AFRAME.registerComponent('mixadora-remote', {
  schema: {
  },

  init: function () {
    let el = this.el;

    let totem = document.createElement('a-entity');
    totem.setAttribute('geometry', {primitive: 'box',
                                    width: 1, height: 2, depth: .1});
    totem.setAttribute('position', {x: 0, y: 0, z: 0});
    totem.setAttribute('grabbable', {});
//    totem.setAttribute('hoverable', {});
    totem.classList.add("remote");

    let button = document.createElement('a-entity');
    button.setAttribute('mixadora-button', {});
    button.setAttribute('position', {x:0, y: 0, z: .1});
    totem.appendChild(button);

    el.appendChild(totem);
  }
});

AFRAME.registerComponent('mixadora-button', {
  schema: {
  },

  init: function () {
    let el = this.el;

    let button = document.createElement('a-entity');
    button.setAttribute('geometry', {primitive: 'box',
                                     width: .4, height: .4, depth: .05});
//    button.setAttribute('hoverable', {});
    button.setAttribute('material', {color: 'red'});
    button.setAttribute('clickable', {});
    button.classList.add("button");

    button.addEventListener('grab-start', (e) => {
      console.log("Grab-start!");
      let material = button.getAttribute('material');
      material.color = 'green';
      button.setAttribute('material', material);
    });

    button.addEventListener('grab-end', (e) => {
      console.log("Grab-end!");
      let material = button.getAttribute('material');
      material.color = 'brown';
      button.setAttribute('material', material);
    });

//    button.addEventListener('hover-start', (e) => {
//      console.log("Hover start!");
//      let material = button.getAttribute('material');
//      material.color = 'blue';
//      button.setAttribute('material', material);
//    });

//    button.addEventListener('hover-end', (e) => {
//      console.log("Hover end!");
//      let material = button.getAttribute('material');
//      material.color = 'yellow';
//      button.setAttribute('material', material);
//    });

    el.appendChild(button);
  }
});
