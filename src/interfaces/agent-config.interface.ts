export interface AgentState {
  name: string;
  prompt: string;
  modelName: string;
  transitions: string[];
  initialMessage?: string;
}

export interface AgentConfig {
  agentConfig: {
    actions: string[];
    initialState: AgentState;
    additionalStates?: AgentState[];
  };
}