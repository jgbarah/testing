/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  };

/**
 * Brick
 */
AFRAME.registerComponent('brick', {
  schema: {
  },
  
  /**
    * Set if component needs multiple instancing.
    */
  multiple: false,
  
  /**
    * Called once when component is attached. Generally for initial setup.
    */
  init: function () {
    const me = this;
    const el = this.el;
    let collidingEl = null;
    let previewEl = null;

    // Remove animations when done
    el.addEventListener('animationcomplete', function(event) {
      el.removeAttribute(event.detail.name);
    });

    // Grab ends: animate to position if previewing
    el.addEventListener("grab-end", function (event) {
      if (previewEl) {
        let position = previewEl.getAttribute('position');
        let rotation = previewEl.getAttribute('rotation');
        el.setAttribute('animation__rotation',
                        {'property': 'rotation',
                         'to': rotation,
                         'dur': 200});
        el.setAttribute('animation__position', 
                        {'property': 'position',
                         'to': {x: position.x, y: position.y, z: position.z},
                         'dur': 200});
        el.sceneEl.removeChild(previewEl);
        previewEl = false;
      }
    });

    // Hit starts: start preview (in place where it would be animated to)
    el.addEventListener("hitstart", function (event) {
        collidingEl = el.components['aabb-collider']['closestIntersectedEl'];
        previewEl = me.previewElement(collidingEl);
    });
    // Hit ends: finish preview
    el.addEventListener("hitend", function (event) {
      if (previewEl) {
        el.sceneEl.removeChild(previewEl);
        previewEl = null;
      };
    });
  },
  
  update: function (oldData) {
  },
  
  remove: function () { },

  /*
   * Find the place (position and rotation) where preview should appear,
   * on top or below bottom of collidingEl
   */
  previewPlace: function (collidingEl) {
    const el = this.el;
    let collidingPos = collidingEl.getAttribute('position');
    let collidingHeight = collidingEl.getAttribute('geometry')['height'];
    let place = {};

    if (this.el.object3D.position.y > collidingPos.y) {
      y = collidingPos.y + collidingHeight;
    } else {
      y = collidingPos.y - collidingHeight;
    }
    place.position = {x: collidingPos.x, y: y, z: collidingPos.z};

    place.rotation = {x: 0, y: 0, z: 0};
    if (el.hasAttribute('rotation')) {
      place.rotation = collidingEl.getAttribute('rotation');
    };
    return place;
  },

  /*
   * Preview element in its place, on top or below bottom of collidingEl
   */
  previewElement: function (collidingEl) {
    const el = this.el;
    
    color = this.el.getAttribute('material')['color'];
    let y = null;
    let rotation = {x: 0, y: 0, z: 0}

    let newEl = document.createElement('a-entity');
    newEl.setAttribute('geometry', {'primitive': 'box',
                                    'width': 0.5, 'height': 0.5, 'depth': 0.5});
    newEl.setAttribute('material', {'color': color, 'wireframe': true});
    let place = this.previewPlace(collidingEl);
    newEl.setAttribute('position', place.position);
    newEl.setAttribute('rotation', place.rotation);
    el.sceneEl.appendChild(newEl);
    return newEl;
  },

});
