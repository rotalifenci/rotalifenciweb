const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

const requiredIds = [
  'tab-map', 'heroGuidePicker', 'btnPickEren', 'btnPickAybuke',
  'mapPeriodFilterBar', 'typeFilter', 'districtFilter', 'btnResetDistrict',
  'sivasSvgMap', 'districtsGroup', 'districtTooltip',
  'guideFloatingWidget', 'guideSpeechText',
  'monumentsGrid', 'modalMonumentDetail',
  'modalRealInscription', 'insPhoto', 'btnFilterNormal', 'btnFilterContrast', 'btnFilterEmboss', 'btnFilterInvert',
  'insArabic', 'insTranscription', 'insTranslation', 'insEvidenceList', 'txtInscriptionInference',
  'tab-comparison', 'compareSelect1', 'compareSelect2', 'compareSelect3', 'comparisonTableBody',
  'txtInferenceClaim', 'txtInferenceEvidence', 'txtInferenceReasoning', 'txtStudentInference', 'btnSaveInference', 'btnExportInference',
  'tab-timeline', 'tab-fieldwork', 'btnTogglePreTest', 'btnTogglePostTest', 'assessmentForm', 'btnSubmitTest', 'btnExportTestResults',
  'tab-sources', 'modalAdmin', 'adminAuthLock', 'txtAdminPassword', 'btnUnlockAdmin', 'btnExportJsonData', 'fileImportJson'
];

let missing = [];
requiredIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    missing.push(id);
  }
});

if (missing.length === 0) {
  console.log('ALL ' + requiredIds.length + ' CRITICAL DOM IDS VERIFIED IN index.html!');
} else {
  console.error('Missing IDs in index.html:', missing);
  process.exit(1);
}
