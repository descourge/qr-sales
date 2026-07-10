export interface ReportSummary {

  totalSales: number;

  totalAmount: number;

  averageTicket: number;

}

export interface BranchReport {

  id: number;

  name: string;

  sales: number;

  total: number;

}

export interface SellerReport {

  id: number;

  name: string;

  branch: string;

  sales: number;

  total: number;

}

export interface ProductReport {

  id: number;

  name: string;

  quantity: number;

  total: number;

}

export interface ReportData {

  summary: ReportSummary;

  branches: BranchReport[];

  sellers: SellerReport[];

  products: ProductReport[];

}