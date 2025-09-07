import { createScenarios } from '../src';

const exampleAgentConfig = {
  "agentConfig": {
    "actions": ["find_patient_info", "dial_human_agent"],
    "initialState": {
      "name": "INFORMATION_COLLECTION",
      "prompt": "You are an AI receptionist for a clinic. Your goal is to gather patient information, such as contact details and insurance, or look up existing patient records. If the patient needs to schedule an appointment, transition to SCHEDULING_APPOINTMENT. If the call involves a medical history discussion, transition to HPI_COLLECTION. For all other inquiries, connect to a human agent. Always ask for clarifications, ensure accuracy, and thank the patient before ending the call.",
      "modelName": "gpt-4o",
      "transitions": ["SCHEDULING_APPOINTMENT", "HPI_COLLECTION"],
      "initialMessage": "Hello, thank you for calling the clinic. I'm your AI receptionist. Are you a new or returning patient?"
    },
    "additionalStates": [
      {
        "name": "SCHEDULING_APPOINTMENT",
        "prompt": "You are scheduling an appointment for a clinic. Ask the patient their appointment type and offer available slots (e.g., Tuesdays 4-5 PM, Wednesdays 2-3 PM, Fridays 9-10 AM). Confirm or reschedule as needed. Always thank the patient and end the call politely.",
        "modelName": "gpt-4o-mini",
        "transitions": []
      },
      {
        "name": "HPI_COLLECTION",
        "prompt": "You are collecting medical history for a patient's upcoming doctor visit. Gather information about their symptoms, medical history, medications, and allergies. Ask clear, step-by-step questions to prepare the doctor for the visit. If unsure about anything, connect to a human agent and thank the patient before ending the call.",
        "modelName": "gpt-4o-mini",
        "transitions": []
      }
    ]
  }
};

export async function testScenarioGeneration() {
  try {
    console.log('🚀 Voice Agent Scenario Generator Test');
    console.log('=====================================');
    console.log('');
    
    console.log('📋 Agent Configuration:');
    console.log(`   - Actions: ${exampleAgentConfig.agentConfig.actions.join(', ')}`);
    console.log(`   - Initial State: ${exampleAgentConfig.agentConfig.initialState.name}`);
    console.log(`   - Additional States: ${exampleAgentConfig.agentConfig.additionalStates?.map(s => s.name).join(', ')}`);
    console.log('');

    console.log('🎯 Generating 5 test scenarios...');
    console.log('');

    const scenarios = await createScenarios(exampleAgentConfig, 5, {
      storage: { runId: 'run1' },
      saveToFile: true
    });
    
    console.log(`✅ Successfully generated ${scenarios.length} test scenarios:`);
    console.log('');

    scenarios.forEach((scenario, index) => {
      console.log(`📋 Scenario ${index + 1}: ${scenario.scenarioName}`);
      console.log(`👤 Patient: ${scenario.name} (${scenario.gender})`);
      console.log(`📅 DOB: ${scenario.dob}`);
      console.log(`📞 Phone: ${scenario.phone}`);
      console.log(`📧 Email: ${scenario.email}`);
      console.log(`🏥 Insurance: ${scenario.insurance}`);
      console.log(`📝 Description: ${scenario.scenarioDescription}`);
      console.log(`✔️  Success Criteria: ${scenario.criteria}`);
      console.log('─'.repeat(80));
    });

    console.log('');
    console.log('🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Error generating scenarios:', error instanceof Error ? error.message : 'Unknown error');
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure Ollama is running: ollama serve');
    console.log('   2. Check if llama3.2 model is available: ollama list');
    console.log('   3. Pull the model if needed: ollama pull llama3.2');
    console.log('   4. Verify Ollama health: curl http://localhost:11434/api/tags');
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testScenarioGeneration();
}