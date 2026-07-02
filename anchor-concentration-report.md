# Anchor Concentration Report

Sample: 10000 deterministic generations from current commit. Percentages below are calculated **within each dominant anchor bucket**, not across the global sample.

| Anchor | Sample count | Top interpretation | Top strategy | Top carrier | Top composition | Top environment | Unique interpretations | Unique strategies | Unique carriers | Unique compositions | Unique environments |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| class_conflict | 1228 | class pressure (14.17%) | anticipation (9.53%) | relationship (12.7%) | body-led threshold anticipation frame (1.14%) | public hall where attention can turn (8.79%) | 8 | 12 | 9 | 315 | 19 |
| current_danger | 1490 | pursuit (10.74%) | public_role (9.33%) | environment (12.75%) | institutional held-breath centered frame (0.74%) | community room under moral pressure (8.86%) | 10 | 12 | 9 | 320 | 18 |
| forbidden_power | 1859 | concealment (11.24%) | social_exchange (9.31%) | relationship (12%) | witnessed offset pause before action (0.75%) | community room under moral pressure (8.66%) | 10 | 12 | 9 | 323 | 20 |
| personal_contradiction | 2266 | public restraint (11.92%) | interrupted_action (9.53%) | public_judgment (12.27%) | environment-framed character-between-community-and-threat composition (0.71%) | public hall where attention can turn (8.69%) | 10 | 12 | 9 | 324 | 20 |
| profession | 77 | contested work (14.29%) | interrupted_action (12.99%) | public_judgment (16.88%) | threshold composition around official, witness, dependent, and status object (5.19%) | sealed civic threshold (10.39%) | 8 | 12 | 9 | 69 | 20 |
| relationship | 1278 | dependence (10.88%) | aftermath (10.09%) | relationship (13.62%) | witnessed formal frontality under pressure (0.86%) | public steps before a judging crowd (9.55%) | 10 | 12 | 9 | 321 | 20 |
| social_duty | 1260 | protection (10.87%) | anticipation (10%) | environment (13.1%) | witnessed threshold anticipation frame (0.87%) | community room under moral pressure (9.29%) | 10 | 12 | 9 | 319 | 20 |
| species_presence | 542 | reach problem (13.28%) | hidden_observation (11.07%) | public_judgment (14.02%) | witnessed shadowed side composition (1.66%) | sealed civic threshold (9.23%) | 8 | 12 | 9 | 262 | 15 |

## Assertions

- Top interpretation within anchor <= 18%
- Top strategy within anchor <= 18%
- Top conflict carrier within anchor <= 22%
- Top composition within anchor <= 22%
- Top environment within anchor <= 18%

Result: PASS

- No per-anchor concentration assertion failed.

## Note on Previous 0.16% Metric

The previously reported 0.16% top anchor-composition pair was a global frequency over the 10,000-result sample. This report corrects concentration by calculating top composition and environment percentages inside each dominant-anchor bucket.
