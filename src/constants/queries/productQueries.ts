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

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      code
      color
      fabric
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
`

export const FILTER_PRODUCTS = gql`
 query FilterProducts($fabric: [String], $priceRange: [Float], $series: [String], $finish: [String], $color: [String]) {
  filterProducts(fabric: $fabric, priceRange: $priceRange, series: $series, finish: $finish, color: $color) {
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
