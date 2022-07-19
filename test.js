var arr = [45,23,7];

function ration(arr, share){
    var total = arr.reduce(function(x, y) {
      return x + y;
    });
    return arr.map(function(x) {
      return (x / total) * share;
    });
}

var rationedArr = ration(arr, 3250.00);
console.log(rationedArr)