import { ScenarioBrowser } from '../src/utils/scenario-browser';

async function browseStoredScenarios() {
  const browser = new ScenarioBrowser();
  
  console.log('🔍 Scenario Browser');
  console.log('==================');
  console.log(`📂 Storage Location: ${browser.getStoragePath()}`);
  console.log('');
  
  // List all available runs
  await browser.listAllRuns();
  
  // Display the first run if it exists
  console.log('📖 Displaying Latest Run Details:');
  console.log('');
  await browser.displayRun('run1');
  
  // Search for specific scenario types
  console.log('\n🔍 Searching for "appointment" scenarios:');
  await browser.findScenariosByType('appointment');
}

// Run the browser if this file is executed directly
if (require.main === module) {
  browseStoredScenarios().catch(console.error);
}

export { browseStoredScenarios };