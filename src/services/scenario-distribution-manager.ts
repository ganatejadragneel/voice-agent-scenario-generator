import { ScenarioType, ScenarioDistribution } from '../types';

export class ScenarioDistributionManager {
  private readonly defaultDistribution: ScenarioDistribution = {
    [ScenarioType.HAPPY_PATH]: 0.3,      // 30%
    [ScenarioType.EDGE_CASE]: 0.2,       // 20%
    [ScenarioType.ERROR_HANDLING]: 0.2,  // 20%
    [ScenarioType.STATE_TRANSITION]: 0.15, // 15%
    [ScenarioType.ACTION_USAGE]: 0.15    // 15%
  };

  calculateScenarioCounts(
    totalScenarios: number, 
    customDistribution?: Partial<ScenarioDistribution>
  ): Record<ScenarioType, number> {
    const distribution = { ...this.defaultDistribution, ...customDistribution };
    const counts: Record<ScenarioType, number> = {} as Record<ScenarioType, number>;
    
    let remainingScenarios = totalScenarios;
    
    for (const [type, percentage] of Object.entries(distribution)) {
      const count = Math.floor(totalScenarios * percentage);
      counts[type as ScenarioType] = count;
      remainingScenarios -= count;
    }

    // Distribute remaining scenarios to happy path
    if (remainingScenarios > 0) {
      counts[ScenarioType.HAPPY_PATH] += remainingScenarios;
    }

    return counts;
  }

  getDefaultDistribution(): ScenarioDistribution {
    return { ...this.defaultDistribution };
  }
}