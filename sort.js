function test(array, i, j) {
  self.postMessage(['test', i, j]);

  return array[i] - array[j];
}

function swap(array, i, j) {
  self.postMessage(['swap', i, j]);

  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function bubbleSort(a) {
  var n = a.length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n - i - 1; j++) {
      if (test(a, j + 1, j) < 0) {
        swap(a, j, j + 1);
      }
    }
  }
}


function cocktailSort(a) {
  var n = a.length;
  var left = 0;
  var right = n - 1;
  while (left < right) {
    var new_right = right - 1;
    for (var i = left; i + 1 <= right; i++) {
      if (test(a, i + 1, i) < 0) {
        swap(a, i + 1, i);
        new_right = i;
      }
    }
    right = new_right;
    var new_left = left + 1;
    for (var i = right; i - 1 >= left; i--)  {
      if (test(a, i, i - 1) < 0) {
        swap(a, i, i - 1);
        new_left = i;
      }
    }
    left = new_left;
  }
}

function combSort(a) {
  var shrink = 1.3;

  var swapped = false;
  var gap = a.length;

  while ((gap > 1) || swapped)
  {
    if (gap > 1) {
      gap = Math.floor(gap / shrink);
    }

    swapped = false;

    for (var i = 0; gap + i < a.length; ++i) {
      if (test(a, i, i + gap) > 0) {
        swap(a, i, i + gap);
        swapped = true;
      }
    }
  }
}

function gnomeSort(a) {
  var n = a.length;
  for (var i = 1; i < n; true) {
    if (test(a, i, i - 1) >= 0) {
      ++i;
    } else {
      swap(a, i, i - 1);
      if (i > 1) {
        --i;
      }
    }
  }
}

function heapSort(a) {
  var n = a.length;
  var i = Math.floor(n / 2);

  while (true) {
    if (i > 0) {
      i--;
    } else {
      n--;
      if (n == 0) return;
      swap(a, 0, n);
    }

    var parent = i;
    var child = i * 2 + 1;

    while (child < n) {
      if (child + 1 < n && test(a, child + 1, child) > 0) {
        child++;
      }

      if (test(a, child, parent) > 0) {
        swap(a, parent, child);
        parent = child;
        child = parent*2+1;
      }
      else {
        break;
      }
    }
  }
}

function insertionSort(a) {
  var n = a.length;
  for (var i = 1; i < n; i++) {
    for (var j = i; j > 0 && test(a, j, j - 1) < 0; j--) {
      swap(a, j, j - 1);
    }
  }
}

function oddEvenSort(a) {
  var n = a.length;
  var sorted = false;
  while (!sorted) {
    sorted = true;
    for (var p = 0; p <= 1; p++) {
      for (var i = p; i + 1 < n; i += 2) {
        if (test(a, i + 1, i) < 0) {
          swap(a, i + 1, i);
          sorted = false;
        }
      }
    }
  }
}

function selectionSort(a) {
  var n = a.length;
  for (var i = 0; i < n - 1; i++) {
    var k = i;
    for (var j = i; j < n; j++) {
      if (test(a, j, k) < 0) {
        k = j;
      }
    }

    swap(a, i, k);
  }
}

