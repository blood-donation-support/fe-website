export interface HealthCheck {
    _id: string;
    user_id: string;
    blood_group_id: string;
    request_registration_id: string;
    request_process_id: string;
    weight?: number;
    request_type: string;
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


export interface RequestRegistration {

    _id: string;
    user_id: string;
    request_process_id: string;
    health_check_id: string;
    status: string;
    blood_group_id: string;
    request_type: string ;
    image: string;
    receive_date_request: string;
    is_emergency: boolean;
    note: string;
    full_name: string;
    phone: string;
    citizen_id_number: string;
    blood_group_name: string;

}