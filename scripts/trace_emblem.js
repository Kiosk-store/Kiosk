const sharp = require('sharp');
const fs = require('fs');

async function trace() {
  const { data, info } = await sharp('public/kiosk_logo_transparent.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const { width, height } = info;
  
  function isSolid(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    return data[(y * width + x) * 4 + 3] > 100;
  }
  
  // Connected components
  const labels = new Int32Array(width * height).fill(-1);
  let currentLabel = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!isSolid(x, y) || labels[idx] !== -1) continue;
      
      const q = [[x, y]];
      labels[idx] = currentLabel;
      let count = 0;
      
      while (q.length > 0) {
        const [cx, cy] = q.pop();
        count++;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (isSolid(nx, ny) && labels[ny * width + nx] === -1) {
            labels[ny * width + nx] = currentLabel;
            q.push([nx, ny]);
          }
        }
      }
      if (count > 50) {
        currentLabel++;
      }
    }
  }
  
  console.log('Found components:', currentLabel);
  
  const contours = [];
  for (let l = 0; l < currentLabel; l++) {
    let startX = -1, startY = -1;
    for (let y = 0; y < height && startX === -1; y++) {
      for (let x = 0; x < width; x++) {
        if (labels[y * width + x] === l) {
          startX = x; startY = y;
          break;
        }
      }
    }
    
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    let cx = startX, cy = startY;
    let dir = 0;
    const path = [];
    
    let steps = 0;
    do {
      path.push([cx, cy]);
      dir = (dir + 3) % 4;
      for (let i = 0; i < 4; i++) {
        const nd = (dir + i) % 4;
        const nx = cx + dx[nd], ny = cy + dy[nd];
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && labels[ny * width + nx] === l) {
          cx = nx;
          cy = ny;
          dir = nd;
          break;
        }
      }
      steps++;
    } while (!(cx === startX && cy === startY) && steps < 1500);
    
    contours.push(path);
  }
  
  function rdp(points, epsilon) {
    if (points.length <= 2) return points;
    let maxDist = 0, index = 0;
    const [x1, y1] = points[0];
    const [x2, y2] = points[points.length - 1];
    
    for (let i = 1; i < points.length - 1; i++) {
      const [x0, y0] = points[i];
      const dist = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1)**2 + (x2 - x1)**2);
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    
    if (maxDist > epsilon) {
      const left = rdp(points.slice(0, index + 1), epsilon);
      const right = rdp(points.slice(index), epsilon);
      return left.slice(0, -1).concat(right);
    } else {
      return [points[0], points[points.length - 1]];
    }
  }
  
  const simplified = contours.map(c => rdp(c, 1.2));
  
  const svgPaths = simplified.map(pts => {
    return 'M ' + pts.map(p => p[0] + ' ' + p[1]).join(' L ') + ' Z';
  });
  
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="#2563eb">`,
    ...svgPaths.map(d => `  <path d="${d}" />`),
    `</svg>`
  ].join('\n');
  
  fs.writeFileSync('public/kiosk_emblem.svg', svg);
  console.log('Successfully generated public/kiosk_emblem.svg');
}

trace();
