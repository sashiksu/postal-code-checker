import { resetActiveData } from "./activeData";

/**
 * Discards any active `configure()` overrides and restores the bundled
 * default dataset.
 *
 * Primary use cases:
 * - **Test teardown.** `afterEach(resetConfig)` keeps configurations from
 *   leaking between tests.
 * - **Scenario switching.** Demos or feature-flag-driven UIs that swap
 *   datasets at runtime can reset before applying a new config.
 * - **Hot module reloading.** Reset before re-applying the dev-time config
 *   so stale overrides don't accumulate.
 *
 * Calling `resetConfig()` without a prior `configure()` is a no-op.
 */
export const resetConfig = (): void => {
  resetActiveData();
};
