// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { hashPassword, comparePasswords } from "../../utils/bcrypt.js";

export const resolvers = {
  Query: {
    getJobs: async (root, args, { user }) => {
      const jobs = await Job.find({ createdBy: user._id });
      return jobs;
    },
    getJob: async (root, args, { user }) => {
      const job = await Job.findOne({ _id: args.id, createdBy: user._id });
      return job;
    },
    allUsers: async () => {
      const users = await User.find({}).populate("jobs");
      return users;
    },
    me: (root, args, contextValue) => {
      // console.log("contextValue: " + contextValue.user);
      return contextValue.user;
    },
  },

  Mutation: {
    registerUser: async (root, { name, email, password }) => {
      const hashedPassword = await hashPassword(password);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      return user;
    },

    loginUser: async (root, args) => {
      const { email, password } = args;

      const user = await User.findOne({ email });
      if (!user) throw new Error("wrong credentials");

      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) throw new Error("wrong credentials");

      const token = user.createJWT();
      return token;
    },

    createJob: async (root, args, { user }) => {
      if (!user) throw new Error("not authenticated");

      const job = await Job.create({ ...args, createdBy: user._id });
      try {
        // add the new job to the user.jobs array
        user.jobs = user.jobs.concat(job);
        await user.save();
      } catch (error) {
        console.log(error);
      }
      return job;
    },

    deleteJob: async (root, args, { user }) => {
      if (!user) throw new Error("not authenticated");

      const job = await Job.findByIdAndRemove({
        _id: args.id,
        createdBy: user._id,
      });
      if (!job) throw Error(`No job with id:${id}`);
      return "Job Deleted";
    },

    updateJob: async (root, args, { user }) => {
      if (!user) throw new Error("not authenticated");

      const job = await Job.findByIdAndUpdate(
        {
          _id: args.id,
          createdBy: user._id,
        },
        { ...args },
        { new: true, runValidators: true }
      );
      console.log(job);
      if (!job) throw Error(`No job with id:${id}`);
      return job;
    },
  },
};
