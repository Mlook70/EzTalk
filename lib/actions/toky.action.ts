"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";

import Community from "../models/community.model";
import Toky from "../models/toky.models";
import mongoose from "mongoose";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Toky.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Toky.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
  image?:string;
}

export async function createToky({ text, author, communityId, path,image }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdToky = await Toky.create({
      text,
      author,
      community: communityIdObject, 
      image,
      // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { tokies: createdToky._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { tokies: createdToky._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create toky: ${error.message}`);
  }
}

async function fetchAllChildTokies(tokyId: string): Promise<any[]> {
  const childTokies = await Toky.find({ parentId: tokyId });

  const descendantTokies = [];
  for (const childToky of childTokies) {
    const descendants = await fetchAllChildTokies(childToky._id);
    descendantTokies.push(childToky, ...descendants);
  }

  return descendantTokies;
}

export async function deleteToky(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainToky = await Toky.findById(id).populate("author community");

    if (!mainToky) {
      throw new Error("Toky not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantTokies = await fetchAllChildTokies(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantTokyIds = [
      id,
      ...descendantTokies.map((toky) => toky._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantTokies.map((toky) => toky.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainToky.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantTokies.map((toky) => toky.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainToky.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Toky.deleteMany({ _id: { $in: descendantTokyIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { tokies: { $in: descendantTokyIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { tokies: { $in: descendantTokyIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete toky: ${error.message}`);
  }
} 

export async function fetchTokyById(tokyId: string) {
  connectToDB();

  try {
    const toky = await Toky.findById(tokyId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Toky, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return toky;
  } catch (err) {
    console.error("Error while fetching toky:", err);
    throw new Error("Unable to fetch toky");
  }
}

export async function addCommentToToky(
  tokyId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalToky = await Toky.findById(tokyId);

    if (!originalToky) {
      throw new Error("Toky not found");
    }

    // Create the new comment thread
    const commentToky = new Toky({
      text: commentText,
      author: userId,
      parentId: tokyId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentToky = await commentToky.save();

    // Add the comment thread's ID to the original thread's children array
    originalToky.children.push(savedCommentToky._id);

    // Save the updated original thread to the database
    await originalToky.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

// actions.ts
export async function fetchLikes(tokyId: string): Promise<number> {
  try {
    const toky = await Toky.findById(tokyId);
    if (!toky) {
      throw new Error('Toky not found');
    }
    return toky.likes.length; // Return the length of the likes array
  } catch (error) {
    console.error('Error while fetching likes:', error);
    throw new Error('Unable to fetch likes');
  }
}


export async function toggleLike(tokyId: string, userId: string): Promise<void> {
  try {
    const toky = await Toky.findById(tokyId);
    if (!toky) {
      throw new Error('Toky not found');
    }
    const index = toky.likes.indexOf(userId);
    if (index !== -1) {
      // User already liked, remove like
      toky.likes.splice(index, 1);
    } else {
      // User not liked, add like
      toky.likes.push(userId);
    }
    await toky.save();
  } catch (error) {
    console.error('Error while toggling like:', error);
    throw new Error('Unable to toggle like');
  }
}


export async function likeToky(tokyId: string, userId: string): Promise<void> {
  try {
    // Check if the provided tokyId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(tokyId)) {
      throw new Error('Invalid tokyId format');
    }

    // Your MongoDB query to like the toky
    // Make sure to handle the tokyId properly in your query

  } catch (error) {
    console.error('Error while liking Toky:', error);
    throw new Error('Unable to like Toky');
  }
}
// toky.action.ts

export async function checkIfLiked(tokyId: string, userId: string): Promise<boolean> {
  try {
    const toky = await Toky.findById(tokyId);
    if (!toky) {
      throw new Error('Toky not found');
    }
    return toky.likes.includes(userId); // Check if the userId is in the likes array
  } catch (error) {
    console.error('Error while checking if liked:', error);
    throw new Error('Unable to check if liked');
  }
}
