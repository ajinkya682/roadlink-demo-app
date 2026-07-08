import QRCodeStyling from 'qr-code-styling';
const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "svg",
  data: "https://roadlink.app/test",
  dotsOptions: { color: "#0B1533", type: "rounded" }
});
qrCode.getRawData("svg").then(buffer => console.log(buffer.toString())).catch(e => console.error("Error", e));
