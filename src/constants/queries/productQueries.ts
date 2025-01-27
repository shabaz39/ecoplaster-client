import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      code
      color
      series
      finish
      price {
        mrp
        offerPrice
      }
      images {
        imageMain
      imageArtTable
      imageWall
      imageBedroom
      imageRoom
      imageLivingRoom
      }
    }
  }
`;

export const FILTER_PRODUCTS = gql`
  query FilterProducts($color: String, $fabric: String, $priceRange: [Float], $series: String, $finish: String) {
  filterProducts(color: $color, fabric: $fabric, priceRange: $priceRange, series: $series, finish: $finish) {
    id
    name
    code
    color
    fabric
    price {
      mrp
      offerPrice
    }
    series
    finish
    images {
      imageMain
      imageArtTable
      imageWall
      imageBedroom
      imageRoom
      imageLivingRoom
    }
  }
}
`;
