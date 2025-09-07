import { AgentConfig, TestScenario, ScenarioData } from '../interfaces';
import { ScenarioType } from '../types';
import { OllamaClient } from '../services/ollama-client';
import { DemographicGenerator } from './demographic-generator';

export class ScenarioGenerator {
  private readonly ollamaClient: OllamaClient;
  private readonly systemPrompt: string;

  constructor(ollamaClient: OllamaClient) {
    this.ollamaClient = ollamaClient;
    this.systemPrompt = `You are an expert test scenario generator for voice agent systems. Create comprehensive test scenarios for voice agents.

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any text before or after the JSON.

The JSON must have exactly these three fields:
- scenarioName: A clear, descriptive title (string)
- scenarioDescription: Detailed context about the patient call and expectations (string)
- criteria: Simple success criteria as a single string describing what the agent should accomplish (string)

Example response format:
{
  "scenarioName": "Returning Patient Appointment Scheduling",
  "scenarioDescription": "John Smith calls to schedule a follow-up appointment. He provides his phone number and the system should recognize him as a returning patient.",
  "criteria": "Agent should recognize returning patient, verify details, and successfully schedule appointment while maintaining professional communication."
}`;
  }

  async generateScenario(agentConfig: AgentConfig, scenarioType: ScenarioType): Promise<TestScenario> {
    const demographicData = DemographicGenerator.generate();
    
    const prompt = `${this.systemPrompt}

Agent Configuration: ${JSON.stringify(agentConfig, null, 2)}

Generate a ${scenarioType.replace('_', ' ')} test scenario for this voice agent. 

The scenario should involve a ${demographicData.gender.toLowerCase()} patient named ${demographicData.firstName} ${demographicData.lastName}.

Focus on testing the agent's ability to handle this specific scenario type effectively.`;

    try {
      const response = await this.ollamaClient.generateResponse(prompt);
      const scenarioData = this.parseScenarioResponse(response);
      
      return {
        ...scenarioData,
        name: `${demographicData.firstName} ${demographicData.lastName}`,
        dob: demographicData.dob,
        phone: demographicData.phone,
        email: demographicData.email,
        gender: demographicData.gender,
        insurance: demographicData.insurance
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate ${scenarioType} scenario: ${errorMessage}`);
    }
  }

  private parseScenarioResponse(response: string): ScenarioData {
    try {
      // Extract JSON from the response - handle various formats
      let jsonString = response.trim();
      
      // Look for JSON object in the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonString);
      
      if (!parsed.scenarioName || !parsed.scenarioDescription || !parsed.criteria) {
        throw new Error('Missing required fields in generated scenario');
      }
      
      // Handle criteria field - it can be a string or object
      let criteriaString: string;
      if (typeof parsed.criteria === 'string') {
        criteriaString = parsed.criteria;
      } else if (typeof parsed.criteria === 'object') {
        // Convert complex criteria object to readable string
        criteriaString = this.formatCriteriaObject(parsed.criteria);
      } else {
        criteriaString = 'The agent should handle this scenario appropriately and professionally.';
      }
      
      return {
        scenarioName: parsed.scenarioName,
        scenarioDescription: parsed.scenarioDescription,
        criteria: criteriaString
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // If JSON parsing fails, try to extract key information using regex
      try {
        return this.extractScenarioDataWithRegex(response);
      } catch (regexError) {
        throw new Error(`Failed to parse scenario response: ${errorMessage}\n\nResponse was: ${response}`);
      }
    }
  }

  private formatCriteriaObject(criteriaObj: any): string {
    const criteria: string[] = [];
    
    if (criteriaObj.stateTransition || criteriaObj.stateTransitions) {
      criteria.push('Agent should properly transition between states');
    }
    
    if (criteriaObj.actionUtilization || criteriaObj.actionUsage) {
      criteria.push('Agent should use available actions appropriately');
    }
    
    if (criteriaObj.informationCollection) {
      criteria.push('Agent should accurately collect patient information');
    }
    
    if (criteriaObj.professionalCommunication || criteriaObj.communicationStandards) {
      criteria.push('Agent should maintain professional communication standards');
    }
    
    if (criteriaObj.accuracyRequirement) {
      criteria.push('Agent should ensure accuracy of collected information');
    }
    
    if (criteria.length === 0) {
      criteria.push('Agent should handle this scenario appropriately and professionally');
    }
    
    return criteria.join(', ');
  }

  private extractScenarioDataWithRegex(response: string): ScenarioData {
    // Try to extract data using regex patterns
    const nameMatch = response.match(/"scenarioName":\s*"([^"]+)"/);
    const descMatch = response.match(/"scenarioDescription":\s*"([^"]+)"/);
    
    if (!nameMatch || !descMatch) {
      throw new Error('Could not extract scenario data from response');
    }
    
    return {
      scenarioName: nameMatch[1],
      scenarioDescription: descMatch[1],
      criteria: 'Agent should handle this scenario appropriately and professionally'
    };
  }
}