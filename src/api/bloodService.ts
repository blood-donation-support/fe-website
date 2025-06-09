import axios from "axios";

const API_URL = "https://be-production-84a8.up.railway.app";

export interface BloodGroup {
  _id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface BloodComponent {
  _id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

const bloodService = {
  getBloodGroups: async (): Promise<BloodGroup[]> => {
    const res = await axios.get(`${API_URL}/bloods/blood-groups`);
    return res.data.result as BloodGroup[];
  },
  getBloodComponents: async (): Promise<BloodComponent[]> => {
    const res = await axios.get(`${API_URL}/bloods/blood-components`);
    return res.data.result as BloodComponent[];
  },
};

export default bloodService;