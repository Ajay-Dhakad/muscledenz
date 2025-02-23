import { CategoryResType } from "./category";

export interface ProductResType {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  thumbnail: string;
  stock: number;
  category: CategoryResType;
  tags: string[];
  collectionType: "popular" | "trending" | "fit-food" | "life-style" | "just-launched";
  createdAt: string;
  updatedAt: string;
}
