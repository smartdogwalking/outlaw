#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting OutLaw development servers...\n');

let backendProcess = null;
let frontendProcess = null;
let backendReady = false;

// Function to check if backend is responding
async function checkBackendHealth(retries = 15) {
  for (let i = 0; i < retries; i++) {
    try {
      const { stdout } = await execAsync('curl -s -m 3 http://localhost:8787/api/health || echo "FAILED"');
      if (stdout.includes('status') && !stdout.includes('FAILED')) {
        return true;
      }
    } catch (error) {
      // Ignore curl errors
    }
    
    console.log(`⏳ Waiting for backend... (${i + 1}/${retries})`);
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  return false;
}

// Function to start the frontend
function startFrontend() {
  if (frontendProcess) return;
  
  console.log('🎨 Starting Vite frontend server...');
  frontendProcess = spawn('npx', ['vite', '--port', '5173', '--host'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('❌ Frontend startup error:', error);
  });

  frontendProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Frontend exited with code ${code}`);
    }
    frontendProcess = null;
  });
}

// Function to start the backend with better error handling
function startBackend() {
  console.log('📦 Starting Cloudflare Workers backend...');
  console.log('💡 This may take a moment for the first startup...\n');
  
  backendProcess = spawn('npx', ['wrangler', 'dev', '--port', '8787', '--local', '--compatibility-date', '2025-08-26'], {
    cwd: __dirname,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { 
      ...process.env, 
      NODE_ENV: 'development',
      FORCE_COLOR: '1'
    }
  });

  let startupTimeout = setTimeout(() => {
    console.log('⚠️  Backend is taking longer than expected...');
    console.log('💡 Try running: npm run dev:backend in a separate terminal');
    console.log('💡 Then run: npm run dev:frontend in another terminal\n');
    
    // Start frontend anyway with graceful degradation
    if (!frontendProcess) {
      console.log('🎨 Starting frontend with backend fallback mode...');
      startFrontend();
    }
  }, 45000); // 45 second timeout

  backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    
    // Log all backend output for debugging
    if (output.trim()) {
      console.log(`🔧 Backend: ${output.trim()}`);
    }
    
    // Look for various readiness indicators
    if (output.includes('Ready on') || 
        output.includes('⎔ Starting local server') ||
        output.includes('Local:') ||
        output.includes('listening on') ||
        output.includes('⎔ Ready on')) {
      
      if (!backendReady) {
        clearTimeout(startupTimeout);
        backendReady = true;
        console.log('✅ Backend server appears to be starting...\n');
        
        // Give it a moment to fully initialize, then check health
        setTimeout(async () => {
          const isHealthy = await checkBackendHealth(8);
          if (isHealthy) {
            console.log('✅ Backend is healthy and ready!\n');
            startFrontend();
          } else {
            console.log('⚠️  Backend started but health check failed');
            console.log('🎨 Starting frontend anyway with graceful degradation...\n');
            startFrontend();
          }
        }, 5000);
      }
    }
  });

  backendProcess.stderr.on('data', (data) => {
    const error = data.toString();
    
    // Filter out common wrangler warnings/info messages
    if (!error.includes('WARNING') && !error.includes('--local is deprecated')) {
      console.error(`🔧 Backend stderr: ${error.trim()}`);
    }
    
    // Check for common startup issues
    if (error.includes('EADDRINUSE')) {
      console.error('❌ Port 8787 is already in use. Stop other processes using this port.');
      console.log('💡 Try: lsof -ti:8787 | xargs kill -9');
    } else if (error.includes('Module not found') || error.includes('Cannot resolve')) {
      console.error('❌ Backend module resolution error. Dependencies may be missing.');
      console.log('💡 Try: npm install');
    }
  });

  backendProcess.on('error', (error) => {
    console.error('❌ Failed to start backend process:', error);
    clearTimeout(startupTimeout);
    
    console.log('\n💡 Fallback: Starting frontend-only mode...');
    console.log('⚠️  Backend features will use mock data until backend is available\n');
    startFrontend();
  });

  backendProcess.on('close', (code) => {
    console.log(`🔧 Backend process exited with code ${code}`);
    backendProcess = null;
    backendReady = false;
    clearTimeout(startupTimeout);
    
    if (code !== 0 && code !== null) {
      console.log('💡 Backend crashed. Starting frontend with fallback mode...\n');
      if (!frontendProcess) {
        startFrontend();
      }
    }
  });
}

// Cleanup function
function cleanup() {
  console.log('\n🛑 Shutting down development servers...');
  
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
    setTimeout(() => {
      if (backendProcess) {
        backendProcess.kill('SIGKILL');
      }
    }, 5000);
  }
  
  if (frontendProcess) {
    frontendProcess.kill('SIGTERM');
    setTimeout(() => {
      if (frontendProcess) {
        frontendProcess.kill('SIGKILL');
      }
    }, 5000);
  }
  
  setTimeout(() => process.exit(0), 6000);
}

// Handle cleanup signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  cleanup();
});

// Start the backend
console.log('📋 OutLaw Development Environment');
console.log('📋 Starting backend first, then frontend...\n');

startBackend();
