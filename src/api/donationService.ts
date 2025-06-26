import axios from "axios";

const API_URL = "https://be-t8i8.onrender.com/api";

export interface DonationRegistrationPayload {
  blood_group_id: string;
  blood_component_id: string;
  start_date_donation: string;
}

const donationService = {
  registerDonation: async (
    payload: DonationRegistrationPayload,
    accessToken: string
  ) => {
    const res = await axios.post(
      `${API_URL}/donations/donation-registrations`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  },
};

export default donationService;