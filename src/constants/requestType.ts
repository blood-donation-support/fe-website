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
  [RequestType.WholeBlood]: "Máu toàn phần",
  [RequestType.Platelets]: " Tiểu cầu",
  [RequestType.Plasma]: " Huyết tương",
  [RequestType.RedBloodCells]: " Hồng cầu kép",
  [RequestType.PlateletsPlasma]: " Tiểu cầu + Huyết tương",
  [RequestType.PlasmaRedCells]: " Huyết tương + Hồng cầu",
  [RequestType.PlateletsRedCells]: " Tiểu cầu + Hồng cầu"
};

export const RequestTypeList = Object.entries(RequestTypeVN) as [RequestType, string][];
