export interface SaleHistory {

  id: number;

  createdAt: string;

  total: number;

  latitude: number | null;

  longitude: number | null;

  branch: {

    id: number;

    name: string;

  };

  user: {

    id: number;

    name: string;

    role: string;

  };

  details: {

    articleId: number;

    quantity: number;

    unitPrice: number;

    subtotal: number;

    article: {

      code: string;

      description: string;

    };

  }[];

}