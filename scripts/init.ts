const { initializeData, initializeSettings } = require('../lib/init-data');

async function main() {
  try {
    await Promise.all([
      initializeData(),
      initializeSettings()
    ]);
    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
}

main(); 