#!/usr/bin/env node

import { spawn, execSync } from 'child_process'
import { existsSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = import.meta.url.replace('file://', '').split('/').slice(0, -1).join('/')

const isDist = process.argv.includes('--dist')
const devPort = 5173
const url = `http://localhost:${devPort}`

console.log('\n🚀 Lighthouse Performance Testing\n')
console.log('='.repeat(70))

// Check if lighthouse is installed
try {
  execSync('npm list lighthouse', { stdio: 'ignore' })
} catch (e) {
  console.log('\n📦 Installing Lighthouse...')
  try {
    execSync('npm install --save-dev lighthouse', { stdio: 'inherit' })
  } catch (err) {
    console.error('❌ Failed to install Lighthouse')
    process.exit(1)
  }
}

// Start dev or dist server
let server
const startServer = () => {
  return new Promise((resolve, reject) => {
    if (isDist) {
      console.log('\n🔨 Building production bundle...')
      try {
        execSync('vite build', { stdio: 'inherit' })
        console.log('\n📂 Serving production build on port 5173...')
        server = spawn('npx', ['vite', 'preview', '--port', '5173'], {
          stdio: 'pipe',
          cwd: process.cwd(),
          shell: true,
        })
      } catch (e) {
        console.error('❌ Build failed')
        reject(e)
        return
      }
    } else {
      console.log(`\n🔨 Starting dev server on port ${devPort}...\n`)
      server = spawn('npx', ['vite'], {
        stdio: 'pipe',
        cwd: process.cwd(),
        shell: true,
      })
    }

    // Give server time to start
    setTimeout(() => resolve(), 3000)
  })
}

const runLighthouse = async () => {
  try {
    // Dynamic import for lighthouse
    const lighthouseModule = await import('lighthouse')
    const chromeLauncherModule = await import('chrome-launcher')
    const lighthouse = lighthouseModule.default ?? lighthouseModule.lighthouse ?? lighthouseModule
    const chromeLauncher = chromeLauncherModule.default ?? chromeLauncherModule

    console.log(`\n🔍 Running Lighthouse tests on ${url}...\n`)

    let chrome
    try {
      chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] })

      const options = {
        logLevel: 'info',
        output: ['json', 'html'],
        port: chrome.port,
        emulatedFormFactor: 'mobile',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      }

      const runnerResult = await lighthouse(url, options)

      // Generate report filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
      const reportPath = `lighthouse-report-${timestamp}`

      // Save HTML report
      const json = JSON.parse(runnerResult.report[0])
      const html = runnerResult.report[1]
      writeFileSync(`${reportPath}.html`, html)

      // Parse JSON for metrics
      const scores = json.categories

      console.log('\n' + '='.repeat(70))
      console.log('📊 Lighthouse Scores\n')

      const categories = [
        { name: 'Performance', key: 'performance', color: '🔴' },
        { name: 'Accessibility', key: 'accessibility', color: '🟡' },
        { name: 'Best Practices', key: 'best-practices', color: '🟢' },
        { name: 'SEO', key: 'seo', color: '🟢' },
      ]

      for (const cat of categories) {
        const score = Math.round(scores[cat.key].score * 100)
        const bar = '█'.repeat(Math.floor(score / 5)) + '░'.repeat(20 - Math.floor(score / 5))
        const emoji = score >= 90 ? '✅' : score >= 50 ? '⚠️ ' : '❌'
        console.log(`${emoji} ${cat.name.padEnd(20)} ${score.toString().padEnd(3)}/100 [${bar}]`)
      }

      console.log('\n' + '='.repeat(70))
      console.log('\n📈 Key Metrics:\n')

      const metrics = json.audits

      if (metrics['first-contentful-paint']) {
        const fcp = (metrics['first-contentful-paint'].numericValue / 1000).toFixed(2)
        console.log(`  ⏱️  First Contentful Paint: ${fcp}s`)
      }

      if (metrics['largest-contentful-paint']) {
        const lcp = (metrics['largest-contentful-paint'].numericValue / 1000).toFixed(2)
        console.log(`  📦 Largest Contentful Paint: ${lcp}s`)
      }

      if (metrics['cumulative-layout-shift']) {
        const cls = metrics['cumulative-layout-shift'].numericValue.toFixed(3)
        console.log(`  🎨 Cumulative Layout Shift: ${cls}`)
      }

      if (metrics['total-blocking-time']) {
        const tbt = metrics['total-blocking-time'].numericValue.toFixed(0)
        console.log(`  ⛔ Total Blocking Time: ${tbt}ms`)
      }

      if (metrics['speed-index']) {
        const si = (metrics['speed-index'].numericValue / 1000).toFixed(2)
        console.log(`  🏃 Speed Index: ${si}s`)
      }

      console.log('\n✅ Full report saved to: ' + reportPath + '.html\n')
      console.log('💡 Open the HTML report in a browser for detailed insights\n')

      await chrome.kill()
      process.exit(0)
    } catch (err) {
      if (chrome) await chrome.kill()
      throw err
    }
  } catch (error) {
    console.error('\n❌ Lighthouse test failed:', error.message)
    process.exit(1)
  }
}

// Main execution
try {
  await startServer()
  await runLighthouse()
} catch (error) {
  console.error('\n❌ Error:', error.message)
  if (server) server.kill()
  process.exit(1)
} finally {
  if (server) server.kill()
}
