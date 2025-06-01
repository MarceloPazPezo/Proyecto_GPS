// tests/entities/UserSchema.spec.js (o .ts)

import { describe, it, expect } from 'vitest';
import UserSchemaDefinition from './user.entity.js'

describe('Esquema de Entidad de Usuario (UserSchema)', () => {
  const schema = UserSchemaDefinition.options;

  it('debería tener el nombre de entidad correcto', () => {
    expect(schema.name).toBe('User');
  });

  it('debería tener el nombre de tabla correcto en la base de datos', () => {
    expect(schema.tableName).toBe('users');
  });

  describe('Definición de Columnas', () => {
    it('debería tener todas las columnas esperadas definidas', () => {
      const columnasEsperadas = [
        'id',
        'nombreCompleto',
        'rut',
        'email',
        'rol',
        'password',
        'createdAt',
        'updatedAt',
      ];
      expect(Object.keys(schema.columns)).toEqual(
        expect.arrayContaining(columnasEsperadas)
      );
      expect(Object.keys(schema.columns).length).toBe(columnasEsperadas.length);
    });

    describe('Columna "id"', () => {
      const columna = schema.columns.id;
      it('debería ser de tipo "int"', () => {
        expect(columna.type).toBe('int');
      });
      it('debería ser la clave primaria', () => {
        expect(columna.primary).toBe(true);
      });
      it('debería ser generada automáticamente', () => {
        expect(columna.generated).toBe(true);
      });
    });

    describe('Columna "nombreCompleto"', () => {
      const columna = schema.columns.nombreCompleto;
      it('debería ser de tipo "varchar"', () => {
        expect(columna.type).toBe('varchar');
      });
      it('debería tener una longitud de 255', () => {
        expect(columna.length).toBe(255);
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
    });

    describe('Columna "rut"', () => {
      const columna = schema.columns.rut;
      it('debería ser de tipo "varchar"', () => {
        expect(columna.type).toBe('varchar');
      });
      it('debería tener una longitud de 12', () => {
        expect(columna.length).toBe(12);
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
      it('debería tener un valor único', () => {
        expect(columna.unique).toBe(true);
      });
    });

    describe('Columna "email"', () => {
      const columna = schema.columns.email;
      it('debería ser de tipo "varchar"', () => {
        expect(columna.type).toBe('varchar');
      });
      it('debería tener una longitud de 255', () => {
        expect(columna.length).toBe(255);
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
      it('debería tener un valor único', () => {
        expect(columna.unique).toBe(true);
      });
    });

    describe('Columna "rol"', () => {
      const columna = schema.columns.rol;
      it('debería ser de tipo "varchar"', () => {
        expect(columna.type).toBe('varchar');
      });
      it('debería tener una longitud de 50', () => {
        expect(columna.length).toBe(50);
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
    });

    describe('Columna "password"', () => {
      const columna = schema.columns.password;
      it('debería ser de tipo "varchar"', () => {
        expect(columna.type).toBe('varchar');
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
    });

    describe('Columna "createdAt"', () => {
      const columna = schema.columns.createdAt;
      it('debería ser de tipo "timestamp with time zone"', () => {
        expect(columna.type).toBe('timestamp with time zone');
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
      it('debería tener un valor por defecto que sea CURRENT_TIMESTAMP', () => {
        expect(typeof columna.default).toBe('function');
        expect(columna.default()).toBe('CURRENT_TIMESTAMP');
      });
    });

    describe('Columna "updatedAt"', () => {
      const columna = schema.columns.updatedAt;
      it('debería ser de tipo "timestamp with time zone"', () => {
        expect(columna.type).toBe('timestamp with time zone');
      });
      it('no debería permitir valores nulos', () => {
        expect(columna.nullable).toBe(false);
      });
      it('debería tener un valor por defecto que sea CURRENT_TIMESTAMP', () => {
        expect(typeof columna.default).toBe('function');
        expect(columna.default()).toBe('CURRENT_TIMESTAMP');
      });
      it('debería actualizarse a CURRENT_TIMESTAMP en cada actualización', () => {
        expect(columna.onUpdate).toBe('CURRENT_TIMESTAMP');
      });
    });
  });

  describe('Definición de Índices', () => {
    it('debería tener el número correcto de índices definidos', () => {
      expect(schema.indices).toBeInstanceOf(Array);
      expect(schema.indices.length).toBe(3);
    });

    it('debería definir el índice "IDX_USER" correctamente', () => {
      const indice = schema.indices.find(i => i.name === 'IDX_USER');
      expect(indice).toBeDefined();
      if (indice) {
        expect(indice.columns).toEqual(['id']);
        expect(indice.unique).toBe(true);
      }
    });

    it('debería definir el índice "IDX_USER_RUT" correctamente', () => {
      const indice = schema.indices.find(i => i.name === 'IDX_USER_RUT');
      expect(indice).toBeDefined();
      if (indice) {
        expect(indice.columns).toEqual(['rut']);
        expect(indice.unique).toBe(true);
      }
    });

    it('debería definir el índice "IDX_USER_EMAIL" correctamente', () => {
      const indice = schema.indices.find(i => i.name === 'IDX_USER_EMAIL');
      expect(indice).toBeDefined();
      if (indice) {
        expect(indice.columns).toEqual(['email']);
        expect(indice.unique).toBe(true);
      }
    });
  });
});