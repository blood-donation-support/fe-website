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
  [RequestType.WholeBlood]: "máu toàn phần",
  [RequestType.Platelets]: " tiểu cầu",
  [RequestType.Plasma]: " huyết tương",
  [RequestType.RedBloodCells]: " hồng cầu kép",
  [RequestType.PlateletsPlasma]: " tiểu cầu + huyết tương",
  [RequestType.PlasmaRedCells]: " huyết tương + hồng cầu",
  [RequestType.PlateletsRedCells]: " tiểu cầu + hồng cầu"
};

export const RequestTypeList = Object.entries(RequestTypeVN) as [RequestType, string][];
