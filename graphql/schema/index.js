const { buildSchema } = require("graphql");
//const { gql } = require("apollo-server-express");
const { GraphQLJSON } = require("graphql-scalars");
const newLocal = `
  scalar Date
  scalar JSON

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

  type TemplateReturn{
    
    data:[JSON]
    idList:String!
    count:String!
    toolTip:String!
    overLay:String!
  }



 input TemplateInput{
  templateId:String!
  data:[JSON]
  idList:String!
  count:String!
  DOMString:String!
  toolTip:String!
  overLay:String!
}


type ProjectReturn{
  projectId: String!
  name: String!
  updatedAt:Date!
}

type AllProjectsReturn{
  projects:[JSON]!
}

type GroupReturn{
  groupId:String!
  name:String!
  templateList:[JSON]!
}

type AllGroupsReturn{
  groups:[JSON]!
}

type AllTemplatesReturn{
  templates:[JSON]!
}

type CreateTemplateReturn{
  groups:[JSON]!
  template:JSON!
}

type ComponentTemplatesReturn{
  componentTemplates:JSON!
}

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    loadUser(email: String!): AuthData!
    sendVerifyEmail(email: String!): AuthData!
    getProfile: ProfileData!
    resetPasswordEmail: resetPasswordReturn!
    resetPasswordAllowed(resetPasswordToken: String!): resetPasswordReturn!
    resetPassword(email: String, password: String): resetPasswordReturn!

    
    getAllProjects:AllProjectsReturn!
    getAllGroups(projectId:String!):AllGroupsReturn!
    getAllTemplatesInGroup(groupId:String!): AllTemplatesReturn!
    getTemplate(templateId : String!):TemplateReturn!

    getAllComponentTemplates:ComponentTemplatesReturn!

  }
  type RootMutation {
    createUser(userInput: UserInput): AuthData!
    loginUserSocial(socialLoginInput: SocialLoginInput): AuthData!
    updateProfile(profileInput: ProfileInput): ProfileData!
    uploadProfilePic: ProfilePicReturn!
    createFirstProject(email:String!, name:String!): AuthData!



    
    createProject(name:String!): AllProjectsReturn!
    deleteProject(projectId:String!): AllProjectsReturn!
    
    createGroup(projectId:String!, name:String!):AllGroupsReturn!
    deleteGroup(groupId:String!, projectId:String!): AllGroupsReturn!
    
    createTemplateInGroup(groupId:String!, projectId:String!, templateName:String!, groupName:String!):CreateTemplateReturn!
    deleteTemplateInGroup(templateId:String!, groupId:String!, projectId:String!):AllGroupsReturn!
    changeTemplateOrder(groupId:String!, projectId:String!, droppedIndex:Int!, draggedIndex:Int!):AllGroupsReturn!
    passTemplateInGroup(templateId:String!, inGroupId:String!, passToGroupId:String!, projectId:String!):AllGroupsReturn!


    saveTemplate(templateInput: TemplateInput): TemplateReturn!


  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;
const resolveFunctions = {
  JSON: GraphQLJSON,
};
module.exports = buildSchema(newLocal);
