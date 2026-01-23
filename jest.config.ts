import type { Config } from 'jest';

export default {
  moduleNameMapper: {
    '@shared/(.*)': ['./src/app/domains/shared/$1'],
    '@products/(.*)': ['./src/app/domains/products/$1'],
    '@info/(.*)': ['./src/app/domains/info/$1'],
    '@env/(.*)': ['./src/environments/$1'],
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!<rootDir>/node_modules/',
    '!<rootDir>/test/',
  ],
} satisfies Config;
