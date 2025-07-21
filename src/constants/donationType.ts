export enum DonationType {
  WholeBlood = 'Whole Blood',
  Platelets = 'Platelets',
  Plasma = 'Plasma',
  RedBloodCells = 'Red Blood Cells',
  PlateletsPlasma = 'Platelets - Plasma',
  PlasmaRedCells = 'Plasma - Red Blood Cells',
  PlateletsRedCells = 'Platelets - Red Blood Cells'
}

export const donationTypeVN: Record<DonationType, string> = {
  [DonationType.WholeBlood]: "Hiến máu toàn phần",
  [DonationType.Platelets]: "Hiến tiểu cầu",
  [DonationType.Plasma]: "Hiến huyết tương",
  [DonationType.RedBloodCells]: "Hiến hồng cầu kép",
  [DonationType.PlateletsPlasma]: "Hiến tiểu cầu + huyết tương",
  [DonationType.PlasmaRedCells]: "Hiến huyết tương + hồng cầu",
  [DonationType.PlateletsRedCells]: "Hiến tiểu cầu + hồng cầu"
};

export const donationTypeList = Object.entries(donationTypeVN) as [DonationType, string][];
