export default function concessionsForState(state) {
  return Object.fromEntries(
    Object.entries(concessions).filter(([key, value]) =>
      value.crm_district.includes(state),
    ),
  );
}

export const concessions = {
  CDHCC: {
    card_type_desc: "Health Care Card Carer (Child Under 16)  [CD]",
    crm_district: ["NSW"],
    number_format: null,
  },
  CSHC: {
    card_type_desc: "Commonwealth Seniors Health Card",
    crm_district: ["VIC", "SA", "QLD", "NSW"],
    number_format: 1,
  },
  DVAGC: {
    card_type_desc: "DVA Gold Card (Repatriation Health Card)",
    crm_district: ["QLD", "VIC", "SA", "NSW"],
    number_format: null,
  },
  DVAGC_EDA: {
    card_type_desc: "DVA Gold Card (Extreme Disability Adjustment)",
    crm_district: ["NSW", "ACT"],
    number_format: null,
  },
  DVAGC_TPI: {
    card_type_desc: "DVA Gold Card (Special Rate TPI Pension only)",
    crm_district: ["QLD", "VIC", "NSW", "ACT"],
    number_format: null,
  },
  DVAGC_WW: {
    card_type_desc: "DVA Gold Card (War Widows Pension only)",
    crm_district: ["QLD", "NSW", "ACT"],
    number_format: null,
  },
  DVAGEDA: {
    card_type_desc: "DVA Gold Repatriation Health Card (EDA)",
    crm_district: ["SA"],
    number_format: 3,
  },
  DVAGTPI: {
    card_type_desc: "DVA Gold Card (Special Rate TPI Pension only)",
    crm_district: ["SA"],
    number_format: 3,
  },
  DVAGV: {
    card_type_desc: "Dept of Veterans Affairs Gold Card",
    crm_district: ["TAS"],
    number_format: null,
  },
  DVAGWW: {
    card_type_desc: "DVA Gold Repatriation Health Card (War Widow)",
    crm_district: ["SA"],
    number_format: 3,
  },
  DVAPCC: {
    card_type_desc: "DVA Pension Concession Card",
    crm_district: ["VIC", "SA", "QLD", "NSW", "ACT"],
    number_format: 2,
  },
  DVASHC: {
    card_type_desc: "Commonwealth Seniors Health Card",
    crm_district: ["SA"],
    number_format: 1,
  },
  DVPC: {
    card_type_desc: "DVA Pension Concession Card",
    crm_district: ["VIC", "SA", "QLD", "NSW", "TAS", "ACT"],
    number_format: 2,
  },
  GRPHM: {
    card_type_desc: "Group Home",
    crm_district: ["VIC"],
    number_format: null,
  },
  HCC: {
    card_type_desc: "Health Care Card",
    crm_district: ["SA", "NSW", "VIC", "TAS", "ACT", "QLD"],
    number_format: 1,
  },
  IMMIE: {
    card_type_desc: "Immicard (Bridging Visa E)",
    crm_district: ["TAS"],
    number_format: null,
  },
  NZWWP: {
    card_type_desc: "New Zealand War Widow Pension",
    crm_district: ["SA"],
    number_format: 3,
  },
  PCC: {
    card_type_desc: "Pensioner Concession Card",
    crm_district: ["SA", "QLD", "NSW", "VIC", "TAS", "ACT"],
    number_format: 1,
  },
  QGSC: {
    card_type_desc: "Queensland Government Seniors Card",
    crm_district: ["QLD"],
    number_format: null,
  },
  SA_ENERGY: {
    card_type_desc: "South Australia Energy Concession",
    crm_district: ["SA"],
    number_format: 1,
  },
  SA_MHC: {
    card_type_desc: "South Australia Medical Heating and Cooling Concessio",
    crm_district: ["SA"],
    number_format: null,
  },
  SAHCC: {
    card_type_desc: "Health Care Card Sickness Allowance [SA]",
    crm_district: ["NSW"],
    number_format: null,
  },
  SATEMPCONC: {
    card_type_desc: "South Australia Temporary Concession",
    crm_district: ["SA"],
    number_format: 1,
  },
  SCC: {
    card_type_desc: "SA State Concession Card",
    crm_district: ["SA"],
    number_format: 1,
  },
  SLHCC: {
    card_type_desc: "Health Care Card Special Benefit [SP]",
    crm_district: ["NSW"],
    number_format: null,
  },
  SPHCC: {
    card_type_desc: "Health Care Card Special Benefit [SP]",
    crm_district: ["NSW"],
    number_format: null,
  },
  TCC: {
    card_type_desc:
      "Tasmanian Concession Card (Issued by Dept of Premier and Cabinet)",
    crm_district: ["TAS"],
    number_format: null,
  },
  UKWWP: {
    card_type_desc: "British War Widow Pension",
    crm_district: ["SA"],
    number_format: 3,
  },
  DVAUIN: {
    card_type_desc: "DVA Unique Identification Number",
    crm_district: ["VIC"],
    number_format: null,
  },
  NTPCCS: {
    card_type_desc: "Northern Territory Pensioner & Carer Concession Scheme",
    crm_district: ["NT"],
    number_format: null,
  },
  DVAGC_POW: {
    card_type_desc: "DVA Gold Card (Prisoner of War Pension only)",
    crm_district: ["ACT"],
    number_format: 3,
  },
  LSONLY: {
    card_type_desc: "No card with Life Support",
    crm_district: ["ACT"],
    number_format: null,
  },
};
