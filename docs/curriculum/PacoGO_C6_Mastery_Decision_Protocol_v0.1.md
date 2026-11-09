# PacoGO Curriculum — C6 Mastery Decision Protocol v0.1

Status: candidate protocol
Datum: 2026-11-02

## 1. Doel

C6 specificeert hoe PacoGO een claim-specifieke mastery-inferentie mag formuleren nadat voldoende evidence is verzameld en beoordeeld.

C6 is een empirisch te toetsen beslisprotocol. Het maakt nog geen runtime-masteryregel en verandert geen curriculumregistry.

## 2. Mastery is geen score

Mastery is:

- claim-specifiek;
- development-specifiek;
- scope-specifiek;
- tijdgebonden;
- gebaseerd op meerdere evidence-eigenschappen.

Percentage correct, taakmoeilijkheid of één enkele observatie is op zichzelf onvoldoende.

## 3. Zeven expliciete mastery-gates

De kandidaatregel gebruikt zeven afzonderlijk zichtbare voorwaarden:

1. **M1 Relevantie** — het beschikbare evidence is daadwerkelijk relevant voor de claim.
2. **M2 Kwaliteit** — het evidence is technisch en inhoudelijk voldoende betrouwbaar.
3. **M3 Coverage** — vooraf vastgelegde evidence-dekking is bereikt.
4. **M4 Stabiliteit** — de prestatie/inferentie is voldoende stabiel binnen de vooraf gedefinieerde tijdscope.
5. **M5 Onafhankelijkheid** — het bewijs is niet slechts herhaling van hetzelfde afhankelijke signaal.
6. **M6 Variatie** — het patroon houdt stand over vooraf gedefinieerde relevante taak-/representatievariatie.
7. **M7 Contradictiecontrole** — relevante tegenstrijdige evidence is afwezig of voldoende verklaard binnen de scope.

De engine krijgt de eisen voor coverage en scope expliciet aangeleverd. Er worden geen verborgen drempels toegevoegd. De waargenomen coverage mag hoger zijn dan de minimale vereiste coverage; de vereiste waarde is een ondergrens, geen bovengrens.

## 4. Uitkomsten

C6 kent vijf mogelijke uitkomsten:

- `MASTERED`
- `NOT YET MASTERED`
- `INSUFFICIENT EVIDENCE`
- `CONTRADICTORY`
- `NOT ASSESSED`

### MASTERED

Alle zeven gates zijn expliciet voldaan en de beschikbare developmental inference is voldoende ondersteunend binnen de gedefinieerde scope.

### NOT YET MASTERED

Er is voldoende informatie om een mastery-beslissing te nemen, maar minstens één expliciet beoordeelde mastery-gate is niet voldaan.

### INSUFFICIENT EVIDENCE

Een noodzakelijke gate of inference kan nog niet betrouwbaar worden beoordeeld, bijvoorbeeld doordat coverage, stabiliteit of developmental inference nog onvoldoende is vastgesteld.

### CONTRADICTORY

Er is relevante tegenstrijdige evidence die binnen de huidige scope niet voldoende kan worden verklaard.

### NOT ASSESSED

Er is nog geen bruikbare mastery-assessment beschikbaar.

## 5. Geen automatische promotie

Een C6-uitkomst betekent niet automatisch:

- curriculumregistry-promotie;
- wijziging van een bestaande masteryregel;
- wijziging van developmental ordering;
- unlock van een volgende development;
- automatische instructie- of taakselectie.

C6 levert een expliciete kandidaat-inferentie die later empirisch gevalideerd moet worden.

## 6. Beslisvolgorde

De engine hanteert een vaste volgorde:

```text
geen assessment
→ NOT ASSESSED

onopgeloste contradictie
→ CONTRADICTORY

vereiste evidence / gate / inference ontbreekt of is niet bepaalbaar
→ INSUFFICIENT EVIDENCE

één of meer expliciet beoordeelde gates falen
→ NOT YET MASTERED

alle zeven gates voldaan + ondersteunende inference
→ MASTERED
```

Deze volgorde voorkomt dat een positieve score een onopgeloste contradictie overschrijft.

## 7. Wat C6 nog niet beweert

C6 bepaalt nog niet:

- welke coverage-drempel universeel optimaal is;
- hoeveel tijd nodig is voor stabiliteit;
- welke variatie minimaal noodzakelijk is;
- welke combinatie van evidence het meest voorspellend is;
- of mastery een unidimensionele toestand is;
- welke masteryregel per skill of development het beste werkt.

Deze vragen behoren tot empirische validatie en modelvergelijking.

## 8. Owner-approved Stage C record boundary

**Owner decision, 2026-11-08:** the C6 evaluation is a distinct immutable logical record with its own identity. It is separate from the immutable decision snapshot it evaluates and from the distinct C7 decision record that may later consume it.

The C6 evaluation record must preserve:
- the complete six-part branch identity;
- the exact immutable decision snapshot reference;
- the exact eligible observation and target-assessment references consumed;
- C6 protocol/version provenance;
- all seven existing gate outcomes and their explicit reasons/trace;
- the resulting existing C6 mastery outcome.

The C6 evaluation is committed atomically as its own record. C7 may consume only this exact committed C6 result; it may not recompute mastery or reconstruct missing branch, snapshot or evaluation identity. If a later C7 write fails, the committed C6 evaluation remains unchanged and available for a C7 retry.

This is a logical record/ordering decision within O7's existing decision-evaluation idempotency boundary. It does not create another top-level O7 boundary and does not combine C6 and C7 into one indivisible write.

**Still open:** final field names and physical identity namespace/uniqueness, canonical payload equality details, physical keys/tables, transaction technology, retry/concurrency mechanics and persistence implementation. These are not defined by this protocol amendment.

## 9. Technische contractgrens

De C6-engine mag een deterministische kandidaatuitkomst berekenen uit expliciet aangeleverde assessmentgegevens.

De engine mag geen ontbrekende evidence invullen, geen drempels raden en geen curriculumstatus muteren.

De output bevat daarom naast de mastery-state ook de status van iedere gate en de expliciete redenen voor de beslissing.
