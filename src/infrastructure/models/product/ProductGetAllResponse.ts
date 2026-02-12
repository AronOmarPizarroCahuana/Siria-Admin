export interface ProductGetAllResponse {
  meta: Meta;
  pagination: Pagination;
  products: Product[];
}

export interface Meta {
  status: boolean;
  message: string;
}

export interface Pagination {
  page_number: number;
  page_size: number;
  total_pages: number;
  total_records: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number | null;
  image_url: string;
}
