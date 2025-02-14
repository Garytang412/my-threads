import ThreadCard from "@/components/cards/ThreadCart";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const Page = async (
    { params }: { params: { id: string } }
) => {
    if (!params.id) { return null; }

    const user = await currentUser();
    if (!user) { return null; }
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) { redirect('/onboarding'); }

    const thread = await fetchThreadById(params.id);

    return (
        <section className="relative">
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createAt={thread.createAt}
                comments={thread.children}
            />
        </section>
    )
};


export default Page;