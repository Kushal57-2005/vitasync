# Stage 3 — Food Catalogue, Barcode Lookup and Nutrition Logging

## Objective

Build a reliable nutrition module that lets users search foods, scan packaged-food barcodes, create custom foods, record meals and calculate consumed calories/macros from explicit nutrition data. No AI is required for barcode lookup or macro calculations.

## Food data strategy

Use separate source strategies:

1. **Packaged foods:** Open Food Facts API lookup by barcode.
2. **Indian raw ingredients:** licensed/usable ICMR-NIN Indian Food Composition Tables data, subject to source terms and permitted redistribution.
3. **Indian prepared recipes:** INDB where access and licence terms permit.
4. **User custom foods:** manually entered from a product label or known recipe.
5. **Manufacturer label verification:** allow a user/admin to record label values and evidence.

Do not assume any source is complete, current or independently verified. Record provenance and licence/source information. Review ODbL obligations before redistributing an adapted Open Food Facts database.

## Food model requirements

A food record should capture:

- Name and normalized search name.
- Brand and product variant, if applicable.
- Barcode/GTIN, if applicable.
- Category and food form (raw, cooked, packaged, recipe).
- Nutrition basis: per 100 g, per 100 ml, per serving, or another explicit basis.
- Energy in kcal, with original source energy value/unit retained where useful.
- Protein, carbohydrates, total fat, fibre and optional saturated fat/sugar/sodium.
- Serving description and serving mass/volume where known.
- Ingredients and allergens where available.
- Source/provider, source URL or source identifier.
- Retrieval timestamp, label/effective date if known.
- Verification status: `VERIFIED_LABEL`, `REFERENCE_DATA`, `COMMUNITY`, `USER_ENTERED`, `ESTIMATED`, `UNVERIFIED`.
- Whether the entry is archived or superseded.

Missing values must remain null, not zero. Zero means the source explicitly reports zero.

## Suggested Prisma models

- `Food`
- `FoodNutrition`
- `FoodSource`
- `FoodNutritionHistory`
- `UserCustomFood`
- `Recipe`
- `RecipeIngredient`
- `FoodLog`
- `MealType`
- `SavedMeal`
- `SavedMealItem`

Ensure global foods and user-owned foods have clear ownership rules. A user must not edit a shared global food record. Custom foods must be scoped to their owner unless deliberately published through an admin workflow.

## Barcode flow

1. Android camera scanner detects a barcode using ML Kit or ZXing.
2. Frontend validates barcode format and sends it to the backend.
3. Backend checks its local product cache.
4. If not cached or stale according to policy, backend calls Open Food Facts.
5. Backend maps only fields actually returned by the API.
6. Backend stores source and retrieval metadata.
7. Frontend displays product name, brand, nutrition basis, macros and verification/source status as plain text.
8. User confirms product/variant and quantity before logging.
9. If not found, offer manual search or label-based custom entry.

Do not call Open Food Facts directly from the app if doing so exposes implementation details or prevents central caching/rate control. Use a backend adapter. Send a clear, compliant User-Agent from the server and respect rate limits and API terms.

## Open Food Facts integration

Use the official product endpoint pattern:

`GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json`

Request only required fields, such as product name, brands, nutriments, serving size, code, ingredients and product image if needed. Handle `status != 1`, HTTP failures, timeouts, rate limits, missing nutriments and malformed records.

Never assume every Indian product is listed. Never fabricate a product or macros when lookup fails.

## Nutrition calculation

Normalize each food's nutrition to a clearly recorded basis. For a food with values per 100 g:

`consumed nutrient = nutrient_per_100g × quantity_g / 100`

For values per 100 ml, use quantity in ml. For serving-based data, convert only when the serving mass/volume is known. If serving conversion is unknown, ask the user to choose the documented serving rather than inventing a gram conversion.

Use decimal-safe arithmetic and a documented rounding policy. Store the quantity and the nutrition snapshot used at log time so later product reformulations do not rewrite historical intake.

## Food log behavior

- Support meal types such as breakfast, lunch, dinner and snacks.
- Allow quantity changes and deletion.
- Snapshot nutrition at time of logging.
- Calculate daily totals from food-log snapshots.
- Support saved meals and recipes.
- Allow duplicate foods in a day.
- Store consumed time in UTC and summarize using the user's timezone.
- Make create/update/delete operations idempotent where practical.

