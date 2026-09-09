export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface Category extends CategoryFormData {
  _id: string;
  isActive: boolean;
  createdAt: string;
}
