export interface User {
  _id: string;
  full_name: string;
  email: string;
  date_of_birth: string; 
  role: "Admin" | "Staff" | "Staff-Warehouse" | string;
  gender: "Male" | "Female" | "Other" | string;
  citizen_id_number: string;
  blood_group_id: string | null;
  number_of_donation: number;
  number_of_request: number;
  address: string;
  weight: number;
  location: string;
  phone: string;
  avatar_url: string;
  created_at: string; 
  updated_at: string; 
  forgot_password_token: "string";
  is_active:boolean;
}
 
   
   
export interface NewUserPayload {
  citizen_id_number: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  weight: number;
  location: string;
  avatar_url: string;
  blood_group_id: string;
}
export enum UserGender {
  Other = 'Other',
  Male = 'Male',
  Female = 'Female'
}
export interface ChangePasswordPayload {
  old_password: string;
  password: string;
  confirm_password: string;
}
export interface UpdateProfilePayload {
  full_name: string;
  date_of_birth: string; 
  gender: string;
  weight: number;
  avatar_url: string;
  address: string;
  blood_group_id: string;
}