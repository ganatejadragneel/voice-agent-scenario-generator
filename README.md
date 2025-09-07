# Voice Agent Test Scenario Generator

A TypeScript-based tool that automatically generates comprehensive test scenarios for voice agents using local Llama3.2 via Ollama.

## Features

- **Strongly Typed**: Full TypeScript interfaces for input/output schemas
- **Realistic Data**: Generates authentic demographic profiles
- **Balanced Distribution**: Configurable scenario types (30% happy path, 20% edge cases, etc.)
- **Local LLM**: Uses Llama3.2 via Ollama for privacy and control
- **SOLID Principles**: Clean, maintainable, and extensible architecture
- **Error Handling**: Comprehensive error handling with descriptive messages

## Prerequisites

1. **Node.js** (v16+)
2. **Ollama** with Llama3.2 model

### Setting up Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Llama3.2 model
ollama pull llama3.2

# Start Ollama service (run in background)
ollama serve
```

Verify Ollama is running:
```bash
curl http://localhost:11434
```

## Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## Usage

### Basic Usage

```typescript
import { createScenarios } from './scenario-generator';

const agentConfig = {
  "agentConfig": {
    "actions": ["find_patient_info", "dial_human_agent"],
    "initialState": {
      "name": "INFORMATION_COLLECTION",
      "prompt": "You are an AI receptionist for a clinic...",
      "modelName": "gpt-4o",
      "transitions": ["SCHEDULING_APPOINTMENT", "HPI_COLLECTION"],
      "initialMessage": "Hello, thank you for calling the clinic..."
    },
    "additionalStates": [
      // ... additional states
    ]
  }
};

// Generate 10 test scenarios
const scenarios = await createScenarios(agentConfig, 10);
console.log(scenarios);
```

### Running the Example

```bash
# Run the test example
npm test

# Or with development mode (auto-restart)
npm run dev
```

## Scenario Distribution

By default, scenarios are distributed as follows:

- **Happy Path**: 30% - Standard successful interactions
- **Edge Cases**: 20% - Unusual but valid requests
- **Error Handling**: 20% - Invalid inputs, system failures
- **State Transitions**: 15% - Testing navigation between states
- **Action Usage**: 15% - Testing all available actions

## Output Format

Each generated scenario includes:

```typescript
{
  scenarioName: string;        // Clear, descriptive title
  scenarioDescription: string; // Detailed context and expectations
  name: string;               // Patient/customer full name
  dob: string;                // Date of birth (MM/DD/YYYY)
  phone: string;              // Phone number (XXX-XXX-XXXX)
  email: string;              // Email address
  gender: string;             // Gender identity
  insurance: string;          // Insurance provider
  criteria: string;           // Success criteria for evaluation
}
```

## Architecture

The implementation follows SOLID principles:

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Easy to extend with new scenario types
- **Liskov Substitution**: Interfaces can be swapped
- **Interface Segregation**: Clean, focused interfaces  
- **Dependency Inversion**: Main function depends on abstractions

### Key Components

- `DataPools`: Realistic demographic data generation
- `DemographicGenerator`: Creates patient/customer profiles
- `OllamaClient`: Handles LLM communication
- `ScenarioDistributionManager`: Manages scenario type distribution
- `ScenarioGenerator`: Orchestrates scenario creation

## Error Handling

The generator includes comprehensive error handling:

- **Invalid Configuration**: Validates agent config structure
- **LLM API Failures**: Handles Ollama connectivity issues
- **Malformed Responses**: Validates and parses LLM output
- **Network Issues**: Graceful handling of connection problems

## Customization

### Custom Scenario Distribution

```typescript
// Custom distribution can be added by modifying ScenarioDistributionManager
const customDistribution = {
  [ScenarioType.HAPPY_PATH]: 0.4,     // 40%
  [ScenarioType.EDGE_CASE]: 0.3,      // 30%
  [ScenarioType.ERROR_HANDLING]: 0.3  // 30%
};
```

### Custom Data Pools

Extend the `DataPools` class to add domain-specific data:

```typescript
class CustomDataPools extends DataPools {
  static readonly MEDICAL_CONDITIONS = [
    'Diabetes', 'Hypertension', 'Asthma'
  ];
  
  static getRandomCondition(): string {
    return this.MEDICAL_CONDITIONS[Math.floor(Math.random() * this.MEDICAL_CONDITIONS.length)];
  }
}
```

## Contributing

1. Follow TypeScript best practices
2. Maintain SOLID principles
3. Add comprehensive error handling
4. Include tests for new features
5. Update documentation

## License

MIT License - see LICENSE file for details