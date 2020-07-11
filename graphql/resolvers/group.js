const mongoose = require("mongoose");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const Group = require("../../models/group");
const Project = require("../../models/project");
const Template = require("../../models/template");
const { printIntrospectionSchema } = require("graphql");

module.exports = {
  deleteGroup: async ({ groupId, projectId }, { errorName, req }) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      var templateId;
      var groupList;
      var index;

      var group = await Group.findOne({
        _id: groupId,
      });

      // first delete all templates from group

      for (var p = 0; p < group.templateList.length; p++) {
        templateId = group.templateList[p].templateId;
        groupList = [...group.templateList[p].groupList];
        index = p;
        console.log("1");
        console.log(templateId);

        // if template present only in this group, delete template also from database.
        if (groupList.length === 1) {
          var result = await Template.deleteOne({
            _id: templateId,
          });
        }

        console.log("2");

        for (var i = 0; i < groupList.length; i++) {
          if (groupList[i].groupId.toString() !== groupId) {
            var otherGroup = await Group.findOne({
              _id: groupList[i].groupId.toString(),
            });
            console.log("3");
            console.log(otherGroup);
            for (var j = 0; j < otherGroup.templateList.length; j++) {
              if (
                otherGroup.templateList[j].templateId.toString() ===
                templateId.toString()
              ) {
                console.log("4");
                var otherGroupList = [...otherGroup.templateList[j].groupList];

                for (var k = 0; k < otherGroupList.length; k++) {
                  if (otherGroupList[k].groupId.toString() === groupId) {
                    console.log("5");
                    otherGroupList.splice(k, 1);
                    otherGroup.templateList[j].groupList = otherGroupList;
                    await Group.updateOne(
                      { _id: otherGroup._id },
                      { $set: { templateList: otherGroup.templateList } }
                    );
                  }
                }
              }
            }
          }
        }
      }

      var result = await Group.deleteOne({
        _id: groupId,
      });
      console.log(result);
      if (result.deletedCount === 0) {
        throw errorName.GROUP_DELETION_ERROR;
      }

      // update project details
      var project = await Project.findOne({
        _id: projectId,
      });

      project.groupCount = project.groupCount - 1;
      project.updatedAt = Date.now();

      await project.save();

      var groups = await Group.find({
        projectId: projectId,
      });

      return { groups };
    } catch (err) {
      throw new Error(err);
    }
  },

  getAllGroups: async ({ projectId }, { errorName, req }) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }
      var groups = await Group.find({
        projectId: projectId,
      });

      return { groups };
    } catch (err) {
      throw new Error(err);
    }
  },

  createGroup: async ({ projectId, name }, { errorName, req }) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      //check if group name already exists for this project
      const existingGroup = await Group.findOne({
        projectId: projectId,
        name: name,
      });

      if (existingGroup) {
        throw errorName.GROUP_NAME_TAKEN;
      }

      const group = new Group({
        projectId: projectId,
        name: name,
        templateList: [],
      });

      var project = await Project.findOne({
        _id: projectId,
      });

      project.groupCount = project.groupCount + 1;
      project.updatedAt = Date.now();

      await group.save();
      await project.save();

      var groups = await Group.find({
        projectId: projectId,
      });

      return { groups };
    } catch (err) {
      throw new Error(err);
    }
  },
};
