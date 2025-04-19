const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure output directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Run Vite build
console.log('Starting Vite build for Vercel...');
try {
  execSync('npm run build:vercel', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Create _redirects file in dist directory
try {
  fs.writeFileSync(
    path.join(distPath, '_redirects'),
    '/* /index.html 200\n'
  );
  console.log('Created _redirects file');
} catch (error) {
  console.error('Failed to create _redirects file:', error);
}

// Verify build artifacts
console.log('Build artifacts:');
execSync(`ls -la ${distPath}`, { stdio: 'inherit' });

console.log('Vercel build completed!');