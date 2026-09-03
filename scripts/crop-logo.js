/**
 * Utility script to crop whitespace from PNG assets.
 */
const fs = require("fs");
const zlib = require("zlib");

const crcTable = [];
for (let n = 0; n < 256; n++) {
	let c = n;
	for (let k = 0; k < 8; k++) {
		c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	}
	crcTable[n] = c;
}

function makeChunk(type, data) {
	const length = Buffer.alloc(4);
	length.writeUInt32BE(data.length, 0);
	const typeBuf = Buffer.from(type, "ascii");
	const toCrc = Buffer.concat([typeBuf, data]);
	let crc = 0 ^ -1;
	for (let i = 0; i < toCrc.length; i++) {
		crc = (crc >>> 8) ^ crcTable[(crc ^ toCrc[i]) & 0xff];
	}
	crc = (crc ^ -1) >>> 0;
	const crcBuf = Buffer.alloc(4);
	crcBuf.writeUInt32BE(crc, 0);
	return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function cropPng(inputPath, outputPath, options = {}) {
	const buf = fs.readFileSync(inputPath);
	let offset = 8;
	let width = 0;
	let height = 0;
	let bitDepth = 0;
	let colorType = 0;
	const idatChunks = [];

	while (offset < buf.length) {
		const length = buf.readUInt32BE(offset);
		const type = buf.toString("ascii", offset + 4, offset + 8);
		const data = buf.slice(offset + 8, offset + 8 + length);
		if (type === "IHDR") {
			width = data.readUInt32BE(0);
			height = data.readUInt32BE(4);
			bitDepth = data.readUInt8(8);
			colorType = data.readUInt8(9);
		} else if (type === "IDAT") {
			idatChunks.push(data);
		}
		offset += 12 + length;
	}

	if (colorType !== 6 || bitDepth !== 8) {
		return;
	}

	const compressed = Buffer.concat(idatChunks);
	const raw = zlib.inflateSync(compressed);
	const pixels = Buffer.alloc(width * height * 4);

	let rawOffset = 0;
	for (let y = 0; y < height; y++) {
		const filterType = raw[rawOffset++];
		for (let x = 0; x < width; x++) {
			const pxOffset = (y * width + x) * 4;
			const bpp = 4;
			for (let c = 0; c < 4; c++) {
				const rawByte = raw[rawOffset++];
				const a = x > 0 ? pixels[pxOffset - bpp + c] : 0;
				const b = y > 0 ? pixels[((y - 1) * width + x) * 4 + c] : 0;
				const cVal =
					x > 0 && y > 0 ? pixels[((y - 1) * width + (x - 1)) * 4 + c] : 0;
				let val = rawByte;
				if (filterType === 0) val = rawByte;
				else if (filterType === 1) val = (rawByte + a) & 0xff;
				else if (filterType === 2) val = (rawByte + b) & 0xff;
				else if (filterType === 3)
					val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
				else if (filterType === 4) {
					const p = a + b - cVal;
					const pa = Math.abs(p - a);
					const pb = Math.abs(p - b);
					const pc = Math.abs(p - cVal);
					let pr = cVal;
					if (pa <= pb && pa <= pc) pr = a;
					else if (pb <= pc) pr = b;
					val = (rawByte + pr) & 0xff;
				}
				pixels[pxOffset + c] = val;
			}
		}
	}

	let minX = width;
	let minY = height;
	let maxX = 0;
	let maxY = 0;
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

	const pad = options.pad || 4;
	minX = Math.max(0, minX - pad);
	minY = Math.max(0, minY - pad);
	maxX = Math.min(width - 1, maxX + pad);
	maxY = Math.min(height - 1, maxY + pad);

	const newWidth = maxX - minX + 1;
	const newHeight = maxY - minY + 1;

	const newRaw = Buffer.alloc(newHeight * (1 + newWidth * 4));
	let newRawOffset = 0;
	for (let y = minY; y <= maxY; y++) {
		newRaw[newRawOffset++] = 0;
		for (let x = minX; x <= maxX; x++) {
			const srcOffset = (y * width + x) * 4;
			let r = pixels[srcOffset];
			let g = pixels[srcOffset + 1];
			let b = pixels[srcOffset + 2];
			const a = pixels[srcOffset + 3];

			if (options.invertDarkTextToWhite) {
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
	const chunks = [];
	chunks.push(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

	const ihdrData = Buffer.alloc(13);
	ihdrData.writeUInt32BE(newWidth, 0);
	ihdrData.writeUInt32BE(newHeight, 4);
	ihdrData.writeUInt8(8, 8);
	ihdrData.writeUInt8(6, 9);
	ihdrData.writeUInt8(0, 10);
	ihdrData.writeUInt8(0, 11);
	ihdrData.writeUInt8(0, 12);
	chunks.push(makeChunk("IHDR", ihdrData));
	chunks.push(makeChunk("IDAT", newCompressed));
	chunks.push(makeChunk("IEND", Buffer.alloc(0)));

	fs.writeFileSync(outputPath, Buffer.concat(chunks));
}

module.exports = { cropPng };
