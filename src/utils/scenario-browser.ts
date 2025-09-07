import { StorageManager } from '../services/storage-manager';
import { TestScenario } from '../interfaces';

export class ScenarioBrowser {
  private readonly storageManager: StorageManager;

  constructor(baseDir?: string) {
    this.storageManager = new StorageManager({ baseDir });
  }

  async listAllRuns(): Promise<void> {
    console.log('📚 Available Test Runs:');
    console.log('======================');
    
    const runs = await this.storageManager.listRuns();
    
    if (runs.length === 0) {
      console.log('No test runs found.');
      return;
    }

    for (const runId of runs) {
      const runInfo = await this.storageManager.getRunInfo(runId);
      if (runInfo) {
        const date = new Date(runInfo.timestamp).toLocaleString();
        console.log(`📁 ${runId}`);
        console.log(`   📅 Created: ${date}`);
        console.log(`   📊 Scenarios: ${runInfo.totalScenarios}`);
        console.log(`   📂 Path: ${this.storageManager.getStoragePath()}/${runId}`);
        console.log('');
      }
    }
  }

  async displayRun(runId: string): Promise<void> {
    console.log(`📋 Test Run: ${runId}`);
    console.log('='.repeat(40));
    
    try {
      const scenarios = await this.storageManager.loadScenarios(runId);
      const runInfo = await this.storageManager.getRunInfo(runId);
      
      if (runInfo) {
        const date = new Date(runInfo.timestamp).toLocaleString();
        console.log(`📅 Created: ${date}`);
        console.log(`📊 Total Scenarios: ${runInfo.totalScenarios}`);
        console.log('');
      }

      scenarios.forEach((scenario, index) => {
        console.log(`📋 Scenario ${index + 1}: ${scenario.scenarioName}`);
        console.log(`👤 Patient: ${scenario.name} (${scenario.gender})`);
        console.log(`📞 Phone: ${scenario.phone}`);
        console.log(`🏥 Insurance: ${scenario.insurance}`);
        console.log(`📝 Description: ${scenario.scenarioDescription}`);
        console.log(`✔️  Success Criteria: ${scenario.criteria}`);
        console.log('─'.repeat(80));
      });
      
    } catch (error) {
      console.error(`❌ Error loading run ${runId}:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async findScenariosByType(scenarioType: string): Promise<void> {
    console.log(`🔍 Searching for "${scenarioType}" scenarios...`);
    console.log('='.repeat(50));
    
    const runs = await this.storageManager.listRuns();
    let foundCount = 0;
    
    for (const runId of runs) {
      try {
        const scenarios = await this.storageManager.loadScenarios(runId);
        const matchingScenarios = scenarios.filter(scenario => 
          scenario.scenarioName.toLowerCase().includes(scenarioType.toLowerCase()) ||
          scenario.scenarioDescription.toLowerCase().includes(scenarioType.toLowerCase())
        );
        
        if (matchingScenarios.length > 0) {
          console.log(`\n📁 Run: ${runId} (${matchingScenarios.length} matches)`);
          matchingScenarios.forEach((scenario, index) => {
            console.log(`  ${index + 1}. ${scenario.scenarioName} - ${scenario.name}`);
          });
          foundCount += matchingScenarios.length;
        }
      } catch (error) {
        console.warn(`Warning: Could not search run ${runId}`);
      }
    }
    
    console.log(`\n🎯 Found ${foundCount} scenarios matching "${scenarioType}"`);
  }

  getStoragePath(): string {
    return this.storageManager.getStoragePath();
  }
}