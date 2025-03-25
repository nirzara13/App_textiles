// // jest.config.js
// module.exports = {
//     moduleFileExtensions: ['js', 'vue'],
//     transform: {
//       '^.+\\.vue$': '@vue/vue3-jest',
//       '^.+\\.js$': 'babel-jest',
//     },
//     moduleNameMapper: {
//       '^@/(.*)$': '<rootDir>/src/$1'
//     },
//     testEnvironment: 'jsdom',
//     testMatch: ['**/__tests__/**/*.js', '**/*.spec.js'],
//     setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
//     collectCoverage: true,
//     collectCoverageFrom: [
//       'src/components/**/*.{js,vue}',
//       'src/views/**/*.{js,vue}',
//       '!**/node_modules/**'
//     ]
//   };





//Le changement du code pour les tests unitaires




// jest.config.mjs
export default {
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1'
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.spec.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  collectCoverage: true,
  collectCoverageFrom: [
    'frontend/src/components/**/*.{js,vue}',
    'frontend/src/views/**/*.{js,vue}',
    '!**/node_modules/**'
  ]
};