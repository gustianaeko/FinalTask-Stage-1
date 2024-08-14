const drawSikuSiku = (alasOrTinggi) => {
  if (alasOrTinggi < 1 || alasOrTinggi > 9) {
    console.log(
      `Alas atau tinggi harus lebih dari 0 dan atau kurang dari 10 (0 < alas < 10)`
    );
    return;
  }

  let count = 0;
  let number = 2;

  for (let i = 1; i <= alasOrTinggi; i++) {
    let temp = "";
    for (let j = 0; j < i; j++) {
      temp += "* ";
    }
    console.log(temp);
  }
};

drawSikuSiku(7);
