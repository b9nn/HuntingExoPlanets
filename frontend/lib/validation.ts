import { z } from 'zod';

export const featureFormSchema = z.object({
  orbital_period_days: z
    .number()
    .min(0.1, 'Orbital period must be at least 0.1 days')
    .max(10000, 'Orbital period must be less than 10,000 days'),
  planetary_radius_re: z
    .number()
    .min(0.1, 'Planetary radius must be at least 0.1 Earth radii')
    .max(50, 'Planetary radius must be less than 50 Earth radii'),
  transit_duration_hours: z
    .number()
    .min(0.1, 'Transit duration must be at least 0.1 hours')
    .max(100, 'Transit duration must be less than 100 hours'),
  transit_depth_ppm: z
    .number()
    .min(1, 'Transit depth must be at least 1 ppm')
    .max(100000, 'Transit depth must be less than 100,000 ppm'),
  teff_k: z
    .number()
    .min(2000, 'Effective temperature must be at least 2,000 K')
    .max(10000, 'Effective temperature must be less than 10,000 K'),
  rstar_rs: z
    .number()
    .min(0.1, 'Stellar radius must be at least 0.1 solar radii')
    .max(50, 'Stellar radius must be less than 50 solar radii'),
  logg: z
    .number()
    .min(0, 'Surface gravity must be at least 0')
    .max(6, 'Surface gravity must be less than 6'),
  modelId: z.string().optional(),
});

export type FeatureFormData = z.infer<typeof featureFormSchema>;
