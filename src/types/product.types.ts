// types/product.types.ts
export interface IProductPrice {
  mrp: number;
  offerPrice: number;
}

export interface IProductImages {
  imageMain: string;
  imageArtTable: string;
  imageWall: string;
  imageBedroom: string;
  imageRoom: string;
  imageLivingRoom: string;
}

export interface IProduct {
  id: string;
  name: string;
  code: string;
  color: string[];
  fabric: string[];
  price: IProductPrice;
  series: string[];
  finish: string[];
  images: IProductImages;
  searchKeywords?: string[];
  searchScore?: number;
  lastSearched?: Date;
  slug?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInput {
  name: string;
  code: string;
  color: string[];
  fabric: string[];
  price: {
    mrp: number;
    offerPrice: number;
  };
  series: string[];
  finish: string[];
  images: {
    imageMain: string;
    imageArtTable: string;
    imageWall: string;
    imageBedroom: string;
    imageRoom: string;
    imageLivingRoom: string;
  };
}

export interface ProductImageUpdateInput {
  code: string;
  images: {
    imageMain: string;
    imageArtTable: string;
    imageWall: string;
    imageBedroom: string;
    imageRoom: string;
    imageLivingRoom: string;
  };
}

export interface ProductFilterInput {
  color?: string[];
  fabric?: string[];
  series?: string[];
  finish?: string[];
  priceRange?: [number, number];
}

export interface ProductAttributes {
  getUniqueColors: string[];
  getUniqueFabrics: string[];
  getUniqueSeries: string[];
  getUniqueFinishes: string[];
}