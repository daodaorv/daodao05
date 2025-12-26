type PlaceholderOptions = {
  width?: number
  height?: number
  background?: string
  color?: string
  fontSize?: number
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const createPlaceholderDataUrl = (text: string, options: PlaceholderOptions = {}) => {
  const width = options.width ?? 300
  const height = options.height ?? 200
  const background = options.background ?? '#f2f4f7'
  const color = options.color ?? '#8c8c8c'
  const fontSize = options.fontSize ?? Math.max(12, Math.round(Math.min(width, height) / 8))

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${background}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${color}" font-size="${fontSize}"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif">${escapeXml(text)}</text>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
