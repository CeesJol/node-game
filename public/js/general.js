// Returns if an array contains a number.
function contains(array, n) {
   for (i = 0; i < array.length; i++) {
       if (array[i] === n) return true;
   }

   return false;
}

// Insertion sort algorithm
// NOTE 1: uses "size" attribute to sort
// NOTE 2: sorts from high to low, since we want a highscore
function insertionSort (items) {
  // Create a new list, and the store the items in it
  var list = [];
  for (var item of items)
    list.push(item);

  // Edge case if the list is empty
  if (!list) return list;

  // Loop over all elements
  for (var i = 0; i < list.length; i++) {
    // Store this element
    var obj = list[i];

    // Shift each element, that is smaller than the given element, one to the right
    for (var j = i - 1; j > -1 && list[j].size < obj.size; j--)
      list[j + 1] = list[j];

    // Place the unsorted element to the correct position
    list[j + 1] = obj;
  }

  return list;
}
