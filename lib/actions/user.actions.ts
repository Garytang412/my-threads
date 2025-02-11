'use server';
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

// for Create/Update user.
interface UserParams {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}

// Create/Update user info.
export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
}: UserParams): Promise<void> {
    try {
        await connectToDB();
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true } // update and insert
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }

}

// fetch user info.
export async function fetchUser(userId: string) {
    try {
        connectToDB();
        return await User.findOne({ id: userId });

    } catch (error: any) {
        throw new Error(`Faild to fetch user: ${error.message}`);
    }

}