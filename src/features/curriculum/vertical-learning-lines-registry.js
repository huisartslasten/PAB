const OBJECTIVE_STATUSES = Object.freeze(['active', 'planned', 'retired']);
const COVERAGE_STATUSES = Object.freeze(['full', 'partial', 'not_demonstrated', 'unassessed']);
const EXERCISES = Object.freeze([
  {
    "id": "fr2-equivalence-practice",
    "label": "FR2 — breukequivalentie oefenen",
    "topic": "curriculum",
    "route": {
      "page": "curriculum-fr2-practice-learner.html"
    },
    "kind": "formative_curriculum_practice"
  },
  {
    "id": "unequal-denominator-guided-addition",
    "label": "Ongelijknamige breuken kleiner dan 1 optellen — met stappenplan",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "unequal-denominator-guided-addition"
    },
    "kind": "practice_route"
  },
  {
    "id": "unequal-denominator-guided-mixed-addition",
    "label": "Ongelijknamige breuken met uitkomst groter dan 1 optellen — met stappenplan",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "unequal-denominator-guided-mixed-addition"
    },
    "kind": "practice_route"
  },
  {
    "id": "unequal-independent-addition",
    "label": "Ongelijknamige breuken zelfstandig optellen",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "unequal-independent-addition"
    },
    "kind": "practice_route"
  },
  {
    "id": "unequal-mixed-addition",
    "label": "Ongelijknamige gemengde getallen optellen",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "unequal-mixed-addition"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-minus-mixed-subtraction",
    "label": "Een breukgetal groter dan 1 aftrekken van een heel getal",
    "topic": "aftrekken",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "aftrekken",
      "exercise": "whole-minus-mixed-subtraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-minus-greater-than-one-subtraction",
    "label": "Heel getal min breukgetal groter dan 1 — visueel oefenen",
    "topic": "aftrekken",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "aftrekken",
      "exercise": "whole-minus-greater-than-one-subtraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "like-denominator-subtraction",
    "label": "Gelijknamige breuken kleiner dan 1 aftrekken",
    "topic": "aftrekken",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "aftrekken",
      "exercise": "like-denominator-subtraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-like-denominator-subtraction",
    "label": "Gelijknamige breuken groter dan 1 aftrekken",
    "topic": "aftrekken",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "aftrekken",
      "exercise": "mixed-like-denominator-subtraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "unlike-denominator-subtraction",
    "label": "Ongelijknamige breuken kleiner dan 1 aftrekken",
    "topic": "aftrekken",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "aftrekken",
      "exercise": "unlike-denominator-subtraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "unlike-mixed-denominator-subtraction",
    "label": "Ongelijknamige breuken groter dan 1 aftrekken",
    "topic": "aftrekken",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "aftrekken",
      "exercise": "unlike-mixed-denominator-subtraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-number-divided-by-fraction-greater-than-one-guided",
    "label": "Heel getal delen door breukgetal groter dan 1 — met stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "whole-number-divided-by-fraction-greater-than-one-guided"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-number-divided-by-fraction-greater-than-one",
    "label": "Heel getal delen door breukgetal groter dan 1 — zonder stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "whole-number-divided-by-fraction-greater-than-one"
    },
    "kind": "practice_route"
  },
  {
    "id": "like-denominator-division-guided",
    "label": "Gelijknamige breuken delen — met stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "like-denominator-division-guided"
    },
    "kind": "practice_route"
  },
  {
    "id": "like-denominator-division",
    "label": "Gelijknamige breuken delen — zonder stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "like-denominator-division"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-like-denominator-division-guided",
    "label": "Gelijknamige breuken groter dan 1 delen — met stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "mixed-like-denominator-division-guided"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-like-denominator-division",
    "label": "Gelijknamige breuken groter dan 1 delen — zonder stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "mixed-like-denominator-division"
    },
    "kind": "practice_route"
  },
  {
    "id": "unlike-denominator-division-guided",
    "label": "Ongelijknamige breuken kleiner dan 1 delen — met stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "unlike-denominator-division-guided"
    },
    "kind": "practice_route"
  },
  {
    "id": "unlike-denominator-division",
    "label": "Ongelijknamige breuken kleiner dan 1 delen — zonder stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "unlike-denominator-division"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-unlike-denominator-division-guided",
    "label": "Ongelijknamige breuken groter dan 1 delen — met stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "mixed-unlike-denominator-division-guided"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-unlike-denominator-division",
    "label": "Ongelijknamige breuken groter dan 1 delen — zonder stappenplan",
    "topic": "delen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "delen",
      "exercise": "mixed-unlike-denominator-division"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-number-times-proper-fraction",
    "label": "Heel getal vermenigvuldigen met een breuk kleiner dan 1",
    "topic": "vermenigvuldigen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "vermenigvuldigen",
      "exercise": "whole-number-times-proper-fraction"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-number-times-mixed-fraction-greater-than-one",
    "label": "Heel getal vermenigvuldigen met een breuk groter dan 1",
    "topic": "vermenigvuldigen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "vermenigvuldigen",
      "exercise": "whole-number-times-mixed-fraction-greater-than-one"
    },
    "kind": "practice_route"
  },
  {
    "id": "like-denominator-multiplication",
    "label": "Gelijknamige breuken vermenigvuldigen",
    "topic": "vermenigvuldigen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "vermenigvuldigen",
      "exercise": "like-denominator-multiplication"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-like-denominator-multiplication",
    "label": "Gelijknamige breuken groter dan 1 vermenigvuldigen",
    "topic": "vermenigvuldigen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "vermenigvuldigen",
      "exercise": "mixed-like-denominator-multiplication"
    },
    "kind": "practice_route"
  },
  {
    "id": "unlike-denominator-multiplication",
    "label": "Ongelijknamige breuken vermenigvuldigen",
    "topic": "vermenigvuldigen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "vermenigvuldigen",
      "exercise": "unlike-denominator-multiplication"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-unlike-denominator-multiplication",
    "label": "Ongelijknamige breuken groter dan 1 vermenigvuldigen",
    "topic": "vermenigvuldigen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "vermenigvuldigen",
      "exercise": "mixed-unlike-denominator-multiplication"
    },
    "kind": "practice_route"
  },
  {
    "id": "whole-number-mixed-addition",
    "label": "Heel getal optellen bij een gemengde breuk",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "whole-number-mixed-addition"
    },
    "kind": "practice_route"
  },
  {
    "id": "same-denominator-addition",
    "label": "Gelijknamige breuken optellen",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "same-denominator-addition"
    },
    "kind": "practice_route"
  },
  {
    "id": "mixed-same-denominator-addition",
    "label": "Gelijknamige breuken groter dan 1 optellen",
    "topic": "optellen",
    "route": {
      "page": "skills.html",
      "domain": "fractions",
      "topic": "optellen",
      "exercise": "mixed-same-denominator-addition"
    },
    "kind": "practice_route"
  }
]);
const CURRICULUM_SKILLS = Object.freeze([
  Object.freeze({id:'FR1',name:'Breuken representeren en interpreteren',status:'definition_only_unregistered',note:'Bestaande skilldefinitie uit eerdere curriculumafspraken; formeel Development/Claim/Evidence/Task-contract niet teruggevonden.'}),
  Object.freeze({id:'FR2',name:'Breukequivalentie herkennen en gebruiken',status:'candidate_registered',developments:Object.freeze([
    Object.freeze({id:'FR2.D1',name:'Equivalentie herkennen'}),Object.freeze({id:'FR2.D2',name:'Equivalentie verklaren'}),Object.freeze({id:'FR2.D3',name:'Equivalentie functioneel gebruiken'})
  ]),claims:Object.freeze(['FR2.C1','FR2.C2','FR2.C3']),evidence_targets:Object.freeze(['FR2.ET1','FR2.ET2','FR2.ET3','FR2.ET4','FR2.ET5','FR2.ET6']),task_models:Object.freeze(['FR2.TM1','FR2.TM2','FR2.TM3','FR2.TM4','FR2.TM5']),note:'Candidate registry; bestaande task/evidence-alignmentvragen blijven open.'})
]);
const OBJECTIVES = Object.freeze([
  {
    "id": "FR-0002",
    "domain": "Breuken",
    "slo_group": 2,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "In betekenisvolle situaties verhoudingsgewijs vergelijken en ordenen.",
    "source_pdf_page": 77,
    "source_reference": "SLO 2017, PDF p.77",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. Contextuele verhoudingstaken ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0003",
    "domain": "Breuken",
    "slo_group": 2,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Situaties of afbeeldingen herkennen waarin verhoudingen niet kloppen.",
    "source_pdf_page": 77,
    "source_reference": "SLO 2017, PDF p.77",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. Er is geen taak die onjuiste verhoudingen in betekenisvolle situaties/afbeeldingen laat herkennen.",
    "status": "active"
  },
  {
    "id": "FR-0004",
    "domain": "Breuken",
    "slo_group": 3,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Kwalitatieve verhoudingen in betekenisvolle contexten onder woorden brengen.",
    "source_pdf_page": 85,
    "source_reference": "SLO 2017, PDF p.85",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. Verwoorden van kwalitatieve verhoudingen ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0005",
    "domain": "Breuken",
    "slo_group": 4,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Eenvoudige verhoudingen in betekenisvolle contexten onder woorden brengen.",
    "source_pdf_page": 94,
    "source_reference": "SLO 2017, PDF p.94",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0006",
    "domain": "Breuken",
    "slo_group": 4,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "De helft van een geheel begrijpen.",
    "source_pdf_page": 94,
    "source_reference": "SLO 2017, PDF p.94",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Een bruikbare representatie bestaat; een doelgerichte taak voor de betekenis van de helft ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0007",
    "domain": "Breuken",
    "slo_group": 4,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "De helft van een hoeveelheid begrijpen.",
    "source_pdf_page": 94,
    "source_reference": "SLO 2017, PDF p.94",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. De benodigde half-van-een-hoeveelheidstaak ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0008",
    "domain": "Breuken",
    "slo_group": 4,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Eenvoudige verhoudingsproblemen met aantallen/prijzen oplossen via verdubbelen, halveren en vermenigvuldigen.",
    "source_pdf_page": 94,
    "source_reference": "SLO 2017, PDF p.94",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. Context, strategiegebruik en verwoorden ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0009",
    "domain": "Breuken",
    "slo_group": 4,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Verhoudingstabellen gebruiken.",
    "source_pdf_page": 94,
    "source_reference": "SLO 2017, PDF p.94",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0010",
    "domain": "Breuken",
    "slo_group": 5,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Betekenis van heel, half, kwart, halveren, verdubbelen, deel en geheel begrijpen.",
    "source_pdf_page": 99,
    "source_reference": "SLO 2017, PDF p.99",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Visuele bouwstenen bestaan; begrips- en contexttaken voor de volledige begrippenreeks ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0011",
    "domain": "Breuken",
    "slo_group": 5,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Een kwart van één geheel begrijpen.",
    "source_pdf_page": 102,
    "source_reference": "SLO 2017, PDF p.102",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Renderer aanwezig; taakinhoud ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0012",
    "domain": "Breuken",
    "slo_group": 5,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Een kwart van een hoeveelheid begrijpen.",
    "source_pdf_page": 102,
    "source_reference": "SLO 2017, PDF p.102",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0013",
    "domain": "Breuken",
    "slo_group": 5,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Eenvoudige verhoudingsproblemen oplossen met een verhoudingstabel.",
    "source_pdf_page": 102,
    "source_reference": "SLO 2017, PDF p.102",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0014",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Breuken lezen, uitspreken en noteren met horizontale en schuine breuknotatie; teller/noemer in context verwoorden.",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR1"
    ],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Notatie en invoer bestaan; hardop lezen, uitspreken en betekenis in context zijn niet systematisch getoetst.",
    "status": "active"
  },
  {
    "id": "FR-0015",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Eenheidsbreuken, niet-stambreuken, hele breuken en samengestelde breuken herkennen.",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR1"
    ],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De vormen komen in opgaven voor; expliciete herkenning en betekenisverklaring ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0016",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Breuken als maatverfijning in meetsituaties begrijpen en resultaat als samengestelde breuk uitdrukken.",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0017",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Relaties tussen stambreuken, niet-stambreuken en samengestelde breuken met dezelfde noemer begrijpen.",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "same-denominator-addition",
      "like-denominator-subtraction",
      "like-denominator-multiplication"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Bewerkingen zijn aanwezig, maar het expliciete relatiebegrip wordt niet afzonderlijk aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0018",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Veel voorkomende benoemde breuken vergelijken en ordenen en hierover redeneren.",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0001",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Breuken op een getallenlijn plaatsen",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR1"
    ],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. Een generieke getallenlijn is geen geïntegreerde Fraction Number Line Learning Interface.",
    "status": "active"
  },
  {
    "id": "FR-0019",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Kritisch denken en redeneren over breuken als getallen in probleemsituaties.",
    "source_pdf_page": 107,
    "source_reference": "SLO 2017, PDF p.107",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0020",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Breuken aanvullen tot 1 in contextsituaties en formele sommentaal.",
    "source_pdf_page": 109,
    "source_reference": "SLO 2017, PDF p.109",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0021",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Rekenen met de breuk als operator in informele contextsituaties.",
    "source_pdf_page": 109,
    "source_reference": "SLO 2017, PDF p.109",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "whole-number-times-proper-fraction"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De formele rekenvorm bestaat; de informele contextbetekenis ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0022",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Verhoudingstabellen interpreteren en gebruiken om verhoudingen weer te geven en te vergelijken.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0023",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Eenvoudige verhoudingen in alledaagse situaties herkennen.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0024",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Een breuk als deel van een hoeveelheid en als deel van een geheel begrijpen.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR1"
    ],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Representatiebouwstenen bestaan; een samenhangende hoeveelheid-/geheel-leerroute ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0025",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Objecten/hoeveelheden in gelijke delen verdelen en het resultaat als breuk benoemen en weergeven.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Interactie bestaat; algemene constructie- en betekenisroute ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0026",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Een deel aanvullen tot een geheel en het complement als breuk benoemen.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0027",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Een deel van een hoeveelheid berekenen en vanuit een gegeven deel het totaal terugvinden.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR1"
    ],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De formele operatorberekening is aanwezig; omgekeerd redeneren en context zijn niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0028",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Verhoudingsproblemen met geld, tijd en maten oplossen.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0029",
    "domain": "Breuken",
    "slo_group": 6,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Kritisch denken en redeneren over breuken als verhoudingsgetal in betekenisvolle probleemsituaties.",
    "source_pdf_page": 110,
    "source_reference": "SLO 2017, PDF p.110",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0030",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Verschillende verschijningsvormen van breuken begrijpen: deel van geheel, meetresultaat, delingsresultaat, rekengetal en verhouding; voorbeelden kunnen noemen.",
    "source_pdf_page": 115,
    "source_reference": "SLO 2017, PDF p.115",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR1"
    ],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Enkele representaties en bewerkingen bestaan; meetresultaat, delingsresultaat en verhouding zijn niet als samenhangende betekenissen afgedekt.",
    "status": "active"
  },
  {
    "id": "FR-0031",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Relatie tussen breuken en decimale getallen begrijpen en veel voorkomende breuken/decimalen omzetten.",
    "source_pdf_page": 115,
    "source_reference": "SLO 2017, PDF p.115",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0032",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Samengestelde breuken vergelijken en ordenen en uitleggen waarom de volgorde klopt.",
    "source_pdf_page": 115,
    "source_reference": "SLO 2017, PDF p.115",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0033",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Breuken vereenvoudigen, hele delen eruit halen en bepalen of een breuk maximaal vereenvoudigd is.",
    "source_pdf_page": 115,
    "source_reference": "SLO 2017, PDF p.115",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "unequal-denominator-guided-addition",
      "unequal-denominator-guided-mixed-addition",
      "unequal-independent-addition",
      "unequal-mixed-addition",
      "unlike-denominator-division"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De reken-/invoerhandeling bestaat; zelfstandige herkenning en redenering over maximale vereenvoudiging zijn niet breed aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0034",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Gelijkwaardige breuken bedenken (compliceren).",
    "source_pdf_page": 115,
    "source_reference": "SLO 2017, PDF p.115",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR2"
    ],
    "exercise_ids": [
      "fr2-equivalence-practice"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Een beperkte constructiepraktijk bestaat; generalisatie en formele evidence-dekking zijn niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0035",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Getalbegrip",
    "objective": "Kritisch denken en redeneren over breuken als getallen in probleemsituaties.",
    "source_pdf_page": 115,
    "source_reference": "SLO 2017, PDF p.115",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0036",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Gelijknamige breuken optellen en aftrekken in context en formele rekentaal; indien nodig hele delen eruit halen.",
    "source_pdf_page": 117,
    "source_reference": "SLO 2017, PDF p.117",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "same-denominator-addition",
      "mixed-same-denominator-addition",
      "like-denominator-subtraction",
      "mixed-like-denominator-subtraction"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Formele berekening bestaat; contextuele toepassing en formeel SLO-bewijs ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0037",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Veel voorkomende ongelijknamige breuken vergelijken en het verschil bepalen.",
    "source_pdf_page": 117,
    "source_reference": "SLO 2017, PDF p.117",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "unlike-denominator-subtraction"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Verschilberekening kan worden geoefend; expliciet vergelijken en redeneren zijn niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0038",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Rekenen met veel voorkomende breuken als operator en begrijpen dat keer en deel nemen van dezelfde uitkomst geven.",
    "source_pdf_page": 117,
    "source_reference": "SLO 2017, PDF p.117",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "whole-number-times-proper-fraction"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Formele vermenigvuldiging bestaat; betekenisvergelijking ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0039",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Weten dat een deling als breuk geschreven kan worden, dit uitleggen en toepassen.",
    "source_pdf_page": 117,
    "source_reference": "SLO 2017, PDF p.117",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0040",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "In contexten een heel getal delen door een breuk.",
    "source_pdf_page": 117,
    "source_reference": "SLO 2017, PDF p.117",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "whole-number-divided-by-fraction-greater-than-one-guided",
      "whole-number-divided-by-fraction-greater-than-one"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De formele deling bestaat; contextuele interpretatie ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0041",
    "domain": "Breuken",
    "slo_group": 7,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Kritisch denken en redeneren over breuken in betekenisvolle probleemsituaties.",
    "source_pdf_page": 117,
    "source_reference": "SLO 2017, PDF p.117",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0042",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Ongelijknamige breuken optellen en aftrekken via de standaardprocedure gelijknamig maken; hele delen eruit halen en vereenvoudigen; aanpak uitleggen.",
    "source_pdf_page": 127,
    "source_reference": "SLO 2017, PDF p.127",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "same-denominator-addition",
      "mixed-same-denominator-addition",
      "like-denominator-subtraction",
      "mixed-like-denominator-subtraction"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De formele procedure en stapbegeleiding zijn aanwezig; contextuele transfer, uitlegkwaliteit en formele evidence-dekking ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0043",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Een geheel getal vermenigvuldigen met een breuk en een breuk met een geheel getal vermenigvuldigen.",
    "source_pdf_page": 127,
    "source_reference": "SLO 2017, PDF p.127",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "whole-number-times-proper-fraction",
      "whole-number-times-mixed-fraction-greater-than-one"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Rekenfamilies bestaan; contextuele toepassing en de volledige omgekeerde presentatie zijn niet als SLO-dekking aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0044",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Een breuk met een breuk vermenigvuldigen in contexten en formele sommentaal.",
    "source_pdf_page": 127,
    "source_reference": "SLO 2017, PDF p.127",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "like-denominator-multiplication",
      "mixed-like-denominator-multiplication",
      "unlike-denominator-multiplication",
      "mixed-unlike-denominator-multiplication"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Formele bewerking bestaat; contextuele toepassing ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0045",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Een heel getal delen door een breuk of gemengde breuk, vooral in contexten.",
    "source_pdf_page": 127,
    "source_reference": "SLO 2017, PDF p.127",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "whole-number-divided-by-fraction-greater-than-one-guided",
      "whole-number-divided-by-fraction-greater-than-one"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Formele deling bestaat; contextuele probleeminterpretatie ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0046",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Een breuk delen door een breuk, vooral in contexten.",
    "source_pdf_page": 127,
    "source_reference": "SLO 2017, PDF p.127",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [
      "like-denominator-division-guided",
      "like-denominator-division",
      "unlike-denominator-division-guided",
      "unlike-denominator-division",
      "mixed-like-denominator-division-guided",
      "mixed-like-denominator-division",
      "mixed-unlike-denominator-division-guided",
      "mixed-unlike-denominator-division"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. De symbolische deling en stapbegeleiding bestaan; contextuele taakvormen en formeel bewijs ontbreken.",
    "status": "active"
  },
  {
    "id": "FR-0047",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Bewerkingen",
    "objective": "Kritisch denken en redeneren over breuken in betekenisvolle probleemsituaties.",
    "source_pdf_page": 127,
    "source_reference": "SLO 2017, PDF p.127",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0048",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Een telling verwoorden/noteren als verhouding, breuk en percentage (zoals 6 van 24, 1 op 4, 1/4 en 25%).",
    "source_pdf_page": 129,
    "source_reference": "SLO 2017, PDF p.129",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Breukequivalentie is aanwezig; telling/verhouding/percentage-integratie ontbreekt.",
    "status": "active"
  },
  {
    "id": "FR-0049",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Gelijkwaardigheid van breuken begrijpen als gelijkheid van verhoudingen tussen teller en noemer.",
    "source_pdf_page": 129,
    "source_reference": "SLO 2017, PDF p.129",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [
      "FR2"
    ],
    "exercise_ids": [
      "fr2-equivalence-practice"
    ],
    "coverage_status": "partial",
    "coverage_note": "Gedeeltelijk. Equivalentieherkenning bestaat; de verhouding tussen teller en noemer en de formele evidence-koppeling zijn niet volledig aangetoond.",
    "status": "active"
  },
  {
    "id": "FR-0050",
    "domain": "Breuken",
    "slo_group": 8,
    "slo_source": "SLO 2017",
    "slo_component": "Verhoudingen",
    "objective": "Relaties tussen verhoudingen, breuken, procenten en decimale getallen begrijpen; breukdeling kan een repeterend decimaal opleveren.",
    "source_pdf_page": 129,
    "source_reference": "SLO 2017, PDF p.129",
    "source_wording": "samenvatting uit PacoGO traceability-inventaris; geen woordelijk citaat",
    "related_skill_ids": [],
    "exercise_ids": [],
    "coverage_status": "not_demonstrated",
    "coverage_note": "Niet aangetoond. De conversie, delingsbetekenis en repeterende decimalen ontbreken in de breukleerroute.",
    "status": "active"
  }
].map(Object.freeze));

