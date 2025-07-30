export interface BloodInventoryItem {
  _id: string;
  blood_group_id: string;
  blood_group_name: string;
  blood_component_id: string;
  blood_component_name: string;
  threshold_unit: number;
  threshold_volume_ml: number;
  threshold_unit_stable: number;
  total_units: number;
  total_volume_ml: number;
  is_stable: boolean;
}
