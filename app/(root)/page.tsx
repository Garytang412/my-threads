import ThreadCard from "@/components/cards/ThreadCart";
import { fetchThreads } from "@/lib/actions/thread.actions";

export default async function Home() {
  const threadsFetchResult = await fetchThreads(1, 20);
  //console.log(threadsFetchResult.threads[0].text);


  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {threadsFetchResult.threads.length === 0 ? (
          <p className="no-result">
            No threads found!
          </p>
        ) : (
          <>
            {threadsFetchResult.threads.map((thread) => (
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
            )
            )}
          </>
        )}
      </section>
    </>

  );
}
