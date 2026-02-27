import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': '<rootDir>/test/__mocks__/styleMock.ts',
    '^.+\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/test/__mocks__/fileMock.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
