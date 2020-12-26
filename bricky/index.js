/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  };


/**
 * Brick
 * 
 *   Adds a magnet component while grabbing
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
    const el = this.el;

    // Add grabbable component, so that you can grab bricks
    el.setAttribute('grabbable', {});

    // Listener for animationcomplete: Remove animations when done
    el.addEventListener('animationcomplete', function(event) {
      el.removeAttribute(event.detail.name);
    });
    
    // Grab starts: add magnet to element
    el.addEventListener('grab-start', function (event) {
      console.log('grab-start');
      el.setAttribute('magnet', {});
    });

    // Grab ends: animate to position if previewing, and remove magnet
    el.addEventListener('grab-end', function (event) {
      console.log('grab-end', el.components['magnet'].previewEl);
      let previewEl = el.components['magnet'].previewEl;
      if (previewEl) {
        let position = previewEl.getAttribute('position');
        let rotation = previewEl.getAttribute('rotation');
        console.log(el.getAttribute('position'), position);
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
      el.removeAttribute('magnet');
    });
  },

  update: function (oldData) {
  },
  
  remove: function () { },
});
   
 /**
  * Magnet
  * 
  *   Elements with this component will get attracted by assembled bricks.
  */
AFRAME.registerComponent('magnet', {
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
    const el = this.el;
    this.previewEl = null;

    // Add collider
    el.setAttribute('aabb-collider', {'objects': '.brick', 'debug': false});

    // Listener for hitstart: start preview (in place where it would be animated to)
    this.hitstartListener = function (event) {
      console.log('hitstart');
      let collidingEl = el.components['aabb-collider']['closestIntersectedEl'];
      if (this.previewEl) {
        // We had a preview, from other collidingEl. Remove it.
        el.sceneEl.removeChild(this.previewEl);
      };
      this.previewEl = this.previewElement(collidingEl);
    }.bind(this);

    // Listener for hitend: finish preview
    this.hitendListener = function (event) {
      console.log('hitend');
      if (this.previewEl) {
        this.el.sceneEl.removeChild(this.previewEl);
        this.previewEl = null;
      };
    }.bind(this);

    el.addEventListener("hitstart", this.hitstartListener);
    el.addEventListener("hitend", this.hitendListener);
  },
  
  update: function (oldData) {
  },
  
  remove: function () {
    // Remove listeners, collider
    this.el.removeEventListener('animationcomplete', this.animationcompleteListener)
    this.el.removeEventListener("hitstart", this.hitstartListener);
    this.el.removeEventListener("hitend", this.hitendListener);

    this.el.removeAttribute('aabb-collider');
  },

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
    newEl.setAttribute('class', 'magnet-preview');
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
