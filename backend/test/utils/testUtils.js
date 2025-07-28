import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as testUtils from './testUtils.js';


// === IMPLEMENTACIONES REALES PARA USO EN TESTS DE INTEGRACIÓN ===
import db from '../../src/config/configDb.js'; // Ajusta la ruta si es necesario
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function clearUsers() {
  await db('users').del();
}

export async function createTestUser({ username = 'test', password = '123456', role = 'user' }) {
  const hashed = await bcrypt.hash(password, 10);
  const [user] = await db('users')
    .insert({ username, password: hashed, role })
    .returning(['id', 'username', 'role']);
  return user;
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'testsecret'
  );
}

vi.mock('bcryptjs', () => ({
    hash: vi.fn(async (pw) => `hashed_${pw}`),
}));
vi.mock('jsonwebtoken', () => ({
    sign: vi.fn((payload) => `token_for_${payload.username}`),
}));
const mockDb = {
    del: vi.fn(),
    insert: vi.fn(() => ({ returning: vi.fn(() => [{ id: 123 }]) })),
};
vi.mock('../../../src/db', () => ({
    default: () => mockDb,
}));

describe('testUtils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('clearUsers should call db delete', async () => {
        mockDb.del.mockResolvedValueOnce();
        await testUtils.clearUsers();
        expect(mockDb.del).toHaveBeenCalled();
    });

    it('createTestUser should hash password and insert user', async () => {
        const userData = { username: 'test', password: 'pw', role: 'admin' };
        mockDb.insert.mockReturnValueOnce({ returning: vi.fn(() => [{ id: 123 }]) });
        const user = await testUtils.createTestUser(userData);
        expect(user).toHaveProperty('id', 123);
        expect(user).toHaveProperty('username', 'test');
        expect(user).toHaveProperty('role', 'admin');
    });

    it('generateToken should return a token', () => {
        const user = { id: 1, username: 'test', role: 'admin' };
        const token = testUtils.generateToken(user);
        expect(token).toBe('token_for_test');
    });
});