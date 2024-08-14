const hitungVoucher = (voucherDiskon, uangBelanja) => {
  let biayaHarusDibayar = uangBelanja;
  let kembalian = 0;
  if (voucherDiskon === "DumbWaysJos") {
    const diskon = 20_000;
    if (uangBelanja >= 50_000) {
      biayaHarusDibayar = biayaHarusDibayar - diskon;
      kembalian = uangBelanja - biayaHarusDibayar;
    }

    console.log(`======================================
    Uang yang harus dibayar : ${biayaHarusDibayar}
    Diskon : ${diskon}
    Kembalian : ${kembalian}
======================================
    `);
  } else if (voucherDiskon === "DumbWaysMantap") {
    const diskon = 40_000;
    if (uangBelanja >= 80_000) {
      biayaHarusDibayar = biayaHarusDibayar - diskon;
      kembalian = uangBelanja - biayaHarusDibayar;
    }

    console.log(`======================================
    Uang yang harus dibayar : ${biayaHarusDibayar}
    Diskon : ${diskon}
    Kembalian : ${kembalian}
======================================
    `);
  }
};

hitungVoucher("DumbWaysJos", 100_000);
hitungVoucher("DumbWaysMantap", 100_000);
