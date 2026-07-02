# Warlock Environment Root Cause

## Root Cause

The collapse first happened in `directVisual() -> chooseEnvironment()`. Before this patch, `chooseEnvironment` returned `classEnvironment(seed)` whenever profession salience did not allow environment control. Trace salience disables profession environment control, so every Human Warlock trace case bypassed world/environment candidates and returned the Warlock class fallback: `sealed civic threshold`.

This was not caused by profession salience candidate filtering, score ties, or the world environment picker. The resolver still selected varied `world.environment` facts, but Visual Director discarded them for trace/background/secondary professions.

## Before-Fix Candidate Example

| Candidate environment | Score | Reason |
| --- | --- | --- |
| sealed civic threshold | 100 | returned immediately by chooseEnvironment because trace salience sets environmentControlAllowed=false |

## After-Fix Candidate Score Example

Seed: `warlock-env-v2-0`

| Candidate environment | Score | Reasons |
| --- | --- | --- |
| forest track | 69 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| rain-dark doorway | 63 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| low ferry crossing | 87 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| quiet parish room | 57 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| archive alley | 79 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| workroom edge | 54 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| market threshold | 66 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| market threshold under social pressure | 86 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| quiet parish room with a private witness | 69 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| rain-dark doorway with no clear permission | 74 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| low ferry crossing under a withheld debt | 68 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |
| workroom edge around a dangerous token | 57 | role neutral_stage; obstacle expression time_limit; strategy movement_through_space; class warlock |

## Scope Check

The bug was strongest for Warlock because its class fallback was `sealed civic threshold`, but the same architecture also made every low-salience class lean toward its class fallback environment instead of using a scored environment pool.
