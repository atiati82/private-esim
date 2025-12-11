import { describe, expect, test } from 'vitest';

import { getRelationIdVal } from '@/payload/utils/data-utils';

describe('Payload Utils', function () {
  describe('getRelatedId())', () => {
    const objWithRelation = { region: { id: 'europe' } };
    const objWithRelationId = { region: 'europe' };
    const objNoRelation = { region: null };

    test('should get related id', () => {
      expect(getRelationIdVal(objWithRelation.region)).toEqual('europe');
      expect(getRelationIdVal(objWithRelationId.region)).toEqual('europe');
      expect(getRelationIdVal(objNoRelation.region)).toEqual(undefined);
      expect(getRelationIdVal(undefined)).toEqual(undefined);
    });
  });
});
