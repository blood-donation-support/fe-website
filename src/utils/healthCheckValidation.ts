
import { UnderlyingHealthCondition } from "@/types/health";


// Medical thresholds
const MIN_WEIGHT = 42;            // kg
const MIN_HEMOGLOBIN = 12.5;      // g/dL
const MIN_TEMPERATURE = 36;       // °C
const MAX_TEMPERATURE = 37.5;     // °C
const MIN_HEARTRATE = 60;         // bpm
const MAX_HEARTRATE = 100;        // bpm
const MIN_SYSTOLIC = 90;          // mmHg
const MAX_SYSTOLIC = 180;         // mmHg
const MIN_DIASTOLIC = 50;         // mmHg
const MAX_DIASTOLIC = 100;        // mmHg
const MIN_VOLUME = 350;           // ml
const MAX_VOLUME = 500;           // ml


// Disqualifying conditions
export const DISQUALIFY_CONDITIONS: UnderlyingHealthCondition[] = [
  UnderlyingHealthCondition.Diabetes,
  UnderlyingHealthCondition.Hypertension,
  UnderlyingHealthCondition.HeartDisease,
  UnderlyingHealthCondition.Cancer,
  UnderlyingHealthCondition.Thalassemia,
  UnderlyingHealthCondition.Hemophilia,
  UnderlyingHealthCondition.Epilepsy,
  UnderlyingHealthCondition.ActivePulmonaryTuberculosis,
  UnderlyingHealthCondition.SevereAnemia,
  UnderlyingHealthCondition.SevereNeurologicalDisorder,
  UnderlyingHealthCondition.HIV,
  UnderlyingHealthCondition.HepatitisBorC,
];

// Step 2: health screening
export interface HealthScreeningInput {
  donationGroup: string;
  donationType: string;
  weight: number;
  temperature: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  hemoglobin: number;
  conditions: string[];
  screenResult: "Approved" | "Rejected";
}

export interface ValidationResult {
  valid: boolean;
  fieldErrors: Record<string,string>;
}

export function validateHealthScreeningFields(
  input: HealthScreeningInput
): ValidationResult {
  const errs: Record<string,string> = {};

  // Always require a decision
  if (!input.screenResult) {
    errs.screenResult = "Phải chọn kết quả sàng lọc.";
  }

  if (input.screenResult === "Approved") {
    // full set of checks only if Approved
    if (!input.donationGroup)   errs.donationGroup = "Phải chọn nhóm máu.";
    if (!input.donationType)    errs.donationType  = "Phải chọn loại hiến máu.";

    if (isNaN(input.weight) || input.weight < MIN_WEIGHT)
      errs.weight = `Cân nặng phải ≥ ${MIN_WEIGHT}kg.`;
    if (isNaN(input.temperature) ||
        input.temperature < MIN_TEMPERATURE ||
        input.temperature > MAX_TEMPERATURE)
      errs.temperature = `Nhiệt độ phải trong khoảng ${MIN_TEMPERATURE}–${MAX_TEMPERATURE}°C.`;
    if (isNaN(input.heartRate) ||
        input.heartRate < MIN_HEARTRATE ||
        input.heartRate > MAX_HEARTRATE)
      errs.heartRate = `Nhịp tim phải trong khoảng ${MIN_HEARTRATE}–${MAX_HEARTRATE} bpm.`;
    if (isNaN(input.systolicBP) ||
        input.systolicBP < MIN_SYSTOLIC ||
        input.systolicBP > MAX_SYSTOLIC)
      errs.systolicBP = `Huyết áp tâm thu phải trong khoảng ${MIN_SYSTOLIC}–${MAX_SYSTOLIC} mmHg.`;
    if (isNaN(input.diastolicBP) ||
        input.diastolicBP < MIN_DIASTOLIC ||
        input.diastolicBP > MAX_DIASTOLIC)
      errs.diastolicBP = `Huyết áp tâm trương phải trong khoảng ${MIN_DIASTOLIC}–${MAX_DIASTOLIC} mmHg.`;
    if (isNaN(input.hemoglobin) || input.hemoglobin < MIN_HEMOGLOBIN)
      errs.hemoglobin = `Mức hemoglobin phải ≥ ${MIN_HEMOGLOBIN} g/dL.`;
  }

  // Disqualifier logic applies always
  const hasBad = input.conditions
    .some(c => DISQUALIFY_CONDITIONS.includes(c as UnderlyingHealthCondition));

  if (input.screenResult === "Approved" && hasBad) {
    errs.conditions = "Đã có bệnh lý loại trừ nhưng vẫn đánh dấu 'Đạt'.";
  }
  if (input.screenResult === "Rejected" && !hasBad) {
    errs.conditions = "Phải tích ít nhất một bệnh lý loại trừ để từ chối.";
  }

  return {
    valid: Object.keys(errs).length === 0,
    fieldErrors: errs
  };
}


// Step 3: blood collection
export interface DonationProcessInput {
  donationDate: string;       // ISO
  volumeCollected: number;    // ml
  statusDonation: "Approved" | "Rejected";
}

export interface ProcessValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDonationProcess(
  input: DonationProcessInput
): ProcessValidationResult {
  // If they reject, skip all date/volume checks:
  if (input.statusDonation === "Rejected") {
    return { valid: true, errors: [] };
  }

  const errs: string[] = [];

  // Only validate when Approved
  if (!input.donationDate) {
    errs.push("Phải chọn ngày giờ lấy máu.");
  } else if (new Date(input.donationDate) > new Date()) {
    errs.push("Ngày giờ lấy máu không được ở tương lai.");
  }

  if (isNaN(input.volumeCollected) ||
      input.volumeCollected < MIN_VOLUME ||
      input.volumeCollected > MAX_VOLUME) {
    errs.push(`Thể tích thu phải trong khoảng ${MIN_VOLUME}–${MAX_VOLUME} ml.`);
  }

  return { valid: errs.length === 0, errors: errs };
}
