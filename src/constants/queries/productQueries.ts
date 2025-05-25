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
      imageSecondLivingRoom
      }
    }
  }
`;

export const GET_SERIES_PRODUCTS = gql`
 query GetSeriesProducts($series: String!) {
  getSeriesProducts(series: $series) {
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
      imageSecondLivingRoom
    }
    searchKeywords
    searchScore
    slug
    url
    createdAt
    updatedAt
    lastSearched
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
        imageSecondLivingRoom 
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
      imageSecondLivingRoom 
    }
  }
}
`

  

export const GET_PRODUCT_ATTRIBUTES = gql`
  query GetProductAttributes {
    getUniqueColors
    getUniqueFabrics
    getUniqueSeries
    getUniqueFinishes
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $limit: Int) {
    searchProducts(query: $query, limit: $limit) {
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
      }
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
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
        imageSecondLivingRoom 
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
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
        imageSecondLivingRoom 
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const ADD_MULTIPLE_PRODUCTS = gql`
  mutation AddMultipleProducts($inputs: [ProductInput!]!) {
    addMultipleProducts(inputs: $inputs) {
      id
      name
      code
    }
  }
`;

export const UPDATE_PRODUCT_SEARCH_FIELDS = gql`
  mutation UpdateProductSearchFields($productId: ID) {
    updateProductSearchFields(productId: $productId)
  }
`;

export const MIGRATE_PRODUCTS_TO_SEARCH_SCHEMA = gql`
  mutation MigrateProductsToSearchSchema($batchSize: Int) {
    migrateProductsToSearchSchema(batchSize: $batchSize)
  }
`;

export const REVERT_PRODUCT_SEARCH_MIGRATION = gql`
  mutation RevertProductSearchMigration {
    revertProductSearchMigration
  }
`;

export const UPDATE_PRODUCT_IMAGES_BY_CODE = gql`
  mutation UpdateProductImagesByCode($input: [ProductImageUpdateInput!]!) {
    updateProductImagesByCode(input: $input)
  }
`;
