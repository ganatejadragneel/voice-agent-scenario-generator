import { OllamaResponse, OllamaRequest } from '../types';

export class OllamaClient {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(baseUrl = 'http://localhost:11434', model = 'llama3.2') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const requestBody: OllamaRequest = {
        model: this.model,
        prompt,
        stream: false
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as OllamaResponse;
      
      if (!data.response) {
        throw new Error('Empty response from Ollama API');
      }

      return data.response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate response from Ollama: ${error.message}`);
      }
      throw new Error('Failed to generate response from Ollama: Unknown error');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}