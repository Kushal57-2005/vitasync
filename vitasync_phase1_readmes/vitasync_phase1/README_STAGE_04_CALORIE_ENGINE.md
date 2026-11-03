# Stage 4 — Calorie, Energy Balance and Macro Target Engine

## Objective

Implement transparent and testable calculations for BMR, estimated TDEE, calorie targets, energy balance and macro targets. The engine must distinguish food intake from energy expenditure and avoid double-counting wearable activity.

## Principles

- Every displayed calculation must identify whether it is measured, imported, estimated or user-configured.
- BMR is an estimate, not a direct measurement.
- Wearable calorie estimates are uncertain.
- Active calories are not total daily energy expenditure.
- Never calculate deficit as food intake minus wearable active calories alone.
- Never add exercise calories to a TDEE estimate if the chosen activity multiplier already includes that exercise.
- Do not promise a precise weight-loss rate from a calorie equation.

## BMR

Use Mifflin–St Jeor where the required inputs are available.

For a male formula constant:

`BMR = 10 × weightKg + 6.25 × heightCm − 5 × ageYears + 5`

For a female formula constant:

`BMR = 10 × weightKg + 6.25 × heightCm − 5 × ageYears − 161`

If the user does not provide the required formula input or does not want to select a sex-specific formula, offer a clearly explained alternative or mark the estimate unavailable. Do not silently guess.

Validate units, age and measurement ranges. Use a selected, dated weight measurement and record which inputs were used.

## TDEE strategies

Implement one selected strategy at a time:

### Strategy A: Activity multiplier

`estimatedTDEE = estimatedBMR × activityMultiplier`

The multiplier represents overall activity, including exercise. Do not add imported exercise calories on top.

### Strategy B: Component-based estimate

`estimatedTDEE = estimatedRestingEnergy + estimatedNonExerciseActivity + estimatedExerciseEnergy + thermicEffectIfModeled`

Use this only when data sources support the components and overlap can be controlled. Document whether each input is active energy, total energy or exercise-session energy.

The user or product configuration selects the strategy. Do not mix strategies in one day's calculation.

## Health data reconciliation

Health Connect can expose different energy record types depending on source and permissions. Map records with explicit semantics:

- Basal/resting energy.
- Active energy.
- Exercise-session energy, if separately available.
- Total energy, if provided by a source.

Do not add exercise-session calories to active energy if the source's active-energy record already includes the session. Do not add total energy to BMR. Create source-specific reconciliation rules and record which records were included/excluded and why.

If there is not enough trustworthy data to compute component-based TDEE, use the configured activity multiplier and label the result as an estimate.

## Energy balance

`energyBalanceKcal = foodIntakeKcal - estimatedTdeeKcal`

A negative value indicates estimated deficit; a positive value indicates estimated surplus.

Display the components separately:

- Food calories consumed.
- Estimated BMR/resting energy.
- Activity estimate or activity multiplier.
- Estimated TDEE.
- Estimated energy balance.

Do not label `food intake - active calories` as a deficit.

## Calorie targets

Allow users to set or select a target. Provide conservative guardrails and warnings for unusually low targets. Do not prescribe aggressive deficits or guarantee a rate of weight loss. If a target is derived from estimated TDEE, store the calculation inputs, method, date and user confirmation.

## Macro targets

Support user-defined grams for protein, carbohydrates and fat. Validate non-negative values. Optionally derive calories from macros using the conventional 4/4/9 kcal-per-gram approximation, but explain that label rounding, fibre and energy conversion rules can cause differences from listed calories.

Do not automatically prescribe medical or therapeutic diets.

## Data models

Suggested additions:

- `EnergyEstimate`
- `EnergyEstimateInput`
- `CalorieTargetHistory`
- `MacroTargetHistory`
- `DailyNutritionSummary` (optional cache/materialized summary)
- `CalculationAudit`

Store:

- Method name/version.
- Input measurement IDs and timestamps.
- Formula parameters.
- Included/excluded activity record IDs.
- Result and units.
- Calculated timestamp.
- Confidence/quality notes where appropriate.

## API design

| Method | Endpoint                   | Purpose               |
| ------ | -------------------------- | --------------------- |
| POST   | `/energy/bmr/estimate`     | Estimate BMR          |
| POST   | `/energy/tdee/estimate`    | Estimate TDEE         |
| GET    | `/energy/daily?date=`      | Daily energy summary  |
| PUT    | `/users/me/goals/calories` | Update calorie target |
| PUT    | `/users/me/goals/macros`   | Update macro targets  |
| GET    | `/nutrition/targets?date=` | Read active targets   |
| GET    | `/energy/history`          | Historical estimates  |

## Acceptance criteria

- Formula unit tests cover valid and invalid inputs.
- The calculation method is stored with every estimate.
- Activity multiplier mode does not add exercise calories again.
- Component mode prevents overlap/double counting.
- Active calories are never represented as total TDEE.
- Missing inputs produce a clear unavailable state.
- Historical estimates can be reproduced from saved inputs.
- Calorie targets and macro targets are user-specific.
- UI labels estimates clearly and does not imply laboratory accuracy.

## In-depth AI coding prompt

> Implement Stage 4 of VitaSync as a standalone, well-tested calculation domain. Inspect the existing food log, profile, goal and activity models first. Do not implement vague calorie arithmetic in UI components; centralize calculation logic in typed backend services with unit tests.
>
> Implement Mifflin–St Jeor BMR estimation with validated age, height, weight and formula selection. Store the exact input measurement references, formula version, result, date and method. Handle missing or undisclosed formula inputs honestly rather than guessing.
>
> Implement two mutually exclusive TDEE strategies: activity-multiplier mode and component-based mode. In activity-multiplier mode, the multiplier already represents total activity; do not add exercise calories. In component-based mode, explicitly reconcile resting, active, exercise and total energy records from Health Connect. Avoid adding exercise-session energy when it is already included in active energy, and never add total energy to BMR. If data semantics are unclear, exclude the record and disclose the limitation.
>
> Implement energy balance as food intake minus estimated TDEE. Show intake, estimated resting energy, activity method, TDEE and balance separately. Never call food intake minus active calories a calorie deficit. Allow user-configured calorie and macro targets with validation and history.
>
> Add auditability: save calculation method/version, inputs, source record IDs, timestamps, units and exclusions so results can be explained and reproduced. Use Decimal-safe arithmetic and documented rounding. Build light-mode UI with shadcn/ui and React Icons; no dark mode, emojis or live badges.
>
> Write comprehensive tests for formula values, unit errors, missing inputs, timezone boundaries, multiplier/component strategy separation, double-counting, imported data overlap, negative/positive energy balance and target validation. Run tests and report exact outcomes.

## Out of scope

Medical diagnosis, disease-specific nutrition, guaranteed weight-loss predictions and AI coaching.
