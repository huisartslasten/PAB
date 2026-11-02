# PacoGO — C3 Descriptive Coding Reliability Layer v0.1

Status: Candidate / design-only / [O]

## Purpose

The pilot report must measure agreement between independent coders without collapsing their original records. The report layer therefore pairs coding records only when the same observation and coding round contain exactly two distinct coders.

## Pairing rule

A reliability pair is defined by:

`observation_id + coding_round + exactly 2 distinct coder_id values`

Groups with duplicate coding by the same coder, more than two coders, or only one coder remain visible as `unpaired_groups` and are not silently treated as agreement data.

## Descriptive outputs

For each paired coding sample the report provides:

- number of double-coded observations;
- number and identity of unpaired groups at the structural level;
- pairwise agreement rates for target match, performance, process, independence and evidence quality;
- pairwise confusion matrices for target match, performance and process.

The confusion matrices are coder-to-coder matrices. They are not frequency tables of a variable against itself.

## Scientific boundary

This layer is descriptive. It does not select a universal reliability statistic or threshold. The C3 protocol explicitly leaves the appropriate reliability statistic and minimum criterion dependent on the coding scale and study design.

It also does not infer developmental position, mastery, developmental ordering, prerequisite status or curriculum promotion.

Independent coder records remain immutable inputs. Agreement is calculated from the paired records rather than replacing them with an adjudicated value.
