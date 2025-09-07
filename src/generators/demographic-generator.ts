import { DemographicData } from '../types';
import { DataPools } from '../utils/data-pools';

export class DemographicGenerator {
  static generate(): DemographicData {
    const firstName = DataPools.getRandomFirstName();
    const lastName = DataPools.getRandomLastName();
    
    return {
      firstName,
      lastName,
      dob: DataPools.generateRandomDOB(),
      phone: DataPools.generateRandomPhone(),
      email: DataPools.generateRandomEmail(firstName, lastName),
      gender: DataPools.getRandomGender(),
      insurance: DataPools.getRandomInsurance()
    };
  }
}