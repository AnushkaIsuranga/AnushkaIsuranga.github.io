import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const [, , command, ...args] = process.argv

if (!command) {
  console.error('Usage: node scripts/without-groq-env.js <command> [args...]')
  process.exit(1)
}

delete process.env.VITE_GROQ_API_KEY

const viteBin = path.resolve(fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)))
const resolvedCommand = command === 'vite' ? process.execPath : command
const resolvedArgs = command === 'vite' ? [viteBin, ...args] : args

const child = spawn(resolvedCommand, resolvedArgs, {
  stdio: 'inherit',
  shell: false,
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})