function radixLsdSort(a) {
  var n = a.length;
  var bits = Math.ceil(Math.log(n) / Math.log(2));
  var pivot = Math.pow(2, bits) / 2;

  var midpoint = 0; // Midpoint is at start initially(one bucket coming in)

  for (var bit = 0; bit < bits; bit++) {

    // Keep a todo list so we don't get out of order by swapping
    var todo = [];
    for (var i = 0; i < midpoint; i++) {
      todo.push(i);
    }
    for (var i = n-1; i >= midpoint; i--) {
      todo.push(i);
    }
    console.log(midpoint);
    console.log(todo);

    // Put each item into the respective bucket
    var bucketPtrs = [0, n-1];
    for (var t = 0; t < todo.length; t++) {
      var i = todo[t];
      test(a, i, i); // Treat hash as test to be fair for speed comparison
      var value = a[i] - 1;
      var hash = Math.floor(value / Math.pow(2, bit)) % 2;

      var target = bucketPtrs[hash];
      if (i != target) {
        swap(a, i, target);

        // Fix up todo list if we swapped an element
        var fixed = false;
        for (var j = t; j < todo.length; j++) {
          if (todo[j] == target) {
            todo[j] = i;
            fixed = true;
          }
        }
        if (!fixed) {
          console.log("Error: Swapped with element already in sorted list");
          return;
        }
      }

      if (hash == 0) {
        bucketPtrs[hash]++;
      } else {
        bucketPtrs[hash]--;
      }
    }
    midpoint = bucketPtrs[0];
  }

  // Swap the second half to get it in the right order
  var i = midpoint;
  var j = n-1;
  while (i < j) {
    swap(a, i, j);
    i++;
    j--;
  }
}

function radixMsdSort(a, ignoredType, left, right) {
  var n = a.length;
  if (typeof(left) === 'undefined') left = 0;
  if (typeof(right) === 'undefined') right = n - 1;

  if (left >= right) return;

  // Pick a midpoint
  var delta = right - left;
  var bit = Math.floor(Math.log(delta) / Math.log(2));
  var midpoint = left + Math.pow(2, bit);

  // Move everything with the bit set up, clear down
  // Keep a todo list so we don't get out of order by swapping
  var todo = [];
  for (var i = left; i <= right; i++) {
    todo.push(i);
  }

  // Put each item into the respective bucket
  var bucketPtrs = [left, midpoint];
  for (var t = 0; t < todo.length; t++) {
    var i = todo[t];
    test(a, i, i); // Treat hash as test to be fair for speed comparison
    var value = a[i] - 1;
    var hash = 0;
    if (value >= Math.pow(2, bit) + left) {
      hash = 1;
    } else {
      hash = 0;
    }

    var target = bucketPtrs[hash];
    if (i != target) {
      swap(a, i, target);

      // Fix up todo list if we swapped an element
      var fixed = false;
      for (var j = t; j < todo.length; j++) {
        if (todo[j] == target) {
          todo[j] = i;
          fixed = true;
        }
      }
      if (!fixed) {
        console.log("Error: Swapped with element already in sorted list");
        return;
      }
    }

    bucketPtrs[hash]++;
  }

  // Recurse
  if (bit > 0) {
    radixMsdSort(a, ignoredType, left, midpoint-1);
    radixMsdSort(a, ignoredType, midpoint, right);
  }
}

function pivot(aa, type, left, right) {
  if (typeof(left) === 'undefined') left = 0;
  if (typeof(right) === 'undefined') right = aa.length() - 1;
  var p = null;
  if (type === 'random') {
    var p = left + Math.floor((right - left + 1) * Math.random());
  } else if (type === 'first') {
    p = left;
  } else if (type === 'last') {
    p = right;
  } else if (type === 'middle') {
    p = Math.round((left + right) / 2);
  } else {
    throw new TypeError('Invalid p type ' + type);
  }

  return p;
}

function partition(aa, type, left, right) {
  var p = pivot(aa, type, left, right);
  swap(aa, p, right);

  p = left;
  for (var i = left; i < right; i++) {
    if (test(aa, i, right) < 0) {
      if (i != p) {
        swap(aa, i, p);
      }
      p += 1
    }
  }

  swap(aa, right, p);

  return p;
}

function quickSort(aa, type, left, right) {
  var n = aa.length;
  if (typeof(left) === 'undefined') left = 0;
  if (typeof(right) === 'undefined') right = n - 1;

  if (left >= right) return;

  var p = partition(aa, type, left, right);
  quickSort(aa, type, left, p - 1);
  quickSort(aa, type, p + 1, right);
}

self.onmessage = function(event) {
  var sort = eval(event.data[0]);
  sort(event.data[1], event.data[2]);

  console.log(event.data[1]);
};
