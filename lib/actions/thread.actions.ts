'use server'
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface ThreadParams {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}
// Post thread:
export async function createThread({
    text,
    author,
    communityId,
    path
}: ThreadParams) {

    try {
        connectToDB();
        // create thread
        const createdThread = await Thread.create({
            text,
            author,
            community: null, // TODO: need work on community later
        });
        // add thread to the user 
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        });

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Failed to post thread: ${error.message}`);
    }
}

// Get threads(not comments -> parentId: null || undefined):
export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize; // for pagenate:

        const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } }) // no parentId means thread not comment.
            .sort({ createAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            });

        const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
        const threads = await threadsQuery.exec();
        const isNext = totalThreadsCount > skipAmount + threads.length;

        return { threads, isNext }


    } catch (error: any) {
        throw new Error(`Fetch threads error: ${error.message}`);
    }
}

// Get one thread by id
export async function fetchThreadById(threadId: string) {
    try {
        await connectToDB();

        const thread = Thread.findById(threadId)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        select: '_id id name parentId image'
                    }
                ]
            })
            .exec();
        return thread;

    } catch (error: any) {
        throw new Error(`Get one thread error: ${error.message}`);
    }
}