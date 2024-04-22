import TokyCard from "@/components/cards/TokyCard";
import { fetchTokyById } from "@/lib/actions/toky.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const toky = await fetchTokyById(params.id);

  return (
    <section className="relative">
      <div>
        <TokyCard
          key={toky._id}
          id={toky._id}
          currentUserId={user?.id || ""}
          parentId={toky.parentId}
          content={toky.text}
          author={toky.author}
          community={toky.community}
          createdAt={toky.createdAt}
          comments={toky.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          tokyId={toky.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {toky.children.map((childItem: any) => (
          <TokyCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
