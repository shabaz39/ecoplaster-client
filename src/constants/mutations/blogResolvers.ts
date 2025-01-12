import { gql } from "@apollo/client";

const GET_ALL_BLOGS = gql`
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

const CREATE_BLOG = gql`
  mutation CreateBlog($input: BlogInput!, $files: [Upload]!) {
    createBlog(input: $input, files: $files) {
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
    }
  }
`;

const PUBLISH_BLOG = gql`
  mutation PublishBlog($id: ID!) {
    publishBlog(id: $id) {
      id
      published
      url
    }
  }
`;

const DELETE_BLOG = gql`
  mutation DeleteBlog($id: ID!) {
    deleteBlog(id: $id)
  }
`;