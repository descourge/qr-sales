export interface SaleHistory {

  id: number;

  createdAt: string;

  total: string;

  latitude: string | null;

  longitude: string | null;

  details: {

    articleId: number;

    quantity: number;

    unitPrice: string;

    subtotal: string;

    article: {

      code: string;

      description: string;

    };

  }[];

}