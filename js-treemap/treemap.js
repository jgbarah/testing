// treemap.js

let calls = 0;
// Get a position dimension given a length dimension
let pos_dim = {'depth': 'z', 'width': 'x'};
let colors = ['blue', 'green', 'yellow', 'brown', 'black', 'orange',
              'magenta', 'grey', 'cyan', 'azure', 'beige', 'blueviolet',
              'coral', 'crimson', 'darkblue', 'darkgrey', 'orchid',
              'olive', 'navy', 'palegreen'];
const items_A = [
  {id: 'A', value: 3},
  {id: 'B', value: 5},
  {id: 'C', value: 1},
  {id: 'D', value: 6},
  {id: 'E', value: 4},
  {id: 'F', value: 3},
  {id: 'G', value: 2},
  {id: 'H', value: 1}
];

const items_B = [
  {id: 'I', value: 4},
  {id: 'J', value: 3},
  {id: 'K', value: 1},
  {id: 'L', value: 7}
];
const items_C = items_A.concat(items_B);

//items = [{id: 'A', value: 3}, {id: 'B', value: 5}];
//items = [{id: 'A', value: 3}, {id: 'B', value: 5}, {id: 'C', value: 1}];
//items = [{id: 'A', value: 3}, {id: 'B', value: 5}, {id: 'C', value: 1}, {id: 'D', value: 6},];

const rectangle_A = {'depth': 10, 'width': 20, 'x': -9, 'z': -10};
const rectangle_B = {'depth': 20, 'width': 10, 'x': 8, 'z': -10};
const rectangle_C = {'depth': 6, 'width': 8, 'x': -9, 'z': 5};
const rectangle_D = {'depth': 8, 'width': 6, 'x': 8, 'z': 5};
const rectangle_E = {'depth': 6, 'width': 8, 'x': -9, 'z': 15};
const rectangle_F = {'depth': 8, 'width': 6, 'x': 8, 'z': 15};

// Compute some parameters for a rectangle
// These parameters refer to the longest and shortest dimension:
//  long_dim, short_dim: depth or width
//  long, short: lenght of long and short sides
function parameters (rectangle) {
  // length of longest dimenstion of the rectangle
  var params = {}
  let longest = Math.max(rectangle['depth'], rectangle['width']);
  if (longest == rectangle['depth']) {
    params['long_dim'] = 'depth';
    params['short_dim'] = 'width';
  } else {
    params['long_dim'] = 'width';
    params['short_dim'] = 'depth';
  };
  params['long'] = longest;
  params['short'] = rectangle[params['short_dim']];
  return params
}

// Get the sum of all the values (numbers) in an array
function sum_array(values) {
  return values.reduce(function(acc, a) { return acc + a; }, 0);
};

// Split total, proportionally, according to values in sizes array
function split_proportional(total, sizes) {
  // sum of all sizes
  let sum_sizes = sum_array(sizes);
  // ratio to convert a size in a split (part of total)
  let ratio = total / sum_sizes;
  // sizes reduced to fit total
  return sizes.map(function(a) { return ratio * a});
}

// Naive algorithm for splitting a rectangle in rectangles
// Naive algo is too naive: just take the longest dimension of rectangle,
// split it proportionally to the areas (value of each item), and produce a set of
// adjacent rectangles, thus proportional to the areas.

function naive_algo (rectangle, origin, items) {
  let rect_params = parameters(rectangle);
  let values = items.map(function(item) {return item.value;});
  let lengths = split_proportional(rect_params['long'], values);

  let long_dim = rect_params['long_dim'];
  let short_dim = rect_params['short_dim'];
  // The position in the splitted dimension
  let current_pos = origin[pos_dim[long_dim]];
  console.log("XXX", origin, long_dim, pos_dim[long_dim], origin[pos_dim[long_dim]]);
  let rectangles = lengths.map(function(a, i) {
    pos_long_dim = current_pos;
    current_pos += a;
    return {
      [long_dim]: a,
      [short_dim]: rect_params['short'],
      [pos_dim[long_dim]]: pos_long_dim,
      [pos_dim[short_dim]]: origin[pos_dim[short_dim]],
      'id': items[i].id
      };
    });
  console.log("Naive algo rectangles:", rectangles);
  return rectangles;
}

// Compute the largest element in an array, and its index
// Returns [element, index]
// Assumes list is not empty
function max_value(values) {
  let largest = values[0];
  let largest_i = 0;

  for (let i = 0; i < values.length; i++) {
    if (largest < values[i] ) {
        largest = values[i];
        largest_i = i;
    }
  };
  return [largest, largest_i];
}

