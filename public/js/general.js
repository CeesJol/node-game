// Returns if an array contains a number.
function contains(array, n) {
   for (i = 0; i < array.length; i++) {
       if (array[i] === n) return true;
   }

   return false;
}
