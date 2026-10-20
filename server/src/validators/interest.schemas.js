import { z } from 'zod';

export const sendInterestSchema = z.object({
  targetProfileId: z.string().uuid('A valid target profile id is required.'),
});

export const legacyInterestParamsSchema = z.object({
  id: z.string().uuid('A valid sender id is required.'),
  targetId: z.string().uuid('A valid target profile id is required.'),
});

export const interestIdParamsSchema = z.object({
  id: z.string().uuid('A valid interest id is required.'),
});

export const updateInterestSchema = z.object({
  status: z.enum(['accepted', 'declined']),
});
