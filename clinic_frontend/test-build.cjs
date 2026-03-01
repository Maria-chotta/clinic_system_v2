const { execSync } = require('child_process');
try {
  const output = execSync('node node_modules/vite/bin/vite.js build', { 
    cwd: 'c:\\Users\\kuula\\clinic_system_v2\\clinic_frontend',
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('OUTPUT:', output);
} catch (error) {
  console.log('ERROR:', error.message);
  console.log('STDOUT:', error.stdout);
  console.log('STDERR:', error.stderr);
}