// Split list of areas in three lists, given a pivot area
// Returns pivot, a1_len, a2_len, a3_len
// pivot: index of pivot item
// an_len: length of list an (n being 1, 2, or 3)
// pivot is the largest element in areas
// a1 is all elements in areas before the pivot
// a2 is the next elements in areas after pivot, so that
// pivot is close to square (width of a2 is the same as of a2)
// a3 is the other elements in areas to the right of a2
function split_pivot_largest(depth, areas) {
  var pivot, a1_len, a2_len, a3_len;
  let [largest, largest_i] = max_value(areas);

  pivot = largest_i;
  a1_len = pivot;

  if (areas.length == pivot + 1) {
    // No items to the right of pivot. a2, a3 empty
    return [pivot, a1_len, 0, 0];
  };

  if (areas.length == pivot + 2) {
    // Only one item to the right of pivot. It is a2. a3 is empty.
    return [pivot, a1_len, 1, 0];
  };

  // More than one item to the right of pivot.
  // Compute a2 so that pivot can be as square as possible
  let pivot_area = areas[pivot];
  let a2_width_ideal = Math.sqrt(pivot_area);
  let a2_area_ideal = a2_width_ideal * depth - pivot_area;

  let a2_area = 0;
  let i = pivot + 1;
  while (a2_area < a2_area_ideal && i < areas.length ) {
    var a2_area_last = a2_area;
    a2_area += areas[i];
    i ++;
  };
  // There are two candidates to be the area closest to the ideal area:
  // the last area computed (long), and the one that was conputed before it (short),
  // providing the last computed is not the next to the pivot (in that case,
  // the last computed is the next to the pivot, and therefore it needs to be the
  // first in a3.
  if (Math.abs(a2_area - a2_area_ideal) < Math.abs(a2_area_last - a2_area_ideal)) {
    var a3_first = i;
  } else if (i-1 > pivot) {
    var a3_first = i-1;
  } else {
    var a3_first = i;
  };

  a2_len = a3_first - pivot - 1;
  a3_len = areas.length - a3_first

  return [pivot, a1_len, a2_len, a3_len];
}

// Compute widths for one of the three regions of the pivot algorithm
// depth: depth of the rectangle
// areas: areas (values) in the region
function compute_width(depth, areas) {
  if (areas.length == 0) {
    return 0;
  } else {
    area = sum_array(areas);
    return area / depth;
  };
}

// Build rectangle object, based on its parameters
function build_rect(rect_params, long, short, long_pos, short_pos) {
  return {
    [rect_params['long_dim']]: long,
    [rect_params['short_dim']]: short,
    [pos_dim[rect_params['long_dim']]]: long_pos,
    [pos_dim[rect_params['short_dim']]]: short_pos
  };
}

