// export interface ExpiringSoonItem {
//   bloodBagId: string;
//   bloodType?: string;
//   bloodGroupName?: string;
//   component?: string;
//   bloodComponentName?: string;
//   expiryDate: string;
//   daysLeft: number;
//   location?: string;
// }

// export interface ImportExportStats {
//   today: {
//     imported: number;
//     exported: number;
//   };
//   thisMonth: {
//     imported: number;
//     exported: number;
//   };
// }

// export interface DailyImportExport {
//   date: string;
//   imported: number;
//   exported: number;
// }

// export interface MonthlyExpiring {
//   month: string;
//   expiringUnits: number;
// }

// export interface DonationPerMonth {
//   month: string;
//   donations: number;
// }

// export interface BloodUsagePerMonth {
//   month: string;
//   unitsUsed: number;
// }

// export interface DonationProcessRatio {
//   Pending: number;
//   CheckedIn: number;
//   Approved: number;
//   Rejected: number;
// }

// export interface WarehouseOverview {
//   totalUnits: number;
//   byBloodType: Record<string, number>;
//   byComponent: Record<string, number>;
//   importExportStats: ImportExportStats;
//   donationsPerMonth: DonationPerMonth[];
//   bloodUsagePerMonth: BloodUsagePerMonth[];
//   donationProcessRatio: DonationProcessRatio;
//   chart: {
//     bloodImportExportPerDay: DailyImportExport[];
//     expiringPerMonth: MonthlyExpiring[];
//   };
//   expiringSoon: ExpiringSoonItem[];
// }
export interface WarehouseOverview {
  total_units: number;
  by_blood_type: Record<string, number>;
  by_component: Record<string, number>;
  expiring_soon: Array<{
    blood_bag_id: string;
    blood_group_name: string;
    blood_component_name: string;
    expired_date: string;
    volume: number;
    days_left: number;
  }>;
  import_export_status: {
    today: {
      imported: number;
      exported: number;
    };
    this_month: {
      imported: number;
      exported: number;
    };
  };
  donations_per_month: Array<{
    month: string;
    donations: number;
  }>;
  blood_usage_per_month: Array<{
    month: string;
    units_used: number;
  }>;
  donation_process_ratio: Record<string, number>;
  chart: {
    blood_import_export_per_day: Array<{
      date: string;
      imported: number;
      exported: number;
    }>;
    expiring_per_month: Array<{
      month: string;
      expiring_units: number;
    }>;
  };
}
