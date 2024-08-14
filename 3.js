const arrX = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];

const bubbleSort = (arr) => {
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);

  return arr;
};

const result = (arr) => {
  const arrResult = bubbleSort(arr);
  let arrGenap = [];
  let arrGanjil = [];
  for (let i = 0; i < arrResult.length; i++) {
    if (arrResult[i] % 2 === 0) {
      arrGenap.push(arrResult[i]);
    } else if (arrResult[i] % 2 === 1) {
      arrGanjil.push(arrResult[i]);
    }
  }

  console.log(`
Array : ${arrResult.join(", ")}
Ganjil : ${arrGanjil.join(", ")}
Genap : ${arrGenap.join(", ")}`);
};

result(arrX);
