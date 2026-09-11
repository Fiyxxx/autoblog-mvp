import { spawn, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import process from 'node:process'

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function fail(message) {
  console.error(`\n${message}`)
  process.exit(1)
}

function ensureSupportedNode() {
  const [major, minor] = process.versions.node.split('.').map(Number)

  if (major < 20 || (major === 20 && minor < 9)) {
    fail(`Node.js 20.9+ is required. Current version: ${process.versions.node}`)
  }
}

function run(command, args, label) {
  console.log(`\n› ${label}`)

  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  })

  if (result.error?.code === 'ENOENT') {
    fail(`Could not find ${command}. Check the local setup requirements in README.md.`)
  }

  if (result.error) {
    fail(`${label} failed: ${result.error.message}`)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

ensureSupportedNode()

if (!existsSync('.env')) {
  copyFileSync('.env.example', '.env')
  console.log('✓ Created .env from .env.example')
}

run(pnpm, ['install', '--frozen-lockfile'], 'Installing dependencies')
run('docker', ['compose', 'up', '-d', '--wait'], 'Starting PostgreSQL')
run(pnpm, ['exec', 'prisma', 'migrate', 'deploy'], 'Applying database migrations')
run(pnpm, ['exec', 'prisma', 'db', 'seed'], 'Seeding required data')

console.log('\n› Starting Next.js\n')

const next = spawn(pnpm, ['exec', 'next', 'dev', ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
})

next.on('error', (error) => {
  fail(`Could not start Next.js: ${error.message}`)
})

next.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
