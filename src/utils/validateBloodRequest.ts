import { UnderlyingHealthCondition } from "@/types/health";

const HGB_TRANSFUSE_THRESHOLD = 7.0;         // g/dL cho bệnh nhân ổn định
const HGB_TRANSFUSE_THRESHOLD_CARDIAC = 8.0; // g/dL cho bệnh tim mạch, chấn thương chỉnh hình

// Ngưỡng huyết động
const MAX_HEARTRATE = 100;   // bpm (nhịp tim >100 cảnh báo mất ổn định)
const MIN_HEARTRATE = 50;    // bpm (nhịp tim <50 cảnh báo chậm)

// Ngưỡng nhiệt độ
const MIN_TEMPERATURE = 36.0; // °C (hạ thân nhiệt cảnh báo)
const MAX_TEMPERATURE = 38.0; // °C (sốt cao cảnh báo)

// Ngưỡng huyết áp
const MIN_SYSTOLIC_BP = 90;   // mmHg (huyết áp tâm thu <90 cảnh báo sốc)
const MIN_DIASTOLIC_BP = 60;  // mmHg (huyết áp tâm trương <60 cảnh báo hạ huyết áp)

export interface TransfusionScreeningInput {
  patientBloodGroup: string;
  componentType: string;
  hemoglobin: number;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  temperature: number;
  conditions: UnderlyingHealthCondition[];
}

export interface ValidationResult {
  valid: boolean;
  fieldErrors: Record<string, string>;
}


export function validateBloodRequest(
  input: TransfusionScreeningInput
): ValidationResult {
  const errs: Record<string, string> = {};

  if (!input.patientBloodGroup) {
    errs.patientBloodGroup = "Phải chọn nhóm máu của người nhận.";
  }
  if (!input.componentType) {
    errs.componentType = "Phải chọn thành phần máu cần truyền.";
  }

  if (isNaN(input.hemoglobin)) {
    errs.hemoglobin = "Phải nhập mức hemoglobin.";
  } else {
    const thres = input.conditions.includes(UnderlyingHealthCondition.HeartDisease)
      ? HGB_TRANSFUSE_THRESHOLD_CARDIAC
      : HGB_TRANSFUSE_THRESHOLD;
    if (input.hemoglobin > thres) {
      errs.hemoglobin = `Chỉ định truyền khi Hb ≤ ${thres} g/dL.`;
    }
  }

  if (isNaN(input.heartRate)) {
    errs.heartRate = "Phải nhập nhịp tim.";
  } else if (input.heartRate < MIN_HEARTRATE || input.heartRate > MAX_HEARTRATE) {
    errs.heartRate = `Nhịp tim phải trong khoảng ${MIN_HEARTRATE}–${MAX_HEARTRATE} bpm.`;
  }

  if (isNaN(input.temperature)) {
    errs.temperature = "Phải nhập nhiệt độ.";
  } else if (
    input.temperature < MIN_TEMPERATURE ||
    input.temperature > MAX_TEMPERATURE
  ) {
    errs.temperature = `Nhiệt độ phải trong khoảng ${MIN_TEMPERATURE}–${MAX_TEMPERATURE}°C.`;
  }

  if (isNaN(input.systolicBP) || input.systolicBP < MIN_SYSTOLIC_BP) {
    errs.systolicBP = `Huyết áp tâm thu phải ≥ ${MIN_SYSTOLIC_BP} mmHg.`;
  }

  if (isNaN(input.diastolicBP) || input.diastolicBP < MIN_DIASTOLIC_BP) {
    errs.diastolicBP = `Huyết áp tâm trương phải ≥ ${MIN_DIASTOLIC_BP} mmHg.`;
  }

  return {
    valid: Object.keys(errs).length === 0,
    fieldErrors: errs,
  };
}
