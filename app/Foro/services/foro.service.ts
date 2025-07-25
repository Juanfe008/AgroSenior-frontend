const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_URL = API_BASE_URL + "/foro";

export interface CreatePostDto {
  title: string;
  content: string;
  userId: number;
  parentPostId?: number;
}

export interface UpdatePostDto {
  title?: string; 
  content?: string; 
  imageUrl?: string; 
  parentPostId?: number | null; 
}

export interface CreatePostLikeDto {
  postId: number;
  userId: number;
}

export interface RemovePostLikeDto {
  postId: number;
  userId: number;
}

export const createPost = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const getPosts = async (userId: number) => {
  const response = await fetch(`${API_URL}/posts?userId=${userId}`, {
    method: 'GET',
  });
  return response.json();
};

export const updatePost = async (postId: number, updatePostDto: UpdatePostDto) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatePostDto),
  });
  return response.json();
};

export const deletePost = async (postId: number, userId: number) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),  
  });
  return response.json();
};

export const addLike = async (createPostLikeDto: CreatePostLikeDto) => {
  const response = await fetch(`${API_URL}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPostLikeDto),
  });
  return response.json();
};

export const removeLike = async (removePostLikeDto: RemovePostLikeDto) => {
  const response = await fetch(`${API_URL}/likes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(removePostLikeDto),
  });
  return response.json();
};
