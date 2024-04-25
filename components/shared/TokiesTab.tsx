import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";


import TokyCard from "../cards/TokyCard";
import { fetchUserPosts } from "@/lib/actions/user.action";

interface Result {
  name: string;
  image: string;
  id: string;
  tokies: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function TokiesTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }
  const reversedTokies = [...result.tokies].reverse();
  return (
    <section className='mt-9 flex flex-col gap-10'>
      {reversedTokies.map((toky) => (
        <TokyCard
          key={toky._id}
          id={toky._id}
          currentUserId={currentUserId}
          parentId={toky.parentId}
          content={toky.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: toky.author.name,
                  image: toky.author.image,
                  id: toky.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : toky.community
          }
          createdAt={toky.createdAt}
          comments={toky.children}
        />
      ))}
    </section>
  );
}

export default TokiesTab;