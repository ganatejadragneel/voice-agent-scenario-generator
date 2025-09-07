export enum ScenarioType {
  HAPPY_PATH = 'happy_path',
  EDGE_CASE = 'edge_case',
  ERROR_HANDLING = 'error_handling',
  STATE_TRANSITION = 'state_transition',
  ACTION_USAGE = 'action_usage'
}

export interface ScenarioDistribution {
  [ScenarioType.HAPPY_PATH]: number;
  [ScenarioType.EDGE_CASE]: number;
  [ScenarioType.ERROR_HANDLING]: number;
  [ScenarioType.STATE_TRANSITION]: number;
  [ScenarioType.ACTION_USAGE]: number;
}

export interface DemographicData {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  gender: string;
  insurance: string;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}