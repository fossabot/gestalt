import { defineTest } from 'jscodeshift/dist/testUtils.js';

jest.mock('../add-size-lg', () => {
  return Object.assign(require.requireActual('../add-size-lg'), {
    parser: 'flow',
  });
});

describe('add-size-lg', () => {
  ['add-size-lg'].forEach(test => {
    defineTest(__dirname, 'add-size-lg', { quote: 'single' }, test);
  });
});
