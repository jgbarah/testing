
AFRAME.registerComponent('cubes', {
  schema: {
    side: {
      type: 'number',
      default: 1
    },
    height: {
      type: 'number',
      default: 1
    }
  },
  multiple: false,

  init: function () {
    let data = this.data;
    let el = this.el;

//    el.setAttribute('geometry-merger', {preserveOriginal: false});

    this.geometry = new THREE.Geometry();
    this.mesh = new THREE.Mesh(this.geometry);
    this.el.setObject3D('mesh', this.mesh);
    for (let x=0; x <= data.side; x++) {
      for (let z=0; z <= data.side; z++) {
//        let box = document.createElement('a-entity');
//        box.setAttribute('geometry', {
//          primitive: 'box',
//          buffer: false,
//          depth: 1,
//          width: 1,
//          height: Math.random() * data.height
//          });
//        box.setAttribute('position', {x: (x - data.side/2) * 1.5, y: 0,
//                                      z: (z - data.side/2) * 1.5});
//        el.appendChild(box);
        let material = new THREE.MeshBasicMaterial({color: "blue"});
		    let geometry = new THREE.BoxGeometry(1, Math.random() * data.height, 1);
		    let box = new THREE.Mesh(geometry, material);
		    box.position.x = (x - data.side/2) * 1.5;
		    box.position.y = 0;
        box.position.z = (z - data.side/2) * 1.5;
        console.log("Position", box.position);
		    this.el.setObject3D("mesh"+x+"_"+z, box);
        console.log("Box:", box);
        console.log(this.el);
//        console.log("Box.object3D:", typeof box.object3D, box.object3D);
//        console.log("box.getObject3D('mesh'):", box.getObject3D('mesh'));
      };
    };
    console.log(el.childNodes.length);
    console.log(el);
  }
});
