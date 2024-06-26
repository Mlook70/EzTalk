import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import DeleteToky from "../forms/DeleteToky";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  imageurl: string; // Prop for image URL
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
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function TokyCard({
  id,
  currentUserId,
  parentId,
  content,
  imageurl, // Receive image URL as prop
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 sm:px-4 md:px-7" : "bg-dark-2 p-4 md:p-7"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            {imageurl && (
              <div className="mt-3">
                <Image
                  src={imageurl}
                  alt="Post Image"
                  width={400}
                  height={400}
                  className="w-full max-w-md"
                />
              </div>
            )}
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Link href={`/toky/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="reply-icon object-contain"
                  />
                </Link>
                <div className="delete-icon">
                  <DeleteToky
                    tokyId={JSON.stringify(id)}
                    currentUserId={currentUserId}
                    authorId={author.id}
                    parentId={parentId}
                    isComment={isComment}
                  />
                </div>
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/toky/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="cursor-pointer object-contain">
          <p className="text-subtle-medium text-gray-1 mt-2 sm:mt-0">
            {formatDateString(createdAt)}
          </p>
          {!isComment && community && (
            <Link
              href={`/communities/${community.id}`}
              className="mt-1 flex items-center"
            >
              <p className="text-subtle-medium text-gray-1">
                {community && ` - ${community.name} Community`}
              </p>
              <Image
                src={community.image}
                alt={community.name}
                width={14}
                height={14}
                className="ml-1 rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      </div>
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}
          <Link href={`/toky/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
    </article>
  );
}

export default TokyCard;
