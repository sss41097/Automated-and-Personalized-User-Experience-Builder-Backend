const { buildSchema } = require("graphql");
//const { gql } = require("apollo-server-express");

const newLocal = `
  scalar Date

  type AuthData {
    email: String!
    userId: ID!
    token: String!
    isEmailVerified: Boolean!
    isFirstProjectCreated: Boolean!
  }

  type ProfileData {
    firstName: String!
    lastName: String!
    maritialStatus: Boolean
    dob: Date
    mobileNumber: Int
    userId: ID!
    profilePicUrl: String
  }

  input UserInput {
    email: String!
    password: String!

  }

  input SocialLoginInput {
    email: String!
    firstName: String
    lastName: String
  }

  input ProfileInput {
    firstName: String
    lastName: String
    maritialStatus: Boolean
    dob: String
    mobileNumber: Int
  }

  type resetPasswordReturn {
    email: String!
  }

  type ProfilePicReturn {
    url: String!
  }

  type emailReturn{
    email:String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    loadUser(email: String!): AuthData!
    sendVerifyEmail(email: String!): AuthData!
    getProfile: ProfileData!
    resetPasswordEmail: resetPasswordReturn!
    resetPasswordAllowed(resetPasswordToken: String!): resetPasswordReturn!
    resetPassword(email: String, password: String): resetPasswordReturn!
  }
  type RootMutation {
    createUser(userInput: UserInput): AuthData!
    loginUserSocial(socialLoginInput: SocialLoginInput): AuthData!
    updateProfile(profileInput: ProfileInput): ProfileData!
    uploadProfilePic: ProfilePicReturn!
    createFirstProject(email:String!): AuthData!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;
module.exports = buildSchema(newLocal);
