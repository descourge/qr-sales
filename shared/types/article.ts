export interface Category {

  id: number;

  name: string;

  color: string | null;

}

export interface Article {

  id: number;

  companyId: number;

  categoryId: number;

  code: string;

  description: string;

  unitPrice: string;

  createdAt: string;

  updatedAt: string;

  category: Category;

}