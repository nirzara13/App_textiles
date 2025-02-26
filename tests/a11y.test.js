// tests/a11y.test.js
import { axe } from 'jest-axe';
import { mount } from '@vue/test-utils';
import Dashboard from '../src/views/Dashboard.vue';

describe('Accessibilité Tests', () => {
  it('Dashboard devrait être accessible', async () => {
    const wrapper = mount(Dashboard);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});