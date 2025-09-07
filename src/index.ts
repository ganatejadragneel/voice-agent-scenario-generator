import { AgentConfig, TestScenario } from './interfaces';
import { OllamaClient } from './services/ollama-client';
import { ScenarioDistributionManager } from './services/scenario-distribution-manager';
import { StorageManager, StorageOptions } from './services/storage-manager';
import { ScenarioGenerator } from './generators/scenario-generator';
import { ScenarioType } from './types';

export interface CreateScenariosOptions {
  storage?: StorageOptions;
  saveToFile?: boolean;
}

export async function createScenarios(
  agentConfig: AgentConfig, 
  numScenarios: number, 
  options: CreateScenariosOptions = {}
): Promise<TestScenario[]> {
  if (!agentConfig?.agentConfig) {
    throw new Error('Invalid agent configuration: missing agentConfig property');
  }
  
  if (numScenarios <= 0) {
    throw new Error('Number of scenarios must be greater than 0');
  }

  const ollamaClient = new OllamaClient();
  
  // Check if Ollama is running
  const isHealthy = await ollamaClient.checkHealth();
  if (!isHealthy) {
    throw new Error('Ollama service is not running. Please start Ollama and ensure llama3.2 model is available.');
  }

  const distributionManager = new ScenarioDistributionManager();
  const scenarioGenerator = new ScenarioGenerator(ollamaClient);

  try {
    const scenarioCounts = distributionManager.calculateScenarioCounts(numScenarios);
    const scenarios: TestScenario[] = [];

    console.log('📊 Scenario Distribution:');
    for (const [type, count] of Object.entries(scenarioCounts)) {
      console.log(`   - ${type.replace('_', ' ')}: ${count} scenarios`);
    }
    console.log('');

    for (const [scenarioType, count] of Object.entries(scenarioCounts)) {
      for (let i = 0; i < count; i++) {
        try {
          console.log(`🔄 Generating ${scenarioType.replace('_', ' ')} scenario ${i + 1}/${count}...`);
          const scenario = await scenarioGenerator.generateScenario(agentConfig, scenarioType as ScenarioType);
          scenarios.push(scenario);
          console.log(`✅ Generated: "${scenario.scenarioName}"`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.warn(`⚠️  Failed to generate scenario ${i + 1} of type ${scenarioType}: ${errorMessage}`);
          // Continue with other scenarios rather than failing completely
        }
      }
    }

    if (scenarios.length === 0) {
      throw new Error('Failed to generate any scenarios');
    }

    // Save to storage if requested
    if (options.saveToFile !== false) { // Default to true
      const storageManager = new StorageManager(options.storage);
      await storageManager.saveScenarios(scenarios, options.storage?.runId);
    }

    return scenarios;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Scenario generation failed: ${errorMessage}`);
  }
}

// Export all types and interfaces for external use
export * from './interfaces';
export * from './types';
export { OllamaClient } from './services/ollama-client';
export { ScenarioDistributionManager } from './services/scenario-distribution-manager';
export { StorageManager, StorageOptions } from './services/storage-manager';
export { ScenarioGenerator } from './generators/scenario-generator';
export { DemographicGenerator } from './generators/demographic-generator';
export { DataPools } from './utils/data-pools';