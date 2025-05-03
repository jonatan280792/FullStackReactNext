module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@guards/(.*)$': '<rootDir>/guards/$1',
    '^@interceptors/(.*)$': '<rootDir>/interceptors/$1',
    '^@products/(.*)$': '<rootDir>/products/$1',
    '^@seed/(.*)$': '<rootDir>/seed/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@users/(.*)$': '<rootDir>/users/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  }
};