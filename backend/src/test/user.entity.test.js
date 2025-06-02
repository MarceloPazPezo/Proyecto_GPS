import { describe, it, expect } from 'vitest';
import UserSchema from '../entity/user.entity.js';

describe('UserSchema Entity', () => {
    it('should have correct entity name and table name', () => {
        expect(UserSchema.options.name).toBe('User');
        expect(UserSchema.options.tableName).toBe('users');
    });

    it('should define all required columns with correct properties', () => {
        const columns = UserSchema.options.columns;

        expect(columns).toHaveProperty('id');
        expect(columns.id.type).toBe('int');
        expect(columns.id.primary).toBe(true);
        expect(columns.id.generated).toBe(true);

        expect(columns).toHaveProperty('nombreCompleto');
        expect(columns.nombreCompleto.type).toBe('varchar');
        expect(columns.nombreCompleto.length).toBe(255);
        expect(columns.nombreCompleto.nullable).toBe(false);

        expect(columns).toHaveProperty('rut');
        expect(columns.rut.type).toBe('varchar');
        expect(columns.rut.length).toBe(12);
        expect(columns.rut.nullable).toBe(false);
        expect(columns.rut.unique).toBe(true);

        expect(columns).toHaveProperty('email');
        expect(columns.email.type).toBe('varchar');
        expect(columns.email.length).toBe(255);
        expect(columns.email.nullable).toBe(false);
        expect(columns.email.unique).toBe(true);

        expect(columns).toHaveProperty('rol');
        expect(columns.rol.type).toBe('varchar');
        expect(columns.rol.length).toBe(50);
        expect(columns.rol.nullable).toBe(false);

        expect(columns).toHaveProperty('password');
        expect(columns.password.type).toBe('varchar');
        expect(columns.password.nullable).toBe(false);

        expect(columns).toHaveProperty('createdAt');
        expect(columns.createdAt.type).toBe('timestamp with time zone');
        expect(typeof columns.createdAt.default).toBe('function');
        expect(columns.createdAt.nullable).toBe(false);

        expect(columns).toHaveProperty('updatedAt');
        expect(columns.updatedAt.type).toBe('timestamp with time zone');
        expect(typeof columns.updatedAt.default).toBe('function');
        expect(columns.updatedAt.onUpdate).toBe('CURRENT_TIMESTAMP');
        expect(columns.updatedAt.nullable).toBe(false);
    });

    it('should define correct indices', () => {
        const indices = UserSchema.options.indices;
        expect(indices).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'IDX_USER',
                    columns: ['id'],
                    unique: true,
                }),
                expect.objectContaining({
                    name: 'IDX_USER_RUT',
                    columns: ['rut'],
                    unique: true,
                }),
                expect.objectContaining({
                    name: 'IDX_USER_EMAIL',
                    columns: ['email'],
                    unique: true,
                }),
            ])
        );
    });
});