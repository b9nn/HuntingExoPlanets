export const MISSIONS = [
  { value: 'kepler', label: 'Kepler', description: 'Kepler Space Telescope' },
  { value: 'k2', label: 'K2', description: 'Kepler K2 Mission' },
  { value: 'tess', label: 'TESS', description: 'Transiting Exoplanet Survey Satellite' },
] as const;

export const PREDICTION_CLASSES = [
  { 
    value: 'confirmed', 
    label: 'Confirmed', 
    color: 'bg-green-500',
    description: 'Confirmed exoplanet with high confidence'
  },
  { 
    value: 'candidate', 
    label: 'Candidate', 
    color: 'bg-yellow-500',
    description: 'Potential exoplanet requiring further validation'
  },
  { 
    value: 'false_positive', 
    label: 'False Positive', 
    color: 'bg-red-500',
    description: 'Not an exoplanet - likely stellar variability or other phenomena'
  },
] as const;

export const FEATURE_LABELS = {
  orbital_period_days: 'Orbital Period (days)',
  transit_duration_hours: 'Transit Duration (hours)',
  planetary_radius_re: 'Planetary Radius (Earth radii)',
  transit_depth_ppm: 'Transit Depth (ppm)',
  teff_k: 'Effective Temperature (K)',
  rstar_rs: 'Stellar Radius (solar radii)',
  logg: 'Surface Gravity (log g)',
  feh: 'Metallicity [Fe/H]',
} as const;

export const FEATURE_DESCRIPTIONS = {
  orbital_period_days: 'Time for planet to complete one orbit around its host star',
  transit_duration_hours: 'Duration of the transit event when planet passes in front of star',
  planetary_radius_re: 'Radius of the planet relative to Earth\'s radius',
  transit_depth_ppm: 'Fractional decrease in stellar brightness during transit',
  teff_k: 'Effective temperature of the host star in Kelvin',
  rstar_rs: 'Radius of the host star relative to the Sun\'s radius',
  logg: 'Surface gravity of the host star (logarithmic scale)',
  feh: 'Metallicity of the host star relative to the Sun',
} as const;

export const API_ENDPOINTS = {
  health: '/health',
  models: '/models',
  metrics: '/metrics',
  features: '/features',
  predict: '/predict',
  dataset: '/dataset',
  shapSample: '/shap/sample',
} as const;

export const DEFAULT_BACKEND_URL = 'http://localhost:8000';
