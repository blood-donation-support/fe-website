export interface DonationRegistration {
  _id: string;
  user_id: string;
  health_check_id: string;
  blood_group_id: string;
  blood_group_name: string;
  blood_component_id: string;
  donation_type?: string;
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
  donation_type?: string;
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
  donation_type?: string;
  health_check_id: string;
  blood_group_id: string;
  blood_group_name: string;
  username: string;
  donation_date: string; 
  volume_collected: number;
  status: string
  is_separated: boolean;
  description: string;
  created_at: string; 
  updated_at: string; 
}
