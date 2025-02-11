import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

async function Page() {
    const user = await currentUser();
    if (!user) return <h1 className="head-text text-left">No current user found, Please login.</h1>

    const userInfo = fetchUser(user.id);

    return (
        <>
            <h1 className="head-text text-left">Create Thread</h1>
            <PostThread userId={userInfo._id} />
        </>
    )
}


export default Page;