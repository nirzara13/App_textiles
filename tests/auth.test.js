// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Auth Controller Tests', () => {
  let token;
  let userId;

  // Test d'inscription
  it('devrait créer un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        username: 'testuser',
        email: 'test@test.com',
        password: 'TestPass12@@'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  // Test de connexion
  it('devrait connecter un utilisateur', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@test.com',
        password: 'TestPass12@@'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  // Test des favoris
  it('devrait ajouter un favori', async () => {
    const res = await request(app)
      .post('/api/users/favorites/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});