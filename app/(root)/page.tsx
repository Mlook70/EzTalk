import { UserButton, currentUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/toky.action";
import TokyCard from "@/components/cards/TokyCard";

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
              <TokyCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parent_id}
                content={post.text}
                imageurl={post.imageUrl} // Pass the image URL here
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
      </div>
    </>
  );
};

export default Home;
