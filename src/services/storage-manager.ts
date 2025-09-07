import * as fs from 'fs';
import * as path from 'path';
import { TestScenario } from '../interfaces';

export interface StorageOptions {
  baseDir?: string;
  runId?: string;
}

export interface StoredScenarioInfo {
  runId: string;
  timestamp: string;
  totalScenarios: number;
  filePaths: string[];
}

export class StorageManager {
  private readonly baseDir: string;

  constructor(options: StorageOptions = {}) {
    this.baseDir = options.baseDir || './storage';
  }

  async saveScenarios(scenarios: TestScenario[], runId?: string): Promise<StoredScenarioInfo> {
    const actualRunId = runId || this.generateRunId();
    const timestamp = new Date().toISOString();
    const runDir = path.join(this.baseDir, actualRunId);

    // Create directories if they don't exist
    await this.ensureDirectoryExists(runDir);

    const filePaths: string[] = [];

    // Save each scenario as a separate JSON file
    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      const fileName = `test${i + 1}.json`;
      const filePath = path.join(runDir, fileName);
      
      const scenarioData = {
        id: i + 1,
        timestamp,
        runId: actualRunId,
        ...scenario
      };

      await fs.promises.writeFile(filePath, JSON.stringify(scenarioData, null, 2), 'utf8');
      filePaths.push(filePath);
    }

    // Save run summary
    const summaryPath = path.join(runDir, 'run-summary.json');
    const summary: StoredScenarioInfo & { scenarios: TestScenario[] } = {
      runId: actualRunId,
      timestamp,
      totalScenarios: scenarios.length,
      filePaths,
      scenarios
    };

    await fs.promises.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

    console.log(`💾 Saved ${scenarios.length} scenarios to: ${runDir}`);
    console.log(`📄 Individual files: ${filePaths.map(p => path.basename(p)).join(', ')}`);
    console.log(`📋 Run summary: ${path.basename(summaryPath)}`);

    return {
      runId: actualRunId,
      timestamp,
      totalScenarios: scenarios.length,
      filePaths
    };
  }

  async loadScenarios(runId: string): Promise<TestScenario[]> {
    const runDir = path.join(this.baseDir, runId);
    const summaryPath = path.join(runDir, 'run-summary.json');

    try {
      const summaryContent = await fs.promises.readFile(summaryPath, 'utf8');
      const summary = JSON.parse(summaryContent);
      return summary.scenarios || [];
    } catch (error) {
      throw new Error(`Failed to load scenarios for run ${runId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listRuns(): Promise<string[]> {
    try {
      if (!fs.existsSync(this.baseDir)) {
        return [];
      }

      const entries = await fs.promises.readdir(this.baseDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      console.warn('Failed to list runs:', error);
      return [];
    }
  }

  async getRunInfo(runId: string): Promise<StoredScenarioInfo | null> {
    const runDir = path.join(this.baseDir, runId);
    const summaryPath = path.join(runDir, 'run-summary.json');

    try {
      const summaryContent = await fs.promises.readFile(summaryPath, 'utf8');
      const summary = JSON.parse(summaryContent);
      return {
        runId: summary.runId,
        timestamp: summary.timestamp,
        totalScenarios: summary.totalScenarios,
        filePaths: summary.filePaths
      };
    } catch (error) {
      return null;
    }
  }

  private generateRunId(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    return `run_${dateStr}_${timeStr}`;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.promises.access(dirPath);
    } catch {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  getStoragePath(): string {
    return path.resolve(this.baseDir);
  }
}