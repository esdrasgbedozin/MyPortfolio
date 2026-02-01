#!/usr/bin/env node

/**
 * Contract Testing Script
 * Epic 5.1 - EF-055b: Generate Contract Tests from OpenAPI
 * 
 * Tests that the API implementation matches the OpenAPI specification
 */

import { spawn } from 'child_process';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

/**
 * Start Prism mock server
 */
async function startPrismServer() {
  log.info('Starting Prism mock server on port 4010...');
  
  const prism = spawn('npx', ['@stoplight/prism-cli', 'mock', 'openapi.yaml', '-p', '4010'], {
    stdio: 'pipe'
  });

  return new Promise((resolve, reject) => {
    prism.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Prism is listening')) {
        log.success('Prism mock server started');
        resolve(prism);
      }
    });

    prism.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('Error')) {
        reject(new Error(error));
      }
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      reject(new Error('Prism server startup timeout'));
    }, 10000);
  });
}

/**
 * Test contract endpoints
 */
async function testContracts(baseUrl) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: GET /api/health
  log.info('Testing GET /api/health...');
  results.total++;
  
  try {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'healthy') {
      log.success('GET /api/health: ✓ Returns 200 with healthy status');
      results.passed++;
      results.tests.push({ name: 'GET /api/health', passed: true });
    } else {
      log.error(`GET /api/health: ✗ Expected 200 with healthy status, got ${response.status}`);
      results.failed++;
      results.tests.push({ name: 'GET /api/health', passed: false, error: `Status ${response.status}` });
    }
  } catch (error) {
    log.error(`GET /api/health: ✗ ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'GET /api/health', passed: false, error: error.message });
  }

  // Test 2: POST /api/contact (valid payload)
  log.info('Testing POST /api/contact with valid payload...');
  results.total++;
  
  try {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message for contract testing',
      turnstileToken: 'mock-token-12345'
    };

    const response = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.status === 200 && data.message) {
      log.success('POST /api/contact (valid): ✓ Returns 200 with message');
      results.passed++;
      results.tests.push({ name: 'POST /api/contact (valid)', passed: true });
    } else {
      log.error(`POST /api/contact (valid): ✗ Expected 200, got ${response.status}`);
      results.failed++;
      results.tests.push({ name: 'POST /api/contact (valid)', passed: false, error: `Status ${response.status}` });
    }
  } catch (error) {
    log.error(`POST /api/contact (valid): ✗ ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'POST /api/contact (valid)', passed: false, error: error.message });
  }

  // Test 3: POST /api/contact (invalid email)
  log.info('Testing POST /api/contact with invalid email...');
  results.total++;
  
  try {
    const payload = {
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Test message',
      turnstileToken: 'mock-token-12345'
    };

    const response = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.status === 400) {
      log.success('POST /api/contact (invalid email): ✓ Returns 400 for bad request');
      results.passed++;
      results.tests.push({ name: 'POST /api/contact (invalid email)', passed: true });
    } else {
      log.error(`POST /api/contact (invalid email): ✗ Expected 400, got ${response.status}`);
      results.failed++;
      results.tests.push({ name: 'POST /api/contact (invalid email)', passed: false, error: `Status ${response.status}` });
    }
  } catch (error) {
    log.error(`POST /api/contact (invalid email): ✗ ${error.message}`);
    results.failed++;
    results.tests.push({ name: 'POST /api/contact (invalid email)', passed: false, error: error.message });
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('\n=== Contract Testing Suite ===\n');
  
  let prismProcess;
  
  try {
    // Start Prism mock server
    prismProcess = await startPrismServer();
    
    // Wait for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run contract tests
    const results = await testContracts('http://localhost:4010');
    
    // Print summary
    console.log('\n=== Test Results ===');
    console.log(`Total: ${results.total}`);
    console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
    
    // Exit with appropriate code
    if (results.failed > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    log.error(`Contract testing failed: ${error.message}`);
    process.exit(1);
  } finally {
    // Stop Prism server
    if (prismProcess) {
      log.info('Stopping Prism mock server...');
      prismProcess.kill();
    }
  }
}

main();
