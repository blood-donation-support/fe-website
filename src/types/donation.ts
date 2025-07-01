export interface DonationRegistration {
  _id: string;
  user_id: string;
  health_check_id: string;
  blood_group_id: string;
  blood_component_id: string;
  start_date_donation: string;
  status: string;
  created_at: string;
  updated_at: string;
  citizen_id_number: string;
  full_name: string;
  phone: string;
}


export interface HealthCheck {
  _id: string;
  user_id: string;
  donation_registration_id: string;
  donation_process_id: string;
  blood_group_id: string;

  weight?: number;
  temperature?: number;
  heart_rate?: number;
  diastolic_blood_pressure?: number;
  systolic_blood_pressure?: number;
  hemoglobin?: number;
  underlying_health_conditions?: string[];

  description: string;
  status: string;

  created_at: string;
  updated_at: string;
}


export interface DonationProcess {
  _id: string;
  donation_registration_id: string;
  user_id: string;
  donation_date: string;
  volume_collected: number;
  status: string;
  created_at: string;
  updated_at: string;
  description: string;
}