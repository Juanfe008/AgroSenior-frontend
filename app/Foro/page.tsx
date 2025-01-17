'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { addLike, createPost, getPosts, removeLike, deletePost } from './services/foro.service';

type Topic = {
    id: number;
    title: string;
    author: string;
    content: string;
    replies: Topic[];
    likes: number;
    userHasLiked: boolean;
    userId: number;
    imageUrl?: string;
};

const Foro = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicContent, setNewTopicContent] = useState('');
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [parentPostId, setParentPostId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const currentUserId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPosts(currentUserId);
                const formattedPosts = posts.map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    author: `Usuario ${post.userId}`,
                    content: post.content,
                    replies: formatReplies(post.replies),
                    likes: post.likesCount,
                    userHasLiked: post.userHasLiked,
                    userId: post.userId,
                    imageUrl: post.imageUrl,
                }));
                setTopics(formattedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    const formatReplies = (replies: any[]): Topic[] => {
        return replies.map((reply) => ({
            id: reply.id,
            title: reply.title || '',
            author: `Usuario ${reply.userId}`,
            content: reply.content,
            replies: formatReplies(reply.replies),
            likes: reply.likesCount,
            userHasLiked: reply.userHasLiked,
            userId: reply.userId,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNewTopicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopicContent || (!newTopicTitle && !isReplying)) {
            console.warn("El contenido es obligatorio, y el título para nuevos temas.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', isReplying ? '' : newTopicTitle);
            formData.append('content', newTopicContent);
            formData.append('userId', currentUserId.toString());
            if (isReplying && parentPostId) {
                formData.append('parentPostId', parentPostId.toString());
            }
            if (selectedImage) {
                formData.append('file', selectedImage);
            }

            console.log(formData)

            const newPost = await createPost(formData);

            console.log('Response from server:', newPost);

            const newTopic: Topic = {
                id: newPost.id,
                title: newPost.title,
                author: `Usuario ${newPost.userId}`,
                content: newPost.content,
                replies: [],
                likes: newPost.likesCount,
                userHasLiked: newPost.userHasLiked,
                userId: newPost.userId,
                imageUrl: newPost.imageUrl,
            };

            setTopics((prevTopics) => {
                if (isReplying && parentPostId !== null) {
                    return prevTopics.map((topic) => {
                        if (topic.id === parentPostId) {
                            return { ...topic, replies: [...topic.replies, newTopic] };
                        }
                        return topic;
                    });
                }
                return [...prevTopics, newTopic];
            });

            setNewTopicTitle('');
            setNewTopicContent('');
            setIsReplying(false);
            setParentPostId(null);
            setSelectedImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error creating new post:', error);
        }
    };

    const handleTopicSelect = (topic: Topic) => {
        setSelectedTopic(topic);
        setIsReplying(true);
        setParentPostId(topic.id);
    };

    const handleBackToList = () => {
        setSelectedTopic(null);
        setIsReplying(false);
        setNewTopicTitle('');
        setNewTopicContent('');
        setParentPostId(null);
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleDeletePost = async (postId: number) => {
        try {
            const response = await deletePost(postId, currentUserId);
            if (response.success) {
                setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== postId));
                setSelectedTopic(null);
            } else {
                console.error('Failed to delete the post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleAddLike = async (id: number, isReply: boolean = false) => {
        setTopics((prevTopics) =>
            prevTopics.map((topic) => {
                if (isReply) {
                    return {
                        ...topic,
                        replies: topic.replies.map((reply) =>
                            reply.id === id
                                ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                : reply
                        ),
                    };
                }
                return topic.id === id
                    ? { ...topic, userHasLiked: true, likes: topic.likes + 1 }
                    : topic;
            })
        );

        try {
            const response = isReply
                ? await addLike({ postId: id, userId: currentUserId })
                : await addLike({ postId: id, userId: currentUserId });

            if (!response.success) {
                setTopics((prevTopics) =>
                    prevTopics.map((topic) =>
                        topic.id === id
                            ? { ...topic, likes: topic.likes - 1, userHasLiked: false }
                            : topic
                    )
                );
            }
        } catch (error) {
            console.error('Error adding like:', error);
            setTopics((prevTopics) =>
                prevTopics.map((topic) =>
                    topic.id === id
                        ? { ...topic, likes: topic.likes - 1, userHasLiked: false }
                        : topic
                )
            );
        }
    };

    const handleRemoveLike = async (id: number, isReply: boolean = false) => {
        setTopics((prevTopics) =>
            prevTopics.map((topic) => {
                if (isReply) {
                    return {
                        ...topic,
                        replies: topic.replies.map((reply) =>
                            reply.id === id
                                ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                : reply
                        ),
                    };
                }
                return topic.id === id
                    ? { ...topic, userHasLiked: false, likes: topic.likes - 1 }
                    : topic;
            })
        );

        try {
            const response = isReply
                ? await removeLike({ postId: id, userId: currentUserId })
                : await removeLike({ postId: id, userId: currentUserId });

            if (!response.success) {
                setTopics((prevTopics) =>
                    prevTopics.map((topic) =>
                        topic.id === id
                            ? { ...topic, likes: topic.likes + 1, userHasLiked: true }
                            : topic
                    )
                );
            }
        } catch (error) {
            console.error('Error removing like:', error);
            setTopics((prevTopics) =>
                prevTopics.map((topic) =>
                    topic.id === id
                        ? { ...topic, likes: topic.likes + 1, userHasLiked: true }
                        : topic
                )
            );
        }
    };

    const renderReplies = (replies: Topic[]) => (
        <ul className="ml-6 mt-4 space-y-4">
            {replies.map((reply) => (
                <li key={reply.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Por {reply.author}</p>
                    <p className="mb-4">{reply.content}</p>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Evita que se abra el post al dar like
                                reply.userHasLiked ? handleRemoveLike(reply.id, true) : handleAddLike(reply.id, true);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            👍 {reply.likes}
                        </button>
                    </div>
                    {renderReplies(reply.replies)}
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            <Navbar backRoute='/ActionPanel' title='Foro' />
            <div className="max-w-5xl mx-auto p-8 text-gray-800">
                <form onSubmit={handleNewTopicSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        {isReplying ? 'Responder al Tema' : 'Crear Nuevo Tema'}
                    </h2>
                    {isReplying && parentPostId && (
                        <p className="text-sm text-gray-500 mb-4">
                            Respondiendo a: {topics.find((topic) => topic.id === parentPostId)?.title}
                        </p>
                    )}
                    {!isReplying && (
                        <input
                            type="text"
                            placeholder="Título del tema"
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    )}
                    <textarea
                        placeholder="Contenido del tema"
                        value={newTopicContent}
                        onChange={(e) => setNewTopicContent(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={4}
                    ></textarea>
                    <div className="mb-4">
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition-colors duration-200">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-1 text-sm text-gray-600">
                                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Selecciona una imagen
                                    </span> o arrastra y suelta aquí
                                </p>
                                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="mt-4">
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg shadow-md mx-auto" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                    >
                                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                        {isReplying ? 'Responder' : 'Publicar'}
                    </button>
                </form>

                {selectedTopic ? (
                    <div className="bg-white p-6 mt-10 border border-gray-300 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-2">{selectedTopic.title}</h2>
                        <p className="text-sm text-gray-500 mb-6">Por {selectedTopic.author}</p>
                        <p className="mb-6">{selectedTopic.content}</p>

                        {selectedTopic.imageUrl && (
                            <img src={selectedTopic.imageUrl} alt="Imagen del tema" className="w-full h-auto mb-6 rounded-md shadow-md" />
                        )}

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    selectedTopic.userHasLiked ? handleRemoveLike(selectedTopic.id) : handleAddLike(selectedTopic.id);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                👍 {selectedTopic.likes}
                            </button>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Respuestas</h3>
                        {renderReplies(selectedTopic.replies)}
                        <button
                            onClick={handleBackToList}
                            className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Regresar a los temas
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Temas</h2>
                        <ul className="space-y-6">
                            {topics.map((topic) => {
                                return (
                                    <li
                                        key={topic.id}
                                        onClick={() => handleTopicSelect(topic)}
                                        className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition duration-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1">{topic.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Por {topic.author} - {topic.replies.length} respuestas
                                                </p>
                                                <p>{topic.content}</p>
                                            </div>
                                            {topic.imageUrl && (
                                                <img
                                                    src={topic.imageUrl}
                                                    alt="Vista previa"
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    topic.userHasLiked ? handleRemoveLike(topic.id) : handleAddLike(topic.id);
                                                }}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                👍 {topic.likes}
                                            </button>
                                            {topic.userId === currentUserId && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePost(topic.id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Foro;
