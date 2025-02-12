import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return <h1 className="head-text text-left">No current user found, Please login.</h1>

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) { redirect('/onboarding'); }


    return (
        <>
            <h1 className="head-text text-left">Create Thread</h1>
            <PostThread userId={userInfo._id.toString()} />
        </>
    )
}


export default Page;