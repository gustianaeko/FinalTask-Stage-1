const drawSikuSiku = (alasOrTinggi) => {
  if (alasOrTinggi < 1 || alasOrTinggi > 9) {
    console.log(`Alas atau tinggi harus lebih dari 0 dan atau kurang dari 10`);
    return;
  }

  console.log("Alas atau tinggi sesuai rules");
};

drawSikuSiku(0);
