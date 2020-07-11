const mongoose = require("mongoose");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const Group = require("../../models/group");
const Project = require("../../models/project");
const Template = require("../../models/template");

module.exports = {
  deleteProject: async ({ projectId }, { errorName, req }) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      //delete all groups of this project
      var groups = await Group.find({
        projectId: projectId,
      });
      console.log("1");
      for (var l = 0; l < groups.length; l++) {
        var group = await Group.findOne({
          _id: groups[l]._id.toString(),
        });
        console.log(group);
        console.log("2");
        for (var p = 0; p < group.templateList.length; p++) {
          templateId = group.templateList[p].templateId;
          console.log("2.5");
          await Template.deleteOne({
            _id: templateId.toString(),
          });
        }
        console.log("3");
        await Group.deleteOne({
          _id: groups[l]._id,
        });
      }

      // delete project
      var result = await Project.deleteOne({
        _id: projectId,
      });
      console.log(result);
      if (result.deletedCount === 0) {
        throw errorName.PROJECT_DELETION_ERROR;
      }

      var projects = await Project.find({
        userId: req.userId,
      });

      return { projects: projects };
    } catch (err) {
      throw new Error(err);
    }
  },
  getAllProjects: async ({}, { errorName, req }) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }
      var projects = await Project.find({
        userId: req.userId,
      });

      return { projects: projects };
    } catch (err) {
      throw new Error(err);
    }
  },

  createProject: async ({ name }, { errorName, req }) => {
    // console.log(req);
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      //check if project name already exists for this user
      const existingProject = await Project.findOne({
        userId: req.userId,
        name: name,
      });

      if (existingProject) {
        throw errorName.PROJECT_NAME_TAKEN;
      }

      const project = new Project({
        userId: req.userId,
        name: name,
        groupCount: 0,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });

      await project.save();

      var projects = await Project.find({
        userId: req.userId,
      });

      return { projects: projects };
    } catch (err) {
      throw new Error(err);
    }
  },
};
