import { gql } from '@apollo/client';

export const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    getAllBlogs {
      id
      title
      mainImage {
        imageUrl
        imageId
      }
      body
      metaTags
      author
      published
      slug
      url
      createdAt
    }
  }
`;

export const CREATE_BLOG = gql`
  mutation CreateBlog($input: BlogInput!, $files: [Upload]!) {
    createBlog(input: $input, files: $files) {
        id
    title
    mainImage {
      imageUrl
      imageId
    }
    body
    images {
      imageUrl
      imageId
    }
    metaTags
    author
    published
    createdAt
    updatedAt
    url
    slug
  }
  }
`;

export const UPDATE_BLOG = gql`
  mutation UpdateBlog($id: ID!, $input: BlogInput!, $files: [Upload]) {
    updateBlog(id: $id, input: $input, files: $files) {
      id
      title
      mainImage {
        imageUrl
        imageId
      }
      body
      metaTags
      author
      published
      slug
      url
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation DeleteBlog($id: ID!) {
    deleteBlog(id: $id)
  }
`;

export const PUBLISH_BLOG = gql`
  mutation PublishBlog($id: ID!) {
    publishBlog(id: $id) {
      id
      published
      url
      slug
    }
  }
`;

export const UNPUBLISH_BLOG = gql`
  mutation UnpublishBlog($id: ID!) {
    unpublishBlog(id: $id) {
      id
      published
    }
  }
`;