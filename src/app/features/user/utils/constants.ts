export enum UserStatus {
  Active = 'A',
  Inactive = 'I',
  Terminated = 'T',
}

export const UserStatusLabels = {
  [UserStatus.Active]: 'Active',
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Terminated]: 'Terminated',
};
