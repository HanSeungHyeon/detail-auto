const fs = require('fs');
const { execSync } = require('child_process');

/**
 * .agent/CONTROLPANEL.md 파일을 현재 작업 기반으로 자동 업데이트합니다.
 */
function updateControlPanel() {
  try {
    const status = execSync('git status --short').toString();
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const lastCommit = execSync('git log -1 --pretty=format:"%s (%h)"').toString();
    const date = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    let content = `# 🚩 Work-in-Progress Handoff (${date.split(' ')[0]})\n\n`;
    content += `## 🕒 마지막 업데이트: ${date}\n`;
    content += `## 🌿 현재 브랜치: ${branch}\n\n`;

    content += `## ✅ 현재 변경 사항 (git status)\n\`\`\`\n${status || '변경 사항 없음'}\`\`\`\n\n`;

    content += `## 📝 작업 상황 (from .agent/task.md)\n`;
    try {
      const taskContent = fs.readFileSync('.agent/task.md', 'utf8');
      const latestTask = taskContent.split('\n').filter(line => line.includes('- [x]')).slice(-3).join('\n');
      content += `최근 완료:\n${latestTask || '기록 없음'}\n\n`;
    } catch (e) {
      content += `태스크 파일을 읽을 수 없습니다.\n\n`;
    }

    content += `## 🚀 다음 단계 가이드\n1. 회사에서 \`git pull\`을 받습니다.\n2. 안티그래비티 대화창에 ".agent 폴더 읽고 하던 거 계속해줘"라고 입력합니다.\n`;

    fs.writeFileSync('.agent/CONTROLPANEL.md', content);
    console.log('✅ .agent/CONTROLPANEL.md 업데이트 완료!');
  } catch (err) {
    console.error('❌ 업데이트 중 오류 발생:', err.message);
  }
}

updateControlPanel();
