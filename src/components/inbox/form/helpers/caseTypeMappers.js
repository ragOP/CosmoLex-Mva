// Case type field mappers for different case types
// Maps Excel field names to backend keys

// Common answer options with label and value structure
const ANSWER_OPTIONS = {
  YES_NO: [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 },
  ],
  DRIVER_PASSENGER: [
    { label: 'Driver', value: 'Driver' },
    { label: 'Passenger', value: 'Passenger' },
  ],
  EMPLOYMENT_STATUS: [
    { label: 'Employed', value: 'Employed' },
    { label: 'Unemployed', value: 'Unemployed' },
    { label: 'Self-employed', value: 'Self-employed' },
  ],
  MARITAL_STATUS: [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
  ],
  EDUCATION_LEVEL: [
    { label: 'High School', value: 'High School' },
    { label: 'College', value: 'College' },
    { label: 'Graduate School', value: 'Graduate School' },
    { label: 'Other', value: 'Other' },
  ],
  EMPLOYMENT_TYPE: [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Temporary', value: 'Temporary' },
  ],
  SALARY_TYPE: [
    { label: 'Hourly', value: 'Hourly' },
    { label: 'Salary', value: 'Salary' },
    { label: 'Commission', value: 'Commission' },
    { label: 'Other', value: 'Other' },
  ],
};

// Grid configuration for field sizing (MUI Grid v2 system)
const GRID_CONFIG = {
  FULL_WIDTH: { size: { xs: 12 } }, // Full width (12 columns)
  HALF_WIDTH: { size: { xs: 12, sm: 6 } }, // Half width (6 columns on small+)
  QUARTER_WIDTH: { size: { xs: 12, sm: 6, md: 4 } }, // Minimum 6 columns (2 per row)
  THIRD_WIDTH: { size: { xs: 12, sm: 6, md: 4 } }, // Minimum 6 columns (2 per row)
};

// Section configuration
const SECTIONS = {
  PERSONAL_INFO: 'Personal Information',
  ACCIDENT_INFO: 'Accident Information',
  VEHICLE_INFO: 'Vehicle Information',
  INSURANCE_INFO: 'Insurance Information',
  INJURY_INFO: 'Injuries and Medical Treatment',
  WAGES_INFO: 'Lost Wages',
  REPRESENTATION_INFO: 'Representation',
};

