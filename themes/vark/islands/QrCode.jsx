/* @aardvark-island {"urlProps": ["image"], "imageProps": ["image"]} */
import { forwardRef } from 'react';
import { QRCode as GfazioliQRCode } from '@gfazioli/mantine-qr-code';
import './QrCode.css';

// The island behind the built-in {% qrcode %} tag (qrcode.md).
// A Community Component wrapping @gfazioli/mantine-qr-code's <QRCode> — a customizable QR
// code. The vendor's exported name is `QRCode`; our island/tag use the friendlier `QrCode`
// (registry key `QrCode`, tag {% qrcode %}). The encoded data is the required `value` string;
// every other prop (size, color, background, dotStyle, cornerStyle, image, imageRadius,
// errorCorrectionLevel, …) flows straight through via {...rest}.
//
// forwardRef so `attr={…}` reaches the rendered root DOM node.
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const QrCode = forwardRef(function QrCode({ value = '', ...rest }, ref) {
  return <GfazioliQRCode ref={ref} value={value} {...rest} />;
});

export default QrCode;
