export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
  ## RETURN TYPES

  type User {
    id:ID!
    name: String!
    email: String!
    jobs: [Job]!
  }

  type Job {
    id: ID!
    company: String!
    position: String!
    status: String!
    createdBy: String!
  }




  type Query{
    getJobs: [Job]
    getJob(id: ID!):Job
    allUsers: [User]
    me: User
  }

  type Mutation {
    registerUser (
      name: String!
      email: String!
      password: String!
    ): User

    loginUser (
      email: String!
      password: String!
    ): String

    createJob(
      company: String!
      position: String!
      ): Job
    
    updateJob(
      id: ID!
      company:String
      position: String
      status: String
      ): Job

    deleteJob(id: ID!):String
  }

`;
