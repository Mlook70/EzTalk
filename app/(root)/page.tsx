import { UserButton, currentUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/thread.action";
import ThreadCard from "@/components/cards/ThreadCard";

const Home = async () => {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No tokies found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parent_id}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
      <div className="h-screen">
        <UserButton />
      </div>
    </>
  );
};

export default Home;
