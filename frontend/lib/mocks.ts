import { 
  HealthResponse, 
  ModelInfo, 
  MetricsResponse, 
  FeaturesResponse, 
  PredictResponse, 
  DatasetResponse,
  DatasetRow,
  ShapSample 
} from './types';

export const mockHealth: HealthResponse = {
  status: 'ok',
  last_ingest_iso: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
};

export const mockModels: ModelInfo[] = [
  {
    id: 'stacking',
    name: 'Stacking Ensemble',
    metrics: { accuracy: 0.87, precision: 0.85, recall: 0.86, f1: 0.85 }
  },
  {
    id: 'random_forest',
    name: 'Random Forest',
    metrics: { accuracy: 0.85, precision: 0.83, recall: 0.84, f1: 0.83 }
  },
  {
    id: 'extra_trees',
    name: 'Extra Trees',
    metrics: { accuracy: 0.84, precision: 0.82, recall: 0.83, f1: 0.82 }
  },
  {
    id: 'random_subspace',
    name: 'Random Subspace',
    metrics: { accuracy: 0.83, precision: 0.81, recall: 0.82, f1: 0.81 }
  },
  {
    id: 'adaboost',
    name: 'AdaBoost',
    metrics: { accuracy: 0.82, precision: 0.80, recall: 0.81, f1: 0.80 }
  }
];

export const mockMetrics: MetricsResponse = {
  overall: { accuracy: 0.85, precision: 0.83, recall: 0.84, f1: 0.83 },
  perModel: {
    stacking: { accuracy: 0.87, precision: 0.85, recall: 0.86, f1: 0.85 },
    random_forest: { accuracy: 0.85, precision: 0.83, recall: 0.84, f1: 0.83 },
    extra_trees: { accuracy: 0.84, precision: 0.82, recall: 0.83, f1: 0.82 },
    random_subspace: { accuracy: 0.83, precision: 0.81, recall: 0.82, f1: 0.81 },
    adaboost: { accuracy: 0.82, precision: 0.80, recall: 0.81, f1: 0.80 }
  },
  confusionMatrix: [
    [1200, 85, 45],   // confirmed: true_pos, false_neg, false_neg
    [78, 950, 32],    // candidate: false_pos, true_pos, false_neg
    [42, 28, 800]     // false_positive: false_pos, false_pos, true_pos
  ]
};

export const mockFeatures: FeaturesResponse = {
  importances: [
    { name: 'orbital_period_days', importance: 0.24 },
    { name: 'transit_depth_ppm', importance: 0.22 },
    { name: 'planetary_radius_re', importance: 0.18 },
    { name: 'transit_duration_hours', importance: 0.16 },
    { name: 'teff_k', importance: 0.12 },
    { name: 'rstar_rs', importance: 0.08 },
    { name: 'logg', importance: 0.06 },
    { name: 'feh', importance: 0.04 }
  ]
};

export const mockPredict: PredictResponse = {
  prediction: 'confirmed',
  probabilities: {
    confirmed: 0.72,
    candidate: 0.23,
    false_positive: 0.05
  },
  shap: [
    { feature: 'orbital_period_days', value: 365.25, contribution: 0.15 },
    { feature: 'transit_depth_ppm', value: 1200, contribution: 0.12 },
    { feature: 'planetary_radius_re', value: 1.2, contribution: 0.08 },
    { feature: 'transit_duration_hours', value: 13.5, contribution: 0.06 },
    { feature: 'teff_k', value: 5778, contribution: 0.04 },
    { feature: 'rstar_rs', value: 1.0, contribution: 0.02 },
    { feature: 'logg', value: 4.44, contribution: 0.01 },
    { feature: 'feh', value: 0.0, contribution: 0.00 }
  ],
  rationale: 'Strong transit signal with Earth-like orbital period and reasonable planetary radius. Transit depth and duration are consistent with a confirmed exoplanet.'
};

// Generate mock dataset rows
const generateMockDatasetRow = (id: number, mission: 'kepler' | 'k2' | 'tess'): DatasetRow => {
  const labels: Array<'confirmed' | 'candidate' | 'false_positive'> = ['confirmed', 'candidate', 'false_positive'];
  const label = labels[id % 3];
  
  return {
    id: `mock-${id}`,
    mission,
    orbital_period_days: Math.random() * 500 + 1,
    transit_duration_hours: Math.random() * 20 + 1,
    planetary_radius_re: Math.random() * 10 + 0.1,
    transit_depth_ppm: Math.random() * 5000 + 100,
    teff_k: Math.random() * 4000 + 3000,
    rstar_rs: Math.random() * 2 + 0.5,
    logg: Math.random() * 2 + 4,
    feh: Math.random() * 1 - 0.5,
    label
  };
};

export const mockDataset: DatasetResponse = {
  rows: Array.from({ length: 100 }, (_, i) => {
    const missions: Array<'kepler' | 'k2' | 'tess'> = ['kepler', 'k2', 'tess'];
    const mission = missions[i % 3];
    return generateMockDatasetRow(i, mission);
  }),
  total: 100
};

export const mockShapSample: ShapSample[] = Array.from({ length: 10 }, (_, i) => ({
  id: `shap-${i}`,
  shap: mockFeatures.importances.map(f => ({
    feature: f.name,
    value: Math.random() * 1000,
    contribution: (Math.random() - 0.5) * 0.3
  }))
}));

export const mockPredictWithFeatures = (features: Record<string, number>): PredictResponse => {
  // Simple heuristic based on features
  const period = features.orbital_period_days || 0;
  const depth = features.transit_depth_ppm || 0;
  const radius = features.planetary_radius_re || 0;
  
  let prediction: 'confirmed' | 'candidate' | 'false_positive';
  let probabilities: PredictResponse['probabilities'];
  
  if (depth > 1000 && radius > 0.5 && period > 10 && period < 1000) {
    prediction = 'confirmed';
    probabilities = { confirmed: 0.75, candidate: 0.20, false_positive: 0.05 };
  } else if (depth > 500 && radius > 0.3) {
    prediction = 'candidate';
    probabilities = { confirmed: 0.30, candidate: 0.60, false_positive: 0.10 };
  } else {
    prediction = 'false_positive';
    probabilities = { confirmed: 0.10, candidate: 0.20, false_positive: 0.70 };
  }
  
  return {
    prediction,
    probabilities,
    shap: Object.entries(features).map(([feature, value]) => ({
      feature,
      value,
      contribution: (Math.random() - 0.5) * 0.2
    })),
    rationale: `Based on orbital period of ${period.toFixed(1)} days, transit depth of ${depth.toFixed(0)} ppm, and planetary radius of ${radius.toFixed(1)} Earth radii.`
  };
};
