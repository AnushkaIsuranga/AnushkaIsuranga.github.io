#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

console.log('\n📊 Bundle Analysis Report\n')
console.log('='.repeat(70))

const assetsPath = 'dist/assets'
let totalSize = 0
const files = []

try {
  const assetFiles = readdirSync(assetsPath)
  
  for (const file of assetFiles) {
    const filePath = join(assetsPath, file)
    const stats = statSync(filePath)
    const sizeKB = (stats.size / 1024).toFixed(2)
    totalSize += stats.size
    
    files.push({
      name: file,
      size: stats.size,
      sizeKB: parseFloat(sizeKB),
    })
  }
} catch (error) {
  console.error('Error reading assets:', error.message)
  process.exit(1)
}

// Sort by size (largest first)
files.sort((a, b) => b.size - a.size)

console.log('\n📦 Asset Files (sorted by size):\n')
console.log('File Name'.padEnd(40) + 'Size'.padEnd(15) + '%')
console.log('-'.repeat(70))

for (const file of files) {
  const percentage = ((file.size / totalSize) * 100).toFixed(1)
  const sizeStr = `${file.sizeKB} KB`.padEnd(15)
  console.log(file.name.padEnd(40) + sizeStr + `${percentage}%`)
}

console.log('-'.repeat(70))
const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)
console.log(`Total Size: ${totalSizeMB} MB (${(totalSize / 1024).toFixed(2)} KB)\n`)

// Analysis
console.log('📈 Analysis:\n')

const jsFiles = files.filter(f => f.name.endsWith('.js'))
const cssFiles = files.filter(f => f.name.endsWith('.css'))
const imageFiles = files.filter(f => /\.(png|jpg|webp|svg)$/i.test(f.name))

const jsSize = jsFiles.reduce((sum, f) => sum + f.size, 0) / 1024
const cssSize = cssFiles.reduce((sum, f) => sum + f.size, 0) / 1024
const imageSize = imageFiles.reduce((sum, f) => sum + f.size, 0) / 1024

console.log(`JavaScript: ${jsSize.toFixed(2)} KB (${((jsSize * 1024 / totalSize) * 100).toFixed(1)}%)`)
console.log(`CSS: ${cssSize.toFixed(2)} KB (${((cssSize * 1024 / totalSize) * 100).toFixed(1)}%)`)
console.log(`Images: ${imageSize.toFixed(2)} KB (${((imageSize * 1024 / totalSize) * 100).toFixed(1)}%)\n`)

// Recommendations
console.log('💡 Recommendations:\n')

if (jsSize > 150) {
  console.log('  ⚠️  Large JavaScript bundle detected')
  console.log('     → Consider code splitting with dynamic imports')
  console.log('     → Remove unused dependencies')
}

if (imageSize > 200) {
  console.log('  ⚠️  Large images detected')
  console.log('     → Use optimized formats (WebP)')
  console.log('     → Consider responsive images')
}

if (files.some(f => f.sizeKB > 100)) {
  console.log('  ⚠️  Files over 100 KB found')
  console.log('     → Enable gzip compression')
  console.log('     → Split large chunks')
}

console.log('\n✅ Analysis complete!\n')
