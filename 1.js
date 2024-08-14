const drawSikuSiku = (alasOrTinggi) => {
  if (alasOrTinggi < 1 || alasOrTinggi > 9) {
    console.log(
      `Alas atau tinggi harus lebih dari 0 dan atau kurang dari 10 (0 < alas/tinggi < 10)`
    );
    return;
  }

  let number = 2;

  for (let i = 1; i <= alasOrTinggi; i++) {
    let temp = "";
    for (let j = 0; j < i; j++) {
      temp += "";

      while (true) {
        let isPrime = true;

        for (let k = 2; k < number; k++) {
          if (number % k === 0) {
            isPrime = false;
            break;
          }
        }

        if (isPrime) {
          temp += `${number} `;
          number++;
          break;
        }

        number++;
      }
    }
    console.log(temp);
  }
};

drawSikuSiku(7);
