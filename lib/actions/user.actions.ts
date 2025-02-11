'use server';
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";


interface UserParams {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}


export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
}: UserParams): Promise<void> {
    await connectToDB();
    try {
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
        throw new Error(`Failed to create/update user: ${error.message}`)
    }

}