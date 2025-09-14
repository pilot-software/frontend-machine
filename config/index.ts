import { getRuntimeConfig } from "../lib/runtimeConfig";

const currentConfig = getRuntimeConfig();
export const features = currentConfig.features;
export const text = currentConfig.text;

export type { FeatureConfig, TextConfig } from "./features";
export type { HospitalType } from "../lib/runtimeConfig";
