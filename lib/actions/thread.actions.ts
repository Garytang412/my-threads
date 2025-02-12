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

