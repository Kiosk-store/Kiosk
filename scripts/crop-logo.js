const fs = require('fs');
const zlib = require('zlib');

function cropPng(inputPath, outputPath, options = {}) {
    const buf = fs.readFileSync(inputPath);
    let offset = 8; // skip signature
    let width = 0, height = 0, bitDepth = 0, colorType = 0;
    const idatChunks = [];

    while (offset < buf.length) {
        const length = buf.readUInt32BE(offset);
        const type = buf.toString('ascii', offset + 4, offset + 8);
        const data = buf.slice(offset + 8, offset + 8 + length);
        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            bitDepth = data.readUInt8(8);
            colorType = data.readUInt8(9);
            console.log(`Original: ${width}x${height}, depth: ${bitDepth}, colorType: ${colorType}`);
        } else if (type === 'IDAT') {
            idatChunks.push(data);
        }
        offset += 12 + length;
    }

    if (colorType !== 6 || bitDepth !== 8) {
        console.error('Only RGBA 8-bit supported directly');
        return;
    }

    const compressed = Buffer.concat(idatChunks);
    const raw = zlib.inflateSync(compressed);
    const stride = width * 4;
    const pixels = Buffer.alloc(width * height * 4);

    // Unfilter scanlines
    let rawOffset = 0;
    for (let y = 0; y < height; y++) {
        const filterType = raw[rawOffset++];
        for (let x = 0; x < width; x++) {
            const pxOffset = (y * width + x) * 4;
            const bpp = 4;
            for (let c = 0; c < 4; c++) {
                const rawByte = raw[rawOffset++];
                let a = x > 0 ? pixels[pxOffset - bpp + c] : 0;
                let b = y > 0 ? pixels[((y - 1) * width + x) * 4 + c] : 0;
                let c_val = (x > 0 && y > 0) ? pixels[((y - 1) * width + (x - 1)) * 4 + c] : 0;
                let val = rawByte;
                if (filterType === 0) val = rawByte;
                else if (filterType === 1) val = (rawByte + a) & 0xff;
                else if (filterType === 2) val = (rawByte + b) & 0xff;
                else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
                else if (filterType === 4) {
                    const p = a + b - c_val;
                    const pa = Math.abs(p - a);
                    const pb = Math.abs(p - b);
                    const pc = Math.abs(p - c_val);
                    let pr;
                    if (pa <= pb && pa <= pc) pr = a;
                    else if (pb <= pc) pr = b;
                    else pr = c_val;
                    val = (rawByte + pr) & 0xff;
                }
                pixels[pxOffset + c] = val;
            }
        }
    }

    // Find bounding box
    let minX = width, minY = height, maxX = 0, maxY = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = pixels[(y * width + x) * 4 + 3];
            if (alpha > 5) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    console.log(`Bounding box: x: [${minX}, ${maxX}], y: [${minY}, ${maxY}]`);
    const pad = options.pad || 4;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(width - 1, maxX + pad);
    maxY = Math.min(height - 1, maxY + pad);

    const newWidth = maxX - minX + 1;
    const newHeight = maxY - minY + 1;
    console.log(`Cropped: ${newWidth}x${newHeight}`);

    // Create new uncompressed scanlines with filter type 0
    const newRaw = Buffer.alloc(newHeight * (1 + newWidth * 4));
    let newRawOffset = 0;
    for (let y = minY; y <= maxY; y++) {
        newRaw[newRawOffset++] = 0; // Filter None
        for (let x = minX; x <= maxX; x++) {
            const srcOffset = (y * width + x) * 4;
            let r = pixels[srcOffset];
            let g = pixels[srcOffset + 1];
            let b = pixels[srcOffset + 2];
            let a = pixels[srcOffset + 3];

            if (options.invertDarkTextToWhite) {
                // If text is dark (low R,G,B) and alpha is high, convert to white for dark backgrounds
                if (r < 60 && g < 60 && b < 60 && a > 10) {
                    r = 255;
                    g = 255;
                    b = 255;
                }
            }

            newRaw[newRawOffset++] = r;
            newRaw[newRawOffset++] = g;
            newRaw[newRawOffset++] = b;
            newRaw[newRawOffset++] = a;
        }
    }

    const newCompressed = zlib.deflateSync(newRaw);

    function crc32(buf) {
        let crc = 0 ^ (-1);
        for (let i = 0; i < buf.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }

    // Build PNG chunks
    const chunks = [];
    // Signature
    chunks.push(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));

    // IHDR
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(newWidth, 0);
    ihdrData.writeUInt32BE(newHeight, 4);
    ihdrData.writeUInt8(8, 8); // bit depth
    ihdrData.writeUInt8(6, 9); // RGBA
    ihdrData.writeUInt8(0, 10);
    ihdrData.writeUInt8(0, 11);
    ihdrData.writeUInt8(0, 12);
    chunks.push(makeChunk('IHDR', ihdrData));

    // IDAT
    chunks.push(makeChunk('IDAT', newCompressed));

    // IEND
    chunks.push(makeChunk('IEND', Buffer.alloc(0)));

    fs.writeFileSync(outputPath, Buffer.concat(chunks));
    console.log(`Saved cropped image to ${outputPath}`);
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
}

function makeChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const toCrc = Buffer.concat([typeBuf, data]);
    let crc = 0 ^ (-1);
    for (let i = 0; i < toCrc.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ toCrc[i]) & 0xFF];
    }
    crc = (crc ^ (-1)) >>> 0;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([length, typeBuf, data, crcBuf]);
}

cropPng('public/KIOSK PNG2.png', 'public/KIOSK PNG2.png');
cropPng('public/KIOSK PNG2.png', 'public/KIOSK PNG2-dark.png', { invertDarkTextToWhite: true });
