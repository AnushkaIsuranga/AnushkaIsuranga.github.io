#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, rmSync } from 'fs'
import { join } from 'path'
import { existsSync } from 'fs'

console.log('\n📊 Build Performance Test\n')
console.log('=' .repeat(60))

// Clean dist folder before test
if (existsSync('dist')) {
  rmSync('dist', { recursive: true })
  console.log('✓ Cleaned previous build\n')
}

// Measure build time
const startTime = performance.now()

try {
  console.log('🔨 Building project...\n')
  
  // Run build with timing
  execSync('vite build', { stdio: 'inherit' })
  
  const endTime = performance.now()
  const buildTime = ((endTime - startTime) / 1000).toFixed(2)
  
  console.log('\n' + '='.repeat(60))
  console.log(`✓ Build completed in ${buildTime}s`)
  console.log('='.repeat(60) + '\n')
  
  // Analyze output sizes
  console.log('📦 Output Analysis:\n')
  
  const distPath = 'dist'
  const assetsPath = join(distPath, 'assets')
  
  try {
    const stats = execSync(`du -sh ${distPath} ${assetsPath}`, { encoding: 'utf-8' })
    console.log(stats)
  } catch (e) {
    // Fallback for Windows
    if (process.platform === 'win32') {
      console.log('📁 Running on Windows - use built-in analysis:\n')
      const output = execSync(`powershell -Command "Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name='TotalSize';Expression={'{0:N0} bytes' -f \\$_.Sum}}"`, { encoding: 'utf-8' })
      console.log(output)
    }
  }
  
  // Detailed file analysis
  console.log('\n📋 Detailed File Breakdown:\n')
  try {
    let output
    if (process.platform === 'win32') {
      output = execSync(
        `powershell -Command "Get-ChildItem -Path dist/assets -File | Sort-Object Length -Descending | ForEach-Object { '{0:N0} KB - {1}' -f ([Math]::Round(\\$_.Length / 1KB, 2)), \\$_.Name }"`,
        { encoding: 'utf-8' }
      )
    } else {
      output = execSync('ls -lhS dist/assets | tail -n +2 | awk \'{ print $5 " - " $9 }\'', { encoding: 'utf-8' })
    }
    console.log(output)
  } catch (e) {
    console.log('(File breakdown unavailable)\n')
  }
  
  console.log('\n✅ Build performance test complete!\n')
  console.log('💡 Tips:')
  console.log('   • Use "npm run build:analyze" for detailed bundle analysis')
  console.log('   • Check vite.config.js for build optimization settings')
  console.log('   • Monitor JavaScript bundle size trends\n')
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message)
  process.exit(1)
}
