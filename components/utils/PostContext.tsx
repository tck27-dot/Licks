import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Children,
} from "react";
import Post from "@/types/post";

type PostContextType = {
  posts: Post[];
  addPosts: (posts: Post[]) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPosts = (posts: Post[]) => {
    setPosts(posts);
  };
  return (
    <PostContext.Provider value={{ posts, addPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("useVideos must be used within a VideoProvider");
  }
  return context;
};
