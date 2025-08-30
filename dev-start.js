#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

console.log('🚀 Starting OutLaw development servers...\n');

let backendProcess = null;
let frontendProcess = null;

// Function to check if backend is responding
async function checkBackendHealth(retries = 15) {
  for (let i = 0; i < retries; i++) {
    try {
      const { stdout } = await execAsync('curl -s http://localhost:8787/api/health || echo "FAILED"');
      if (stdout.includes('status') && !stdout.includes('FAILED')) {
        return true;
      }
    } catch (error) {
      // Ignore curl errors
    }
    
    console.log(`⏳ Waiting for backend... (${i + 1}/${retries})`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return false;
}

// Function to start the backend
function startBackend() {
  console.log('📦 Starting Cloudflare Workers backend...');
  
  backendProcess = spawn('npx', ['wrangler', 'dev', '--port', '8787', '--local', '--compatibility-date', '2025-08-26'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  backendProcess.on('error', (error) => {
    console.error('❌ Failed to start backend:', error);
  });

  backendProcess.on('close', (code) => {
    console.log(`🔧 Backend exited with code ${code}`);
    backendProcess = null;
  });

  return backendProcess;
}

// Function to start the frontend
function startFrontend() {
  console.log('🎨 Starting Vite frontend server...');
  
  frontendProcess = spawn('npx', ['vite', '--port', '5173', '--host'], {
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('❌ Failed to start frontend:', error);
  });

  frontendProcess.on('close', (code) => {
    console.log(`🎨 Frontend exited with code ${code}`);
    frontendProcess = null;
  });

  return frontendProcess;
}

// Cleanup function
function cleanup() {
  console.log('\n🛑 Shutting down development servers...');
  
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  
  if (frontendProcess) {
    frontendProcess.kill('SIGTERM');
  }
  
  setTimeout(() => process.exit(0), 2000);
}

// Handle cleanup signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start both servers
async function start() {
  // Start backend first
  startBackend();
  
  // Wait a bit then check health
  console.log('⏳ Waiting for backend to initialize...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const isHealthy = await checkBackendHealth(10);
  if (isHealthy) {
    console.log('✅ Backend is healthy and ready!\n');
  } else {
    console.log('⚠️  Backend health check failed, but continuing anyway...\n');
  }
  
  // Start frontend
  startFrontend();
  
  console.log('\n🎉 Both servers are starting up!');
  console.log('📱 Frontend: http://localhost:5173');
  console.log('⚙️  Backend:  http://localhost:8787');
  console.log('\nPress Ctrl+C to stop both servers\n');
}

start().catch(error => {
  console.error('❌ Failed to start servers:', error);
  cleanup();
});
