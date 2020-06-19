const mongoose = require("mongoose");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const Component = require("../../models/component");

module.exports = {
  testComponent: async ({ componentInput }, req) => {
    console.log(componentInput);
    //console.log(req.headers.data);
    try {
      return {
        projectId: "dsa",
        data: JSON.stringify(componentInput.data),
        idList: componentInput.idList,
        count: componentInput.count,
        componentId: componentInput.componentId,
      };
      // var component = await Component.findOne({
      //   _id: componentInput.componentId,
      // });
      // console.log("Yooeoa");
      // if (!component) {
      //   throw new Error("Component does not exist.");
      // }
      // var idList = componentInput.idList;
      // if (idList === "") idList = [];
      // else idList = idList.split(",").map(Number);
      // var data = req.headers.data;
      // console.log(data);
      // data = JSON.parse(data);
      // component.data = data;
      // component.idList = idList;
      // component.count = parseInt(componentInput.count);
      // await component.save();
      // return {
      //   projectId: component.projectId,
      //   data: JSON.stringify(component.data),
      //   idList: component.idList.join(","),
      //   count: component.count.toString(),
      //   componentId: component.id.toString(),
      // };
    } catch (err) {
      throw new Error(err);
    }
  },

  getComponent: async ({ componentId }, req) => {
    try {
      var component = await Component.findOne({
        _id: componentId,
      });

      if (!component) {
        throw new Error("Component does not exist.");
      }
      return {
        projectId: component.projectId,
        data: JSON.stringify(component.data),
        idList: component.idList.join(","),
        count: component.count.toString(),
        componentId: component.id.toString(),
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  createComponent: async ({ projectId }, req) => {
    console.log(projectId);
    try {
      const component = new Component({
        projectId: projectId,
        data: { ignore: "ignore" },
        idList: [],
        count: 1,
      });

      await component.save();

      return {
        projectId: component.projectId,
        data: JSON.stringify(component.data),
        idList: JSON.stringify(component.idList),
        count: component.count,
        componentId: component.id.toString(),
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  saveComponent: async ({ componentInput }, req) => {
    console.log(componentInput);
    //console.log(req.headers.data);
    try {
      var component = await Component.findOne({
        _id: componentInput.componentId,
      });
      console.log("Yooeoa");

      if (!component) {
        throw new Error("Component does not exist.");
      }

      var idList = componentInput.idList;
      if (idList === "") idList = [];
      else idList = idList.split(",").map(Number);

      var data = req.headers.data;
      console.log(data);
      data = JSON.parse(data);

      component.data = data;
      component.idList = idList;
      component.count = parseInt(componentInput.count);

      await component.save();
      return {
        projectId: component.projectId,
        data: JSON.stringify(component.data),
        idList: component.idList.join(","),
        count: component.count.toString(),
        componentId: component.id.toString(),
      };
    } catch (err) {
      throw new Error(err);
    }
  },
};
