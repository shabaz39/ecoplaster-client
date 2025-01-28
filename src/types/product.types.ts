export interface Product {
    id: string;
    name: string;
    code: string;
    price: {
      mrp: number;
      offerPrice: number;
    };
    color: string[];
    fabric: string[];
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

  export interface FiltersType {
    color?: string[];
    fabric?: string[];
    priceRange?: [number, number];
    series?: string[];
    finish?: string[];
  }