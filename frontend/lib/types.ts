export type Metrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
};

export type ModelInfo = {
  id: string;
  name: string;
  metrics: Metrics;
};

export type PredictBody = {
  modelId?: string;
  features: Record<string, number>;
};

export type PredictResponse = {
  prediction: 'confirmed' | 'candidate' | 'false_positive';
  probabilities: {
    confirmed: number;
    candidate: number;
    false_positive: number;
  };
  shap?: Array<{
    feature: string;
    value: number;
    contribution: number;
  }>;
  rationale?: string;
};

export type HealthResponse = {
  status: string;
  last_ingest_iso: string;
};

export type MetricsResponse = {
  overall: Metrics;
  perModel: Record<string, Metrics>;
  confusionMatrix: number[][];
};

export type FeaturesResponse = {
  importances: Array<{
    name: string;
    importance: number;
  }>;
};

export type DatasetRow = {
  id: string;
  mission: 'kepler' | 'k2' | 'tess';
  orbital_period_days: number;
  transit_duration_hours: number;
  planetary_radius_re: number;
  transit_depth_ppm: number;
  teff_k: number;
  rstar_rs: number;
  logg: number;
  feh: number;
  label: 'confirmed' | 'candidate' | 'false_positive';
  [key: string]: any;
};

export type DatasetResponse = {
  rows: DatasetRow[];
  total: number;
  classCounts?: { confirmed: number; candidate: number; false_positive: number };
};

export type ShapSample = {
  id: string;
  shap: Array<{
    feature: string;
    value: number;
    contribution: number;
  }>;
};

export type Mission = 'kepler' | 'k2' | 'tess';

export type PredictionClass = 'confirmed' | 'candidate' | 'false_positive';

export type FeatureFormData = {
  koi_period: number;      // orbital_period_days
  koi_prad: number;        // planetary_radius_re
  koi_duration: number;    // transit_duration_hours
  koi_depth: number;       // transit_depth_ppm
  koi_steff: number;       // teff_k
  koi_srad: number;        // rstar_rs
  koi_slogg: number;       // logg
  modelId?: string;
};

export type ClassificationHistory = {
  id: string;
  timestamp: string;
  features: FeatureFormData;
  result: PredictResponse;
};
