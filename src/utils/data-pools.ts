export class DataPools {
  private static readonly FIRST_NAMES = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
    'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle'
  ];

  private static readonly LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
  ];

  private static readonly INSURANCE_PROVIDERS = [
    'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Kaiser Permanente',
    'Anthem', 'Humana', 'Medicare', 'Medicaid', 'Tricare'
  ];

  private static readonly GENDERS = ['Male', 'Female', 'Non-binary'];

  static getRandomFirstName(): string {
    return this.FIRST_NAMES[Math.floor(Math.random() * this.FIRST_NAMES.length)];
  }

  static getRandomLastName(): string {
    return this.LAST_NAMES[Math.floor(Math.random() * this.LAST_NAMES.length)];
  }

  static getRandomInsurance(): string {
    return this.INSURANCE_PROVIDERS[Math.floor(Math.random() * this.INSURANCE_PROVIDERS.length)];
  }

  static getRandomGender(): string {
    return this.GENDERS[Math.floor(Math.random() * this.GENDERS.length)];
  }

  static generateRandomDOB(): string {
    const start = new Date(1940, 0, 1);
    const end = new Date(2005, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return `${String(randomDate.getMonth() + 1).padStart(2, '0')}/${String(randomDate.getDate()).padStart(2, '0')}/${randomDate.getFullYear()}`;
  }

  static generateRandomPhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}-${exchange}-${number}`;
  }

  static generateRandomEmail(firstName: string, lastName: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  }
}