const CASE_TYPE_FIELD_MAPPERS = {
  // Auto Accident
  'Auto Accident': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Accident Information Section
    [SECTIONS.ACCIDENT_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'When did the accident occur?': {
      key: 'accident_date',
      type: 'date',
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Where did the accident occur?': {
      key: 'accident_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },

    'How did the accident occur?': {
      key: 'accident_details',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'What was your role (driver or passenger) when the incident occurred?': {
      key: 'incident_role',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.DRIVER_PASSENGER,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Who was at fault?': {
      key: 'fault_party',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Did the police respond to the scene?': {
      key: 'police_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Did the paramedics respond to the scene?': {
      key: 'paramedics_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Do you have photos of the accident?': {
      key: 'has_accident_photos',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Were there witnesses?': {
      key: 'has_witnesses',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Have you spoken to anyone regarding the accident?': {
      key: 'discussed_accident',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },

    // Vehicle Information Section
    [SECTIONS.VEHICLE_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'What is the make/model of your vehicle?': {
      key: 'vehicle_make_model',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },
    'How much damage was done to your vehicle?': {
      key: 'vehicle_damage',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },
    'What is the make/model of the other driver/At-fault vehicle?': {
      key: 'other_vehicle_make_model',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },
    'How much damage was done to the other driver/At-fault vehicle?': {
      key: 'other_vehicle_damage',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },

    // Insurance Information Section
    [SECTIONS.INSURANCE_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Do you have auto insurance?': {
      key: 'has_auto_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'What are your limits?': {
      key: 'insurance_limits',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Who is your auto insurance carrier?': {
      key: 'insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Do you have uninsured or underinsured motorist coverage (UM)?': {
      key: 'has_um_coverage',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Do you have health insurance?': {
      key: 'has_health_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Who is your health insurance carrier?': {
      key: 'insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },

    // Injuries and Medical Treatment Section
    [SECTIONS.INJURY_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Describe your injuries': {
      key: 'injury_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: SECTIONS.INJURY_INFO,
    },
    'Have you received any treatment for your injuries?': {
      key: 'received_treatment',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.INJURY_INFO,
    },
    'Have you ever been involved in accident before where you suffered similar injuries?':
      {
        key: 'prior_similar_injury',
        type: 'dropdown',
        answerOptions: ANSWER_OPTIONS.YES_NO,
        gridSize: GRID_CONFIG.HALF_WIDTH,
        section: SECTIONS.INJURY_INFO,
      },

    // Lost Wages Section
    [SECTIONS.WAGES_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.WAGES_INFO,
    },
    'Have you incurred lost wages?': {
      key: 'lost_wages',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.WAGES_INFO,
    },

    // Representation Section
    [SECTIONS.REPRESENTATION_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Have you spoken to another attorney about this case?': {
      key: 'consulted_another_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.REPRESENTATION_INFO,
    },
    'Has another attorney turned your case down?': {
      key: 'case_rejected_by_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.REPRESENTATION_INFO,
    },
  },

  // Bankruptcy
  Bankruptcy: {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Case Information Section
    'Case Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Case Number': {
      key: 'case_number',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Confirmation Hearing Date': {
      key: 'hearing_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    "Judge's Name": {
      key: 'judge_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    "Judge's Room Number": {
      key: 'judge_room',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Repayment Amount': {
      key: 'repayment_amount',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Case Information',
    },
    'Meeting Date': {
      key: 'meeting_date',
      type: 'date',
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Case Information',
    },
    'Meeting Time': {
      key: 'meeting_time',
      type: 'time',
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Case Information',
    },
  },

  // Criminal Defense Law
  'Criminal Defense Law': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Incident Details Section
    'Incident Details': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Date of Arrest': {
      key: 'arrest_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Which police department made the arrest?': {
      key: 'arrest_department',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Do you have a court date scheduled?': {
      key: 'court_date_scheduled',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'When is your court date?': {
      key: 'court_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Do you already have an attorney or have you previously hired an attorney?':
      {
        key: 'has_or_had_attorney',
        type: 'dropdown',
        answerOptions: ANSWER_OPTIONS.YES_NO,
        gridSize: GRID_CONFIG.HALF_WIDTH,
        section: 'Incident Details',
      },
    'Do you have any prior convictions?': {
      key: 'prior_convictions',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Describe what happened:': {
      key: 'incident_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Details',
    },
  },

  // Custody
  Custody: {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Divorce With Children Section
    'Divorce With Children': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    "Were you ever married to the children's other parent?": {
      key: 'was_married_to_other_parent',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '1. If yes, please select all that apply': {
      type: 'checkbox_heading',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Divorce With Children',
    },
    "1.1 Divorced children's other parent": {
      key: 'divorced_other_parent',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '1.2 Presently paying child support': {
      key: 'paying_child_support',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '1.3 Presently paying spousal support (alimony)': {
      key: 'paying_spousal_support',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '1.4 There is an existing Parenting Plan from the divorce': {
      key: 'has_parenting_plan',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '1.5 Not paying child support (never have or have stopped)': {
      key: 'not_paying_support',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '2. If no, please select all that apply': {
      type: 'checkbox_heading',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Divorce With Children',
    },
    '2.1 Presently paying child support': {
      key: 'paying_child_support_2',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '2.2 Certain the children are mine': {
      key: 'children_mine_confirmed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '2.3 Need to prove parentage - Not certain the children are mine': {
      key: 'need_parentage_proof',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },
    '2.4 Not paying child support (never have or have stopped)': {
      key: 'not_paying_support_2',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Divorce With Children',
    },

    // Case Information Section
    'Case Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Last time you saw the children': {
      key: 'last_seen_children',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Is there a written Parenting Plan or other agreement on when and how you visit the children?':
      {
        key: 'has_written_parenting_agreement',
        type: 'dropdown',
        answerOptions: ANSWER_OPTIONS.YES_NO,
        gridSize: GRID_CONFIG.HALF_WIDTH,
        section: 'Case Information',
      },
    'Where are the children living now?': {
      key: 'children_current_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Who are the children living with?': {
      key: 'children_living_with',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Is there a scheduled hearing or trial date?': {
      key: 'hearing_details',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'If yes, hearing or trial date information': {
      key: 'hearing_trial_date_info',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Have there been prior court proceedings (hearings or trials) involving custody or visitation issues with your children?':
      {
        key: 'prior_custody_cases',
        type: 'dropdown',
        answerOptions: ANSWER_OPTIONS.YES_NO,
        gridSize: GRID_CONFIG.FULL_WIDTH,
        section: 'Case Information',
      },
    'Briefly describe your legal concern': {
      key: 'legal_concern',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Information',
    },

    // Employment Information Section
    'Employment Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'What is your annual pay?': {
      key: 'annual_income',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'If not employed, amount and source of income': {
      key: 'income_source',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Do you have a history of drug or alcohol abuse?': {
      key: 'history_drug_alcohol_abuse',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Have you ever filed for bankruptcy?': {
      key: 'filed_bankruptcy',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Do you plan on filing for bankruptcy?': {
      key: 'plan_bankruptcy',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },

    // Spouse/Ex's Information Section
    "Spouse/Ex's Information": {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    "Spouse/Ex-Spouse's Name": {
      key: 'spouse_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'All known alias for spouse/ex-spouse': {
      key: 'spouse_aliases',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's present address": {
      key: 'spouse_address',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's cell phone number": {
      key: 'spouse_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's email address": {
      key: 'spouse_email',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's date of birth": {
      key: 'spouse_dob',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Does your spouse/ex-spouse have a history of drug or alcohol abuse?': {
      key: 'spouse_drug_alcohol_history',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Is your spouse/ex-spouse currently working?': {
      key: 'spouse_employment_status',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "What is your spouse/ex-spouse's annual income?": {
      key: 'spouse_annual_income',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Does your spouse/ex-spouse have an attorney?': {
      key: 'spouse_has_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Please provide names, DOBs, and genders for all children': {
      key: 'children_info',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: "Spouse/Ex's Information",
    },
  },

  // Dog Bite
  'Dog Bite': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Incident Information Section
    'Incident Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'When did the accident occur?': {
      key: 'accident_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Where did the accident occur?': {
      key: 'accident_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'How did the accident occur?': {
      key: 'accident_details',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Information',
    },
    'Was an Animal Control report filed?': {
      key: 'animal_control_report_filed',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'What kind of dog bit you?': {
      key: 'dog_breed_type',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Do you know the name of the dog owner?': {
      key: 'know_dog_owner_name',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Did the police respond to the scene?': {
      key: 'police_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Did the paramedics respond to the scene?': {
      key: 'paramedics_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Describe your injuries:': {
      key: 'injury_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Information',
    },
    'Have you received treatment for these injuries?': {
      key: 'received_treatment',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Do you have health insurance?': {
      key: 'has_health_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Who is your carrier?': {
      key: 'insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Have you incurred lost wages?': {
      key: 'incurred_lost_wages',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Have you spoken to another attorney about this case?': {
      key: 'consulted_another_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Has another attorney turned your case down?': {
      key: 'case_rejected_by_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
  },

  // Domestic Violence/Restraining Orders
  'Domestic Violence/Restraining Orders': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Case Scenario Section
    'Case Scenario': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Please select the appropriate case scenario:': {
      key: 'case_scenario',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Scenario',
    },
    'Are there minor children involved?': {
      key: 'minor_children_involved',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Scenario',
    },

    // Protection Details Section
    'Protection Details': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Describe why you need this protection:': {
      key: 'protection_reason',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Protection Details',
    },
    'Describe what you are accused of': {
      key: 'accusation_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Protection Details',
    },
    'What is your relationship to the accuser?': {
      key: 'relationship_to_accuser',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Protection Details',
    },

    // Court Information Section
    'Court Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Court Location': {
      key: 'court_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Court Information',
    },
    'Date and Time for Court Appearance': {
      key: 'court_appearance_datetime',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Court Information',
    },

    // Investigation & Legal Status Section
    'Investigation & Legal Status': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Were the police involved?': {
      key: 'police_involved',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Investigation & Legal Status',
    },
    'Is there a divorce custody case also active or pending?': {
      key: 'divorce_custody_case_active',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Investigation & Legal Status',
    },

    // Employment Information Section
    'Employment Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'What is your annual pay?': {
      key: 'annual_income',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'If not employed, amount and source of income': {
      key: 'income_source',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },

    // Personal History Section
    'Personal History': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Do you have a history of drug or alcohol abuse?': {
      key: 'history_drug_alcohol_abuse',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal History',
    },
    'Have you ever filed for bankruptcy?': {
      key: 'ever_filed_bankruptcy',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal History',
    },
    'Do you plan on filing for bankruptcy?': {
      key: 'planning_bankruptcy',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal History',
    },

    // Other Party Information Section
    'Other Party Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    "Other party's name:": {
      key: 'other_party_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },
    "Other party's cell phone number:": {
      key: 'other_party_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },
    "Other party's email address:": {
      key: 'other_party_email',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },
    "Other party's date of birth:": {
      key: 'other_party_dob',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },
    'Does this individual have a history of drug or alcohol abuse?': {
      key: 'other_party_drug_alcohol_history',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },
    'Is this person working?': {
      key: 'other_party_working',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },
    'Does this other party have an attorney?': {
      key: 'other_party_has_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Other Party Information',
    },

    // Witnesses & Children Section
    'Witnesses & Children': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'If there were witnesses, please provide their name, phone number, email address and advise if they would be willing to':
      {
        key: 'witnesses_information',
        type: 'textarea',
        gridSize: GRID_CONFIG.FULL_WIDTH,
        section: 'Witnesses & Children',
      },
    'Please provide names, DOBs, and genders for all children': {
      key: 'children_info',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Witnesses & Children',
    },
  },

  // Employment Law
  'Employment Law': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Employment Information Section
    'Employment Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    "What is your employer's name?": {
      key: 'employer_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Does your employer have more than one office location?': {
      key: 'multiple_office_locations',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'How many employees in your location?': {
      key: 'location_employee_count',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'What is your job title?': {
      key: 'job_title',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Do you work full time or part time?': {
      key: 'employment_type',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'How many hours per week do you work on average?': {
      key: 'weekly_hours',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Employment start date:': {
      key: 'employment_start_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Are you still employed?': {
      key: 'still_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Reason for termination:': {
      key: 'termination_reason',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Employment Information',
    },
    'Termination date:': {
      key: 'termination_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },

    // Compensation & Duties Section
    'Compensation & Duties': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Are you paid hourly or salary?': {
      key: 'salary_type',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Compensation & Duties',
    },
    'What is your hourly rate or salary?': {
      key: 'salary_amount',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Compensation & Duties',
    },
    'Describe your job duties and responsibilities:': {
      key: 'job_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Compensation & Duties',
    },

    // Legal Issue Section
    'Legal Issue': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Describe your legal issue:': {
      key: 'employment_legal_issue',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Legal Issue',
    },
  },

  // Estate Law
  'Estate Law': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Meeting Purpose Section
    'Meeting Purpose': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'What is the purpose of this meeting:': {
      key: 'meeting_purpose',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Meeting Purpose',
    },
    'Are you calling on your behalf or on behalf of someone else?': {
      key: 'calling_on_behalf',
      type: 'dropdown',
      answerOptions: [
        { label: 'On my behalf', value: 'self' },
        { label: 'On behalf of someone else', value: 'other' },
      ],
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Meeting Purpose',
    },

    // Personal Information Section
    'Personal Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Marital Status:': {
      key: 'marital_status',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.MARITAL_STATUS,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Personal Information',
    },
    'Do you have any children?': {
      key: 'has_children',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Personal Information',
    },
    'If yes, please provide names and DOBs': {
      key: 'children_names_dobs',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Personal Information',
    },

    // Legal Information Section
    'Legal Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Brief description of legal issue:': {
      key: 'employment_legal_issue',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Legal Information',
    },
    'Is this matter currently in litigation?': {
      key: 'currently_in_litigation',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Legal Information',
    },
    'If yes, list all parties:': {
      key: 'litigation_parties',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Legal Information',
    },
    'Is there a possibility of future litigation?': {
      key: 'possibility_future_litigation',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Legal Information',
    },
    'Have you spoken to another attorney about this case?': {
      key: 'consulted_another_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Legal Information',
    },
  },

  // Medical Malpractice
  'Medical Malpractice': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Incident Information Section
    'Incident Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'When did the accident occur?': {
      key: 'accident_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Where did the accident occur?': {
      key: 'accident_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Describe the accident': {
      key: 'accident_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Information',
    },
    'Describe your injuries': {
      key: 'injury_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Information',
    },
    'Have you received treatment for these injuries?': {
      key: 'received_treatment',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },

    // Personal Information Section
    'Personal Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Do you have health insurance?': {
      key: 'has_health_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Who is your carrier?': {
      key: 'insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'What is your height and weight?': {
      key: 'height_weight',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Have you spoken to another attorney about this case?': {
      key: 'consulted_another_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Has another attorney turned your case down?': {
      key: 'case_rejected_by_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
  },

  // Slip and Fall
  'Slip and Fall': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Incident Information Section
    'Incident Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'When did the accident occur?': {
      key: 'accident_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Where did the accident occur?': {
      key: 'accident_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'How did the accident occur?': {
      key: 'accident_details',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Information',
    },
    'Was a report filed?': {
      key: 'report_filed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Did the paramedics respond to the scene?': {
      key: 'paramedics_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Information',
    },
    'Describe your injuries': {
      key: 'injury_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Information',
    },

    // Personal Information Section
    'Personal Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'What is your height and weight?': {
      key: 'height_weight',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Have you received treatment for these injuries?': {
      key: 'received_treatment',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Do you have health insurance?': {
      key: 'has_health_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Who is your carrier?': {
      key: 'insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Have you incurred lost wages?': {
      key: 'incurred_lost_wages',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Have you spoken to another attorney about this case?': {
      key: 'consulted_another_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'Has another attorney turned your case down?': {
      key: 'case_rejected_by_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
  },

  // Social Security Disability
  'Social Security Disability': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Personal Information Section
    'Personal Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'What is your date of birth?': {
      key: 'date_of_birth',
      type: 'date',
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Personal Information',
    },
    'What is your social security number?': {
      key: 'social_security_number',
      type: 'text',
      maxLength: 11,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Personal Information',
    },
    'Have you applied for Social Security Benefits in the past?': {
      key: 'applied_ss_benefits_before',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },
    'If yes, what is the date of your last denial?': {
      key: 'last_denial_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Personal Information',
    },

    // Education & Medical Information Section
    'Education & Medical Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Did you graduate High School?': {
      key: 'graduated_high_school',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Education & Medical Information',
    },
    'Did you graduate college?': {
      key: 'graduated_college',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Education & Medical Information',
    },
    'How many doctors are you currently seeing?': {
      key: 'number_of_doctors',
      type: 'text',
      maxLength: 10,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Education & Medical Information',
    },
    'Do your doctors support your decision to seek social security benefits?': {
      key: 'doctors_support_ss_benefits',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Education & Medical Information',
    },
    'How many times have you been hospitalized in the past five years?': {
      key: 'hospitalizations_past_five_years',
      type: 'text',
      maxLength: 10,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Education & Medical Information',
    },
    'How many medications are you taking?': {
      key: 'number_of_medications',
      type: 'text',
      maxLength: 10,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Education & Medical Information',
    },
    'What are your disabilities? (list them)': {
      key: 'disabilities_list',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Education & Medical Information',
    },

    // Employment Information Section
    'Employment Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Have you worked for the past five years?': {
      key: 'worked_last_5_years',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Who was your last employer?': {
      key: 'last_employer',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'What did you do for work?': {
      key: 'last_job_role',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'When did you start and end your last job, approximately?': {
      key: 'last_job_period',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },

    // Family Information Section
    'Family Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Do you have any children?': {
      key: 'has_children',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Family Information',
    },
    'If yes, how old and how many?': {
      key: 'child_count',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Family Information',
    },
    "What is your mother's maiden name?": {
      key: 'mother_maiden_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Family Information',
    },
    "What is your father's full name?": {
      key: 'father_full_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Family Information',
    },
    'What city and state were you born in?': {
      key: 'birth_city_state',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Family Information',
    },
  },

  // Divorce Without Children
  'Divorce Without Children': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Case Information Section
    'Case Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Is there a custody or visitation issue?': {
      key: 'custody_or_visitation_issue',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Describe custody/visitation issue:': {
      key: 'case_summary',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Information',
    },
    'Do you own property (primary residence) and/or investment property?': {
      key: 'owns_property',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Describe property:': {
      key: 'property_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Information',
    },
    'Do you have a retirement plan(s)?': {
      key: 'retirement_plan',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Describe retirement plan(s):': {
      key: 'additional_case_notes',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Information',
    },
    'Do you or your spouse own a business?': {
      key: 'owns_business',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Describe business:': {
      key: 'business_case_notes',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Information',
    },
    'Do you have any debt (credit cards, loans, car payments, etc.)?': {
      key: 'has_debt',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Approximate total amount:': {
      key: 'total_debt_amount',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Is there a scheduled hearing or trial date?': {
      key: 'has_hearing_date',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Information regarding hearing/trial:': {
      key: 'hearing_info',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Case Information',
    },
    'Does your divorce involve domestic violence?': {
      key: 'involves_domestic_violence',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Does your divorce involve child support?': {
      key: 'involves_child_support',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Does your divorce involve spousal support (alimony)?': {
      key: 'involves_spousal_support',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },

    // Employment Information Section
    'Employment Information': {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'What is your annual pay?': {
      key: 'annual_income',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'If not employed, amount and source of income': {
      key: 'income_source',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Do you have a history of drug or alcohol abuse?': {
      key: 'drug_alcohol_history',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Have you ever filed for bankruptcy?': {
      key: 'ever_filed_bankruptcy',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },
    'Do you plan on filing for bankruptcy?': {
      key: 'planning_bankruptcy',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Employment Information',
    },

    // Spouse/Ex's Information Section
    "Spouse/Ex's Information": {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    "Spouse/Ex-Spouse's Name:": {
      key: 'spouse_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'All known alias for spouse/ex-spouse:': {
      key: 'spouse_aliases',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's present address:": {
      key: 'spouse_address',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's cell phone number": {
      key: 'spouse_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's email address:": {
      key: 'spouse_email',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "Spouse/Ex-Spouse's date of birth": {
      key: 'spouse_dob',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Does your spouse/ex-spouse have a history of drug or alcohol abuse?': {
      key: 'spouse_drug_alcohol_history',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Is your spouse/ex-spouse currently working?': {
      key: 'spouse_employment_status',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    "What is your spouse/ex-spouse's annual income?": {
      key: 'spouse_annual_income',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
    'Does your spouse/ex-spouse have an attorney?': {
      key: 'spouse_has_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: "Spouse/Ex's Information",
    },
  },
};

export { ANSWER_OPTIONS, GRID_CONFIG, SECTIONS, CASE_TYPE_FIELD_MAPPERS };