## API design

| Method | Endpoint                   | Purpose                |
| ------ | -------------------------- | ---------------------- |
| GET    | `/foods/search?q=`         | Search catalogue       |
| GET    | `/foods/barcode/:code`     | Barcode lookup         |
| GET    | `/foods/:id`               | Food detail            |
| POST   | `/foods/custom`            | Create custom food     |
| PATCH  | `/foods/custom/:id`        | Edit owned custom food |
| POST   | `/food-logs`               | Add consumed food      |
| GET    | `/food-logs/daily?date=`   | Daily food log         |
| PATCH  | `/food-logs/:id`           | Update log             |
| DELETE | `/food-logs/:id`           | Delete log             |
| GET    | `/nutrition/summary?date=` | Daily macro totals     |
| POST   | `/recipes`                 | Create recipe          |
| POST   | `/saved-meals`             | Save meal              |

## Frontend screens

- Food search with source-aware results.
- Barcode scanner screen with camera permission states.
- Product details and nutrition panel.
- Quantity and unit selector.
- Add-to-meal flow.
- Daily meal timeline.
- Custom food form.
- Recipe builder.
- Saved meals.
- Search empty/error/loading states.

Keep the UI light-only, shadcn/ui-based and mobile-first. Use React Icons. No emoji characters, no dark mode and no live badges.

## Deliverables

- Food and nutrition Prisma models/migrations.
- Open Food Facts adapter and cache.
- Indian food import pipeline with provenance/licence documentation.
- Barcode scanner integration.
- Food search and details UI.
- Custom foods and recipes.
- Food logging and macro calculation service.
- Tests for conversions, missing values, stale data and permissions.

## Acceptance criteria

- A valid known barcode can retrieve a product when it exists in Open Food Facts.
- Unknown barcode returns a useful not-found state, not invented data.
- Missing macros remain unavailable.
- Nutrition values are correctly scaled for consumed quantity.
- Per-100-g, per-100-ml and per-serving bases are not mixed.
- Historical logs preserve the nutrition snapshot used when logged.
- Users cannot modify other users' custom foods or logs.
- Daily totals respect the user's timezone.
- External API errors and rate limits are handled gracefully.
- Source and verification information is visible to users.

## In-depth AI coding prompt

> Implement Stage 3 of VitaSync after inspecting the current repository, Prisma schema and API conventions. Build a source-aware food catalogue and nutrition logging system. Do not use AI or LLMs for barcode lookup, nutrition extraction or macro arithmetic.
>
> Integrate Open Food Facts through a backend adapter using its official barcode product endpoint. Add request timeouts, error handling, rate-limit handling, a compliant User-Agent, field mapping, cache behavior and provenance. Handle products not found and incomplete nutrition records without fabricating values. Keep the API key-free read flow configurable and respect the current API terms and rate limits.
>
> Create normalized Prisma models for foods, nutrition, sources, nutrition history, user custom foods, recipes, recipe ingredients, food logs, meal types and saved meals. Record nutrition basis explicitly. Preserve the nutrition snapshot and source used at the moment of food logging so later product changes do not mutate historical records. Use Decimal-safe calculations and clear units.
>
> Add an import pipeline for Indian reference foods only after checking the source's access and redistribution terms. Record source and licence metadata. Do not scrape sites without permission or imply that community data is verified. Add verification states and keep null values distinct from zero.
>
> Implement food search, barcode lookup, food details, custom food creation, recipes, saved meals, food logs and daily macro summaries. Build a Capacitor-compatible barcode scanner using ML Kit or ZXing, including camera permission and denial flows. Build accessible light-mode screens using shadcn/ui, Tailwind and React Icons. Do not add dark mode, emojis or live badges.
>
> Write tests for barcode not-found, malformed responses, API timeout, rate limiting, null nutrient values, per-100-g/per-100-ml/per-serving conversions, decimal rounding, food-log snapshots, timezone boundaries and cross-user access. Run all relevant tests and report actual results.

## Out of scope

AI food photo recognition, automatic recipe inference, AI diet recommendations, predictive analytics and meal planning.