// Produce rectangles following the pivot algorithm
// http://cvs.cs.umd.edu/~ben/papers/Shneiderman2001Ordered.pdf
function pivot_algo (rectangle, origin, items) {
  console.log("Length of items to rectangulize: ", items.length);
// Control to avoid excesive recursion
//  calls ++;
//  if (calls > 20) {
//    console.log("20 calls reached, finishing");
//    return;
//  };
  if (items.length <= 2) {
    // Only one or two items, we cannot apply pivot, apply naive
    return naive_algo(rectangle, origin, items);
  };
  // Compute parameters (dimensions for the short and long sides)
  // of the enclosing rectangle
  let rect_params = parameters(rectangle);
  let long_dim = rect_params['long_dim'];
  let short_dim = rect_params['short_dim'];
  let long_pos = pos_dim[rect_params['long_dim']];
  let short_pos = pos_dim[rect_params['short_dim']];

  // Build an array with values in items
  let values = items.map(function(item) {return item.value;});
  // Build an array with areas proportional to values, fitting the rectangle
  let areas = split_proportional(rect_params['long']*rect_params['short'], values);

  // Compute pivot, and number of elements (length) for the three zones
  let [pivot, a1_len, a2_len, a3_len] = split_pivot_largest(rect_params['short'], areas);
//  console.log("Pivot algo results:", pivot, items[pivot], items.slice(0, a1_len),
//              items.slice(pivot+1, pivot+1+a2_len),
//              items.slice(items.length-a3_len));

  let zones = [];

  // Compute data for zone 1
  let a1_width = 0;
  if (a1_len > 0) {
    let a1_slice = [0, a1_len];
    a1_width = compute_width(rect_params['short'], areas.slice(...a1_slice));
    let a1_depth = rect_params['short'];
    let a1_origin = [origin[long_pos], origin[short_pos]];
    let a1_rect = build_rect(rect_params, a1_width, a1_depth, ...a1_origin);
    let zone1 = {rect: a1_rect, items: items.slice(...a1_slice)};
    zones.push(zone1);
    console.log("Zone1: ", zone1);
  };

  // Compute data for zone 2 and pivot
  let a2_slice = [pivot+1, pivot+a2_len+1];
  let a2pivot_slice = [pivot, pivot+a2_len+1];
  let a2_width = compute_width(rect_params['short'], areas.slice(...a2pivot_slice));
  let pivot_depth = areas[pivot]/a2_width;
  let a2_depth = rect_params['short'] - pivot_depth;
  let pivot_origin = [origin[long_pos]+a1_width, origin[short_pos]+a2_depth];
  let a2_origin = [origin[long_pos]+a1_width, origin[short_pos]];
  let pivot_rect = build_rect(rect_params, a2_width, pivot_depth, ...pivot_origin);

  if (a2_len > 0) {
    let a2_rect = build_rect(rect_params, a2_width, a2_depth, ...a2_origin);
    zone2 = {rect: a2_rect, items: items.slice(...a2_slice)}
    zones.push(zone2);
    console.log("Zone2: ", zone2);
  };

  // Compute data for zone 3
  let a3_width = 0;
  if (a3_len > 0) {
    let a3_slice = [items.length-a3_len];
    a3_width = compute_width(rect_params['short'], areas.slice(...a3_slice));
    let a3_depth = rect_params['short'];
    let a3_origin = [origin[long_pos]+a1_width+a2_width, origin[short_pos]];
    let a3_rect = build_rect(rect_params, a3_width, a3_depth, ...a3_origin);
    let zone3 = {rect: a3_rect, items: items.slice(...a3_slice)};
    zones.push(zone3);
    console.log("Zone3: ", zone3);
  };

  // Get subrects, by recursively running the algorithm in all the zones
  let subrects = [pivot_rect]
  for (const zone of zones) {
    let rects = pivot_algo (zone.rect, {x: zone.rect.x, z: zone.rect.z}, zone.items);
    subrects = subrects.concat(rects);
  };
  return subrects;
}

// Add A-Frame coordinates (only x, z)
// Regular coordinates consider 0,0 in the bottom left corner of a rectangle
// A-Frame coordinates consder 0,0 in the center of the enclosing rectangle
// depth, width are dimensions of the enclosing rectangle
function aframe_coord(rectangle, parent) {
  let pwidth = parent.getAttribute('width');
  if (pwidth) {
    rectangle.aframe_x = rectangle.x + rectangle.width / 2 - pwidth / 2;
  } else {
    rectangle.aframe_x = rectangle.x;
  };
  let pdepth = parent.getAttribute('depth');
  if (pdepth) {
    rectangle.aframe_z = -1 * (rectangle.z + rectangle.depth / 2 - pdepth / 2);
  } else {
    rectangle.aframe_z = rectangle.z;
  };
}

// Show a A-Frame a-box, given its parameters
// element: DOM element to insert the box
// rectangle: rectangle to use as base for the box (X, Z coordinates)
// height: height of the box
// y: Y position of the box
// color: color
function show_box(element, rectangle, height, y, color) {
  aframe_coord(rectangle, element);
  let box = document.createElement('a-box');
  box.setAttribute('position', {x: rectangle.aframe_x, y: y, z: rectangle.aframe_z});
  box.setAttribute('depth', rectangle.depth);
  box.setAttribute('width', rectangle.width);
  box.setAttribute('height', height);
  box.setAttribute('color', color);
  box.setAttribute('id', rectangle.id);
  element.appendChild(box);
  return box;
};

// Show a block, given the rectangle for it, the items to show,
// and the algorithm to use to split the rectangle
function show_block(scene, rectangle, items, algo = pivot_algo) {
  let height = 1;
  let y = -5;

  base = show_box(scene, rectangle, height, y, 'red');
  child_rectangles = algo(rectangle, {x:0, z:0}, items);
  let current_col = 0;
  child_rectangles.map(function (rect) {
    current_col = (current_col + 1) % colors.length;
    show_box(base, rect, height, 1, colors[current_col]);
  });
};

window.addEventListener('DOMContentLoaded', function (event) {
  let scene = document.querySelector('a-scene');
  show_block(scene, rectangle_A, items_A);
  show_block(scene, rectangle_B, items_A);
  show_block(scene, rectangle_C, items_B);
  show_block(scene, rectangle_D, items_B);
  show_block(scene, rectangle_E, items_C);
  show_block(scene, rectangle_F, items_C, algo=naive_algo);
});
