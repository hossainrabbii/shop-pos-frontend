export interface CategoryOption {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  categoryId: CategoryOption;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}
