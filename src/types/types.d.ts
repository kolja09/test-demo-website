type TProduct = {
  id: number;
  brand_id: number;
  categories: Array<CategoryType>;
  created_at: string;
  deleted_at: string | null;
  icon: string | null;
  is_taxable: boolean;
  limit_per_order: boolean;
  link: string;
  long_description: string;
  name: string;
  price: string;
  short_description: string;
  sku: string;
  stock_status: string;
  tax_class: string | null;
  tax_class_id: number | null;
  updated_at: string;
};

type TCategory = {
  brand_id: number;
  created_at: string;
  deleted_at: string | null;
  depth: number;
  description: string;
  display_order: number;
  full_name: string;
  id: number;
  is_enabled: number;
  name: string;
  notes: string | null;
  parent: TCategory | null;
  parent_id: number | null;
  pivot: {
    product_id: number;
    category_id: number;
  };
  slug: string;
  thumbnail: string | null;
  updated_at: string;
};
