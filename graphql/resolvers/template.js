const mongoose = require("mongoose");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const Template = require("../../models/template");
const Group = require("../../models/group");
const Project = require("../../models/project");

module.exports = {
  getAllTemplatesInGroup: async ({ groupId }, { errorName, req }) => {
    try {
      var group = await Group.findOne({
        _id: groupId.toString(),
      });
      var templates = [];

      for (var i = 0; i < group.templateList.length; i++) {
        var template = await Template.findOne({
          _id: group.templateList[i].templateId,
        });
        templates.push({
          id: template._id,
          DOMString: template.DOMString,
          toolTip: template.toolTip,
          overLay: template.overLay,
        });
      }
      console.log(templates);
      return { templates };
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteTemplateInGroup: async (
    { templateId, groupId, projectId },
    { errorName, req }
  ) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      // in this group, template is present currently
      var group = await Group.findOne({
        _id: groupId,
      });

      var groupList;
      var index;
      console.log("1");
      //first delete current group from chip list of other groups, in which template is present.
      for (var i = 0; i < group.templateList.length; i++) {
        if (group.templateList[i].templateId.toString() === templateId) {
          groupList = [...group.templateList[i].groupList];
          index = i;
          break;
        }
      }

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

          for (var j = 0; j < otherGroup.templateList.length; j++) {
            if (
              otherGroup.templateList[j].templateId.toString() === templateId
            ) {
              var otherGroupList = [...otherGroup.templateList[j].groupList];

              for (var k = 0; k < otherGroupList.length; k++) {
                if (otherGroupList[k].groupId.toString() === groupId) {
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
      console.log("3");
      group.templateList.splice(index, 1);

      await group.save();

      var project = await Project.findOne({
        _id: projectId,
      });
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

  passTemplateInGroup: async (
    { templateId, inGroupId, passToGroupId, projectId },
    { errorName, req }
  ) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      // in this group, template is present currently
      var inGroup = await Group.findOne({
        _id: inGroupId,
      });

      var passToGroup = await Group.findOne({
        _id: passToGroupId,
      });

      var groupList;
      console.log("1");
      //check if template name already exists for this group
      for (var i = 0; i < inGroup.templateList.length; i++) {
        console.log(inGroup.templateList[i]);
        if (inGroup.templateList[i].templateId.toString() === templateId) {
          groupList = [...inGroup.templateList[i].groupList];
          break;
        }
      }
      console.log("2");

      for (var i = 0; i < groupList.length; i++) {
        if (groupList[i].groupId.toString() === passToGroupId) {
          throw errorName.PASS_TO_GROUP_ERROR;
        }
      }

      console.log("3");
      var index;
      groupList.push({ groupId: passToGroupId, name: passToGroup.name });
      console.log(groupList);
      for (var i = 0; i < inGroup.templateList.length; i++) {
        if (inGroup.templateList[i].templateId.toString() === templateId) {
          inGroup.templateList[i].groupList = groupList;
          index = i;
          passToGroup.templateList.push(inGroup.templateList[i]);
          break;
        }
      }

      for (var i = 0; i < inGroup.templateList.length; i++) {
        console.log("A");
        if (inGroup.templateList[i].templateId.toString() === templateId) {
          for (var j = 0; j < inGroup.templateList[i].groupList.length; j++) {
            console.log("B");
            if (
              inGroup.templateList[i].groupList[j].groupId.toString() !==
                inGroupId &&
              inGroup.templateList[i].groupList[j].groupId.toString() !==
                passToGroupId
            ) {
              console.log("C");
              var otherGroup = await Group.findOne({
                _id: inGroup.templateList[i].groupList[j].groupId,
              });
              console.log(otherGroup);

              for (var k = 0; k < otherGroup.templateList.length; k++) {
                if (
                  otherGroup.templateList[k].templateId.toString() ===
                  templateId
                ) {
                  console.log("D");
                  otherGroup.templateList[k] = inGroup.templateList[index];
                  const res = await Group.updateOne(
                    { _id: otherGroup._id },
                    { $set: { templateList: otherGroup.templateList } }
                  );
                }
              }
            }
          }
        }
      }

      console.log("4");
      const res = await Group.updateOne(
        { _id: inGroupId },
        { $set: { templateList: inGroup.templateList } }
      );

      await passToGroup.save();

      console.log(res);
      var project = await Project.findOne({
        _id: projectId,
      });
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

  changeTemplateOrder: async (
    { groupId, projectId, droppedIndex, draggedIndex },
    { errorName, req }
  ) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      var group = await Group.findOne({
        _id: groupId,
      });
      console.log(group.templateList);
      var temp = group.templateList[droppedIndex];
      group.templateList[droppedIndex] = group.templateList[draggedIndex];
      group.templateList[draggedIndex] = temp;
      console.log(group.templateList);

      temp = group.templateList;
      group.templateList = [];
      group.templateList = temp;

      await group.save();
      var groups = await Group.find({
        projectId: projectId,
      });

      return { groups };
    } catch (err) {
      throw new Error(err);
    }
  },

  createTemplateInGroup: async (
    { groupId, projectId, templateName, groupName },
    { errorName, req }
  ) => {
    try {
      if (req.isAuth === false) {
        throw errorName.USER_NOT_AUTHENTICATED;
      }

      var group = await Group.findOne({
        _id: groupId,
      });

      //check if template name already exists for this group
      for (var i = 0; i < group.templateList.length; i++) {
        if (group.templateList[i].name === templateName) {
          throw errorName.TEMPLATE_NAME_TAKEN;
        }
      }

      const template = new Template({
        data: [],
        idList: [],
        count: 1,
        DOMString: "",
        name: templateName,
        toolTip: false,
        overLay: true,
      });

      group.templateList.push({
        templateId: template._id,
        name: template.name,
        groupList: [{ groupId: groupId, name: groupName }],
      });
      var project = await Project.findOne({
        _id: projectId,
      });
      project.updatedAt = Date.now();

      await project.save();
      await group.save();
      await template.save();

      var groups = await Group.find({
        projectId: projectId,
      });

      return { groups, template };
    } catch (err) {
      throw new Error(err);
    }
  },
  saveTemplate: async ({ templateInput }, { errorName, req }) => {
    console.log("inside save template");

    try {
      console.log(templateInput);

      var template = await Template.findOne({
        _id: templateInput.templateId,
      });
      console.log(templateInput);

      if (!template) {
        throw errorName.INVALID_TEMPLATE_ID;
      }
      var idList = templateInput.idList;
      if (idList === "") idList = [];
      else idList = idList.split(",").map(Number);

      template.data = templateInput.data;
      template.idList = idList;
      template.DOMString = templateInput.DOMString;
      template.count = parseInt(templateInput.count);
      template.toolTip = templateInput.toolTip === "true";
      template.overLay = templateInput.overLay === "true";
      console.log(template.toolTip, template.overLay);

      await template.save();
      return {
        data: template.data,
        idList: template.idList.join(","),
        count: template.count.toString(),
        toolTip: template.toolTip,
        overLay: template.overLay,
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  getTemplate: async ({ templateId }, { errorName, req }) => {
    try {
      var template = await Template.findOne({
        _id: templateId,
      });

      if (!template) {
        throw errorName.INVALID_TEMPLATE_ID;
      }
      return {
        data: template.data,
        idList: template.idList.join(","),
        count: template.count.toString(),
        toolTip: template.toolTip === true ? "true" : "false",
        overLay: template.overLay === true ? "true" : "false",
      };
    } catch (err) {
      throw new Error(err);
    }
  },
};
