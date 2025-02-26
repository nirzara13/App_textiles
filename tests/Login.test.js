// tests/Login.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from '../src/views/Login.vue'
import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'

// Mock axios
vi.mock('axios')

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/dashboard', name: 'Dashboard' }]
})

describe('LoginPage', () => {
  it('valide le format email', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalidemail')
    await emailInput.trigger('input')

    expect(wrapper.vm.emailError).toBeTruthy()

    await emailInput.setValue('valid@email.com')
    await emailInput.trigger('input')
    expect(wrapper.vm.emailError).toBeFalsy()
  })

  it('affiche/masque le mot de passe', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })

    const passwordInput = wrapper.find('input[type="password"]')
    const toggleButton = wrapper.find('.toggle-password')

    await toggleButton.trigger('click')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)

    await toggleButton.trigger('click')
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('gère la soumission du formulaire', async () => {
    const mockResponse = {
      data: {
        token: 'fake-token'
      }
    }
    axios.post.mockResolvedValueOnce(mockResponse)

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        email: 'test@example.com',
        password: 'password123'
      }
    )
  })
})