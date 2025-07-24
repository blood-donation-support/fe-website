// export interface RecentUser {
//   id: string;
//   full_name: string;
//   email: string;
//   registerDate: string;
// }

// export interface UsersOverview {
//   total: number;
//   byGender: {
//     male: number;
//     female: number;
//     other: number;
//   };
//   byAgeGroup: {
//     "18-25": number;
//     "26-35": number;
//     "36-50": number;
//     "51+": number;
//   };
//   recentUsers: RecentUser[];
// }

// export interface StaffOverview {
//   total: number;
//   by_role: {
//     Staff: number;
//     StaffWarehouse: number;
//   };
// }

export interface DonationForm {
  id: string;
  donorName: string;
  bloodGroupName: string;
  donationType: string;
  registerDate: string;
  status: string;
}

// export interface DonationsOverview {
//   total: number;
//   byStatus: {
//     Pending: number;
//     CheckedIn: number;
//     Approved: number;
//     Rejected: number;
//   };
//   recentForms: DonationForm[];
//   completedRate: string;
// }

// export interface RequestsOverview {
//   total: number;
//   byStatus: {
//     Pending: number;
//     Approved: number;
//     Rejected: number;
//   };
// }

// export interface ExpiringItem {
//   bloodBagId: string;
//   bloodGroupName: string;
//   bloodComponentName: string;
//   expiryDate: string;
//   daysLeft: number;
// }

// export interface InventoryOverview {
//   totalUnits: number;
//   byBloodGroupName: Record<string, number>;
//   byComponentName: Record<string, number>;
//   expiringSoon: ExpiringItem[];
// }

// export interface DashboardOverview {
//   users: UsersOverview;
//   staff: StaffOverview;
//   donations: DonationsOverview;
//   requests: RequestsOverview;
//   inventory: InventoryOverview;
// }


export interface DashboardOverview {
  users: {
    total: number;
    by_gender: Record<string, number>;
    by_age_group: Record<string, number>;
    recent_users: Array<{
      id: string;
      full_name: string;
      email: string;
      citizen_id_number: string;
      phone: string;
      register_date: string;
    }>;
  };
  staff: {
    total: number;
    by_role: Record<string, number>;
  };
  donations: {
    total: number;
    by_status: Record<string, number>;
    recent_forms: Array<{
      id: string;
      donor_name: string;
      blood_group_name: string;
      donation_type: string;
      register_date: string;
      status: string;
    }>;
    completedRate: string;
  };
  requests: {
    total: number;
    by_status: Record<string, number>;
    recent_form: Array<{
      id: string;
      receiver_name: string;
      blood_group_name: string;
      request_type: string;
      register_date: string;
      status: string;
    }>;
  };
  inventory: {
    total: number;
    by_blood_group_name: Record<string, number>;
    by_blood_component_name: Record<string, number>;
    expiring_soon: Array<{
      blood_bag_id: string;
      blood_group_name: string;
      blood_component_name: string;
      expired_date: string;
      volume: number;
      days_left: number;
    }>;
  };
}
