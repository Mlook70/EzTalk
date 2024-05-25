// LikeButton.tsx
import { useState, useEffect } from "react";
import { toggleLike, checkIfLiked } from "@/lib/actions/toky.action";
import Image from "next/image";

interface Props {
  tokyId: string;
  userId: string;
}

const LikeButton = ({ tokyId, userId }: Props) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if the user has already liked the post
    const fetchLikedStatus = async () => {
      try {
        const isLiked = await checkIfLiked(tokyId, userId);
        setLiked(isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    fetchLikedStatus();
  }, [tokyId, userId]);

  const handleLike = async () => {
    try {
      await toggleLike(tokyId, userId);
      setLiked((prevLiked) => !prevLiked); // Toggle the liked state
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <button onClick={handleLike} className="like-button">
      {liked ? (
        // Render filled heart icon if liked
        <Image
          src="/assets/heart-filled.svg"
          alt="Unlike"
          width={24}
          height={24}
          className="like-icon"
        />
      ) : (
        // Render empty heart icon if not liked
        <Image
          src="/assets/heart-empty.svg"
          alt="Like"
          width={24}
          height={24}
          className="like-icon"
        />
      )}
    </button>
  );
};

export default LikeButton;
