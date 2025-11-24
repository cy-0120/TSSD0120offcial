const { spawn } = require('child_process');
const { exec } = require('child_process');

// Next.js 개발 서버 시작
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// 3초 후 브라우저 열기
setTimeout(() => {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    // Windows
    command = 'start http://localhost:3000';
  } else if (platform === 'darwin') {
    // macOS
    command = 'open http://localhost:3000';
  } else {
    // Linux
    command = 'xdg-open http://localhost:3000';
  }
  
  exec(command, (error) => {
    if (error) {
      console.log('브라우저를 자동으로 열 수 없습니다. 수동으로 http://localhost:3000 을 열어주세요.');
    }
  });
}, 3000);

// 프로세스 종료 처리
process.on('SIGINT', () => {
  nextDev.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  nextDev.kill();
  process.exit();
});

