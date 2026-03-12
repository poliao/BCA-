export class SystemCodes {
  name: string;
  systemCode: string;
  url: string;
  image: string;
  description: string;
  active: boolean;
}

export class Rppm01Model {
  systemCode: SystemCodes[];
  userManualCanva: UserManualCanva;
}

export class UserManualCanva {
  parameterValue: string;
}