function validateObjective(objective, seenIds, exerciseIds) {
  if (!objective || typeof objective !== 'object') throw new TypeError('Curriculum objective must be an object.');
  if (!/^FR-\\d{4}$/.test(objective.id || '')) throw new Error('Curriculum objective ID must use the FR-0000 format.');
  if (seenIds.has(objective.id)) throw new Error(`Duplicate curriculum objective ID: ${objective.id}`);
  seenIds.add(objective.id);
  for (const field of ['domain', 'slo_source', 'slo_component', 'objective', 'source_reference']) if (!String(objective[field] || '').trim()) throw new Error(`Curriculum objective requires ${field}.`);
  if (!Number.isInteger(objective.slo_group) || objective.slo_group < 1 || objective.slo_group > 8) throw new Error('Curriculum objective SLO group must be an integer from 1 to 8.');
  if (!OBJECTIVE_STATUSES.includes(objective.status)) throw new Error('Curriculum objective status is invalid.');
  if (!COVERAGE_STATUSES.includes(objective.coverage_status)) throw new Error('Curriculum objective coverage status is invalid.');
  if (!Array.isArray(objective.exercise_ids) || objective.exercise_ids.some(id => !exerciseIds.has(id))) throw new Error('Curriculum objective references an unknown exercise.');
  if (!Array.isArray(objective.related_skill_ids)) throw new Error('Curriculum objective related_skill_ids must be an array.');
}
export function createVerticalLearningLinesRegistry({ objectives = OBJECTIVES, exercises = EXERCISES } = {}) {
  if (!Array.isArray(objectives) || !Array.isArray(exercises)) throw new TypeError('Curriculum objectives and exercises must be arrays.');
  const seenIds=new Set(), exerciseIds=new Set(exercises.map(exercise=>exercise.id));
  objectives.forEach(objective=>validateObjective(objective,seenIds,exerciseIds));
  const records=objectives.map(objective=>Object.freeze({...objective,exercise_ids:Object.freeze([...objective.exercise_ids]),related_skill_ids:Object.freeze([...objective.related_skill_ids])}));
  const byId=new Map(records.map(objective=>[objective.id,objective]));
  const exerciseById=new Map(exercises.map(exercise=>[exercise.id,Object.freeze(exercise)]));
  return Object.freeze({
    schema_version:'1.1.0',
    listObjectives:({domain,group}={})=>records.filter(o=>(!domain||o.domain===domain)&&(!group||o.slo_group===group)).slice().sort((a,b)=>a.slo_group-b.slo_group||a.id.localeCompare(b.id,'nl')),
    getObjective:id=>byId.get(id)||null,
    listDomains:()=>[...new Set(records.map(o=>o.domain))].sort((a,b)=>a.localeCompare(b,'nl')),
    listExercises:()=>[...exerciseById.values()],
    listCurriculumSkills:()=>CURRICULUM_SKILLS,
    getExercise:id=>exerciseById.get(id)||null,
    getCoverageSummary:({domain}={})=>{const selected=records.filter(o=>!domain||o.domain===domain);return {objectives:selected.length,linkedObjectives:selected.filter(o=>o.exercise_ids.length).length,unlinkedObjectives:selected.filter(o=>!o.exercise_ids.length).length,partial:selected.filter(o=>o.coverage_status==='partial').length,notDemonstrated:selected.filter(o=>o.coverage_status==='not_demonstrated').length,full:selected.filter(o=>o.coverage_status==='full').length,unassessed:selected.filter(o=>o.coverage_status==='unassessed').length,exerciseLinks:selected.reduce((n,o)=>n+o.exercise_ids.length,0)};}
  });
}
export const verticalLearningLinesRegistry=createVerticalLearningLinesRegistry();
