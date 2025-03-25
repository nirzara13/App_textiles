// setup-tests.js
import { vi } from 'vitest';

// Mock pour localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn().mockImplementation((key) => {
      return 'mock-token'; // Retourne un token factice pour les tests
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
});

// Mock pour SweetAlert2
global.Swal = {
  fire: vi.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true, value: {} })),
  mixin: vi.fn().mockReturnValue({
    fire: vi.fn().mockResolvedValue({})
  }),
  DismissReason: {
    cancel: 'cancel'
  }
};

// Empêche les erreurs console.error de l'application de polluer les résultats de test
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Vue Router warn') || args[0].includes('Vue warn'))
  ) {
    return; // Supprimer les avertissements de Vue Router
  }
  originalConsoleError(...args);
};

// Ajout de polyfills requis pour le DOM
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: vi.fn() });
}

// Configuration par défaut des tests
vi.stubGlobal('matchMedia', () => ({
  matches: false,
  addListener: vi.fn(),
  removeListener: vi.fn()
}));