enum UserRole {
  ADMIN = 'ADMIN',
  FITNESS_CENTER = 'FITNESS_CENTER',
  TRAINER = 'TRAINER',
  USER = 'USER',
}

export const Everyone = [
  UserRole.ADMIN,
  UserRole.FITNESS_CENTER,
  UserRole.TRAINER,
  UserRole.USER,
];

export default UserRole;
