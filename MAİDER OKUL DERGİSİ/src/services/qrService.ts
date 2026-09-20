import QRCode from 'qrcode';

export async function generateQrCode(url: string, colorHex: string = '#0F172A'): Promise<string> {
  if (!url || !url.trim()) return '';
  try {
    const dataUrl = await QRCode.toDataURL(url.trim(), {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 400,
      color: {
        dark: colorHex || '#0F172A',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Code generation error:', err);
    return '';
  }
}
