export enum RequestType {
  WholeBlood = 'Whole Blood',
  Platelets = 'Platelets',
  Plasma = 'Plasma',
  RedBloodCells = 'Red Blood Cells',
  PlateletsPlasma = 'Platelets - Plasma',
  PlasmaRedCells = 'Plasma - Red Blood Cells',
  PlateletsRedCells = 'Platelets - Red Blood Cells'
}

export const RequestTypeVN: Record<RequestType, string> = {
  [RequestType.WholeBlood]: "Hiến máu toàn phần",
  [RequestType.Platelets]: "Hiến tiểu cầu",
  [RequestType.Plasma]: "Hiến huyết tương",
  [RequestType.RedBloodCells]: "Hiến hồng cầu kép",
  [RequestType.PlateletsPlasma]: "Hiến tiểu cầu + huyết tương",
  [RequestType.PlasmaRedCells]: "Hiến huyết tương + hồng cầu",
  [RequestType.PlateletsRedCells]: "Hiến tiểu cầu + hồng cầu"
};

export const RequestTypeList = Object.entries(RequestTypeVN) as [RequestType, string][];
