'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { addLike, createPost, getPosts, removeLike, deletePost, updatePost } from './services/foro.service';
import { ThumbsUp, Trash2, X, Plus, Edit } from 'lucide-react';
import { useSettings } from '@/app/contexts/SettingsContext';
import Image from 'next/image';

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

type EditingPost = {
    id: number | null;
    isReply: boolean;
    parentId?: number;
    title: string;
    content: string;
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
    const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [showNewPostForm, setShowNewPostForm] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<EditingPost>({
        id: null,
        isReply: false,
        title: '',
        content: '',
        imageUrl: undefined
    });

    const currentUserId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 1;
    const { theme } = useSettings();
    const isDark = theme === 'dark';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPosts(currentUserId);
                const formattedPosts = posts.map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    author: post.username,
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
            author: reply.username,
            content: reply.content,
            replies: formatReplies(reply.replies),
            likes: reply.likesCount,
            userHasLiked: reply.userHasLiked,
            userId: reply.userId,
            imageUrl: reply.imageUrl,
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

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result as string);
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

            const newPost = await createPost(formData);

            const newTopic: Topic = {
                id: newPost.id,
                title: newPost.title || '',
                author: newPost.username || 'Usuario',
                content: newPost.content,
                replies: [],
                likes: newPost.likesCount || 0,
                userHasLiked: newPost.userHasLiked || false,
                userId: newPost.userId || currentUserId,
                imageUrl: newPost.imageUrl || undefined,
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

            if (isReplying && selectedTopic && parentPostId === selectedTopic.id) {
                setSelectedTopic(prev => prev ? {
                    ...prev,
                    replies: [...prev.replies, newTopic]
                } : null);
            }

            setNewTopicTitle('');
            setNewTopicContent('');
            setSelectedImage(null);
            setImagePreview(null);
            setShowNewPostForm(false);
        } catch (error) {
            console.error('Error creating new post:', error);
        }
    };

    const handleEditPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost.content || (!editingPost.title && !editingPost.isReply)) {
            console.warn("El contenido es obligatorio, y el título para temas principales.");
            return;
        }

        try {
            const updateData: any = {
                content: editingPost.content
            };

            if (!editingPost.isReply) {
                updateData.title = editingPost.title;
            }

            if (editSelectedImage) {
                const formData = new FormData();
                formData.append('file', editSelectedImage);
                const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/foro/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const { imageUrl } = await uploadResponse.json();
                updateData.imageUrl = imageUrl;
            } else if (editingPost.imageUrl === null) {
                updateData.imageUrl = null;
            }

            const updatedPost = await updatePost(editingPost.id!, updateData);

            setTopics(prevTopics => {
                if (editingPost.isReply && editingPost.parentId) {
                    return prevTopics.map(topic => {
                        if (topic.id === editingPost.parentId) {
                            return {
                                ...topic,
                                replies: topic.replies.map(reply =>
                                    reply.id === editingPost.id ? {
                                        ...reply,
                                        title: updatedPost.title || '',
                                        content: updatedPost.content,
                                        imageUrl: updatedPost.imageUrl
                                    } : reply
                                )
                            };
                        }
                        const updatedReplies = updateReplyInReplies(topic.replies, editingPost.id!, updatedPost);
                        if (updatedReplies !== topic.replies) {
                            return {
                                ...topic,
                                replies: updatedReplies
                            };
                        }
                        return topic;
                    });
                }
                return prevTopics.map(topic =>
                    topic.id === editingPost.id ? {
                        ...topic,
                        title: updatedPost.title,
                        content: updatedPost.content,
                        imageUrl: updatedPost.imageUrl
                    } : topic
                );
            });

            if (selectedTopic && (
                (editingPost.isReply && selectedTopic.id === editingPost.parentId) ||
                (!editingPost.isReply && selectedTopic.id === editingPost.id)
            )) {
                setSelectedTopic(prev => {
                    if (!prev) return null;
                    if (prev.id === editingPost.id && !editingPost.isReply) {
                        return {
                            ...prev,
                            title: updatedPost.title,
                            content: updatedPost.content,
                            imageUrl: updatedPost.imageUrl
                        };
                    }
                    return {
                        ...prev,
                        replies: prev.replies.map(reply =>
                            reply.id === editingPost.id ? {
                                ...reply,
                                title: updatedPost.title || '',
                                content: updatedPost.content,
                                imageUrl: updatedPost.imageUrl
                            } : reply
                        )
                    };
                });
            }

            setEditingPost({
                id: null,
                isReply: false,
                title: '',
                content: '',
                imageUrl: undefined
            });
            setEditImagePreview(null);
            setEditSelectedImage(null);
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const updateReplyInReplies = (replies: Topic[], postId: number, updatedPost: any): Topic[] => {
        return replies.map(reply => {
            if (reply.id === postId) {
                return {
                    ...reply,
                    title: updatedPost.title || '',
                    content: updatedPost.content,
                    imageUrl: updatedPost.imageUrl
                };
            }
            return {
                ...reply,
                replies: updateReplyInReplies(reply.replies, postId, updatedPost)
            };
        });
    };

    const startEditingPost = (post: Topic, isReply: boolean = false, parentId?: number) => {
        setEditingPost({
            id: post.id,
            isReply,
            parentId,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl
        });
        if (post.imageUrl) {
            setEditImagePreview(post.imageUrl);
        }
        setShowNewPostForm(false);
    };

    const handleTopicSelect = (topic: Topic) => {
        setSelectedTopic(topic);
        setIsReplying(true);
        setParentPostId(topic.id);
        setShowNewPostForm(false);
        setEditingPost({
            id: null,
            isReply: false,
            title: '',
            content: '',
            imageUrl: undefined
        });
    };

    const handleBackToList = () => {
        setSelectedTopic(null);
        setIsReplying(false);
        setNewTopicTitle('');
        setNewTopicContent('');
        setParentPostId(null);
        setSelectedImage(null);
        setImagePreview(null);
        setShowNewPostForm(false);
        setEditingPost({
            id: null,
            isReply: false,
            title: '',
            content: '',
            imageUrl: undefined
        });
    };

    const handleDeletePost = async (postId: number, isReply: boolean = false, parentId?: number) => {
        try {
            const response = await deletePost(postId, currentUserId);
            if (response.success) {
                if (isReply && parentId) {
                    setTopics(prevTopics =>
                        prevTopics.map(topic => {
                            if (topic.id === parentId) {
                                return {
                                    ...topic,
                                    replies: topic.replies.filter(reply => reply.id !== postId)
                                };
                            }
                            const updatedReplies = removeReplyFromReplies(topic.replies, postId);
                            if (updatedReplies.length !== topic.replies.length) {
                                return {
                                    ...topic,
                                    replies: updatedReplies
                                };
                            }
                            return topic;
                        })
                    );

                    if (selectedTopic && selectedTopic.id === parentId) {
                        setSelectedTopic(prev => prev ? {
                            ...prev,
                            replies: prev.replies.filter(reply => reply.id !== postId)
                        } : null);
                    }
                } else {
                    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== postId));
                    if (selectedTopic?.id === postId) {
                        setSelectedTopic(null);
                    }
                }
            } else {
                console.error('Failed to delete the post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const removeReplyFromReplies = (replies: Topic[], postId: number): Topic[] => {
        return replies.filter(reply => reply.id !== postId)
            .map(reply => ({
                ...reply,
                replies: removeReplyFromReplies(reply.replies, postId)
            }));
    };

    const handleAddLike = async (id: number, isReply: boolean = false) => {
        // Actualizar tanto los topics como el selectedTopic si es el caso
        setTopics(prevTopics =>
            prevTopics.map(topic => {
                if (topic.id === id && !isReply) {
                    return { ...topic, userHasLiked: true, likes: topic.likes + 1 };
                }
                if (isReply) {
                    return {
                        ...topic,
                        replies: topic.replies.map(reply =>
                            reply.id === id
                                ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                : reply
                        ),
                    };
                }
                return topic;
            })
        );

        // Actualizar el selectedTopic si estamos viendo ese tema
        if (selectedTopic) {
            if (selectedTopic.id === id && !isReply) {
                setSelectedTopic(prev => prev ? {
                    ...prev,
                    userHasLiked: true,
                    likes: prev.likes + 1
                } : null);
            } else if (isReply) {
                setSelectedTopic(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        replies: prev.replies.map(reply =>
                            reply.id === id
                                ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                : reply
                        )
                    };
                });
            }
        }

        try {
            const response = await addLike({ postId: id, userId: currentUserId });

            if (!response.success) {
                // Revertir los cambios si falla la API
                setTopics(prevTopics =>
                    prevTopics.map(topic => {
                        if (topic.id === id && !isReply) {
                            return { ...topic, likes: topic.likes - 1, userHasLiked: false };
                        }
                        if (isReply) {
                            return {
                                ...topic,
                                replies: topic.replies.map(reply =>
                                    reply.id === id
                                        ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                        : reply
                                ),
                            };
                        }
                        return topic;
                    })
                );

                if (selectedTopic) {
                    if (selectedTopic.id === id && !isReply) {
                        setSelectedTopic(prev => prev ? {
                            ...prev,
                            userHasLiked: false,
                            likes: prev.likes - 1
                        } : null);
                    } else if (isReply) {
                        setSelectedTopic(prev => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                replies: prev.replies.map(reply =>
                                    reply.id === id
                                        ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                        : reply
                                )
                            };
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error adding like:', error);
            // Revertir los cambios si hay un error
            setTopics(prevTopics =>
                prevTopics.map(topic => {
                    if (topic.id === id && !isReply) {
                        return { ...topic, likes: topic.likes - 1, userHasLiked: false };
                    }
                    if (isReply) {
                        return {
                            ...topic,
                            replies: topic.replies.map(reply =>
                                reply.id === id
                                    ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                    : reply
                            ),
                        };
                    }
                    return topic;
                })
            );

            if (selectedTopic) {
                if (selectedTopic.id === id && !isReply) {
                    setSelectedTopic(prev => prev ? {
                        ...prev,
                        userHasLiked: false,
                        likes: prev.likes - 1
                    } : null);
                } else if (isReply) {
                    setSelectedTopic(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            replies: prev.replies.map(reply =>
                                reply.id === id
                                    ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                    : reply
                            )
                        };
                    });
                }
            }
        }
    };

    const handleRemoveLike = async (id: number, isReply: boolean = false) => {
        // Actualizar tanto los topics como el selectedTopic si es el caso
        setTopics(prevTopics =>
            prevTopics.map(topic => {
                if (topic.id === id && !isReply) {
                    return { ...topic, userHasLiked: false, likes: topic.likes - 1 };
                }
                if (isReply) {
                    return {
                        ...topic,
                        replies: topic.replies.map(reply =>
                            reply.id === id
                                ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                : reply
                        ),
                    };
                }
                return topic;
            })
        );

        // Actualizar el selectedTopic si estamos viendo ese tema
        if (selectedTopic) {
            if (selectedTopic.id === id && !isReply) {
                setSelectedTopic(prev => prev ? {
                    ...prev,
                    userHasLiked: false,
                    likes: prev.likes - 1
                } : null);
            } else if (isReply) {
                setSelectedTopic(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        replies: prev.replies.map(reply =>
                            reply.id === id
                                ? { ...reply, userHasLiked: false, likes: reply.likes - 1 }
                                : reply
                        )
                    };
                });
            }
        }

        try {
            const response = await removeLike({ postId: id, userId: currentUserId });

            if (!response.success) {
                // Revertir los cambios si falla la API
                setTopics(prevTopics =>
                    prevTopics.map(topic => {
                        if (topic.id === id && !isReply) {
                            return { ...topic, likes: topic.likes + 1, userHasLiked: true };
                        }
                        if (isReply) {
                            return {
                                ...topic,
                                replies: topic.replies.map(reply =>
                                    reply.id === id
                                        ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                        : reply
                                ),
                            };
                        }
                        return topic;
                    })
                );

                if (selectedTopic) {
                    if (selectedTopic.id === id && !isReply) {
                        setSelectedTopic(prev => prev ? {
                            ...prev,
                            userHasLiked: true,
                            likes: prev.likes + 1
                        } : null);
                    } else if (isReply) {
                        setSelectedTopic(prev => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                replies: prev.replies.map(reply =>
                                    reply.id === id
                                        ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                        : reply
                                )
                            };
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error removing like:', error);
            // Revertir los cambios si hay un error
            setTopics(prevTopics =>
                prevTopics.map(topic => {
                    if (topic.id === id && !isReply) {
                        return { ...topic, likes: topic.likes + 1, userHasLiked: true };
                    }
                    if (isReply) {
                        return {
                            ...topic,
                            replies: topic.replies.map(reply =>
                                reply.id === id
                                    ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                    : reply
                            ),
                        };
                    }
                    return topic;
                })
            );

            if (selectedTopic) {
                if (selectedTopic.id === id && !isReply) {
                    setSelectedTopic(prev => prev ? {
                        ...prev,
                        userHasLiked: true,
                        likes: prev.likes + 1
                    } : null);
                } else if (isReply) {
                    setSelectedTopic(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            replies: prev.replies.map(reply =>
                                reply.id === id
                                    ? { ...reply, userHasLiked: true, likes: reply.likes + 1 }
                                    : reply
                            )
                        };
                    });
                }
            }
        }
    };

    const renderReplies = (replies: Topic[]) => (
        <ul className="ml-6 mt-4 space-y-4">
            {replies.map((reply) => (
                <li key={reply.id} className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} p-4 rounded-lg shadow-sm`}>
                    <div className="flex justify-between items-start">
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Por {reply.author}</p>
                        {reply.userId === currentUserId && (
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEditingPost(reply, true, selectedTopic?.id);
                                    }}
                                    className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePost(reply.id, true, selectedTopic?.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="mb-4">{reply.content}</p>
                    {reply.imageUrl && (
                        <div className="mb-4">
                            <Image
                                src={reply.imageUrl}
                                alt="Imagen de la respuesta"
                                width={200}
                                height={200}
                                className="cursor-pointer rounded-md shadow-md"
                                onClick={() => reply.imageUrl && setEnlargedImage(reply.imageUrl)}
                            />
                        </div>
                    )}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                reply.userHasLiked ? handleRemoveLike(reply.id, true) : handleAddLike(reply.id, true);
                            }}
                            className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                            <ThumbsUp className={reply.userHasLiked ? "fill-blue-500" : ""} size={16} /> {reply.likes}
                        </button>
                    </div>
                    {renderReplies(reply.replies)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className={isDark ? 'bg-gray-900 text-white min-h-screen' : ''}>
            <Navbar backRoute='/ActionPanel' title='Foro' />
            <div className={`max-w-5xl mx-auto p-8 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                <button
                    onClick={() => {
                        setShowNewPostForm(!showNewPostForm);
                        if (showNewPostForm) {
                            setEditingPost({
                                id: null,
                                isReply: false,
                                title: '',
                                content: '',
                                imageUrl: undefined
                            });
                        }
                    }}
                    className={`mb-8 py-2 px-4 rounded-lg flex items-center ${showNewPostForm
                        ? (isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600')
                        : (isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600')
                        } text-white transition duration-200`}
                >
                    {showNewPostForm ? (
                        <>
                            <X size={20} className="mr-2" />
                            Cancelar
                        </>
                    ) : (
                        <>
                            <Plus size={20} className="mr-2" />
                            {selectedTopic ? 'Responder al Tema' : 'Crear Nuevo Tema'}
                        </>
                    )}
                </button>

                {showNewPostForm && (
                    <form onSubmit={handleNewTopicSubmit} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg mb-8`}>
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            {selectedTopic ? 'Responder al Tema' : 'Crear Nuevo Tema'}
                        </h2>
                        {selectedTopic && (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                                Respondiendo a: {selectedTopic.title}
                            </p>
                        )}
                        {!selectedTopic && (
                            <input
                                type="text"
                                placeholder="Título del tema"
                                value={newTopicTitle}
                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                className={`w-full p-3 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                                    }`}
                            />
                        )}
                        <textarea
                            placeholder="Contenido del tema"
                            value={newTopicContent}
                            onChange={(e) => setNewTopicContent(e.target.value)}
                            className={`w-full p-3 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                                }`}
                            rows={4}
                        ></textarea>
                        <div className="mb-4">
                            <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${isDark ? 'border-gray-600 hover:border-indigo-400' : 'border-gray-300 hover:border-indigo-500'
                                }`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <span className="font-medium text-indigo-500 hover:text-indigo-400">
                                            Selecciona una imagen
                                        </span> o arrastra y suelta aquí
                                    </p>
                                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>PNG, JPG, GIF hasta 10MB</p>
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
                                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
                            >
                                {selectedTopic ? 'Responder' : 'Publicar'}
                            </button>
                        </div>
                    </form>
                )}

                {editingPost.id && (
                    <form onSubmit={handleEditPost} className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg mb-8`}>
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            {editingPost.isReply ? 'Editar Respuesta' : 'Editar Tema'}
                        </h2>
                        {!editingPost.isReply && (
                            <input
                                type="text"
                                placeholder="Título del tema"
                                value={editingPost.title}
                                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                className={`w-full p-3 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                                    }`}
                            />
                        )}
                        <textarea
                            placeholder="Contenido del tema"
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                            className={`w-full p-3 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'
                                }`}
                            rows={4}
                        ></textarea>
                        <div className="mb-4">
                            <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${isDark ? 'border-gray-600 hover:border-indigo-400' : 'border-gray-300 hover:border-indigo-500'
                                }`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <span className="font-medium text-indigo-500 hover:text-indigo-400">
                                            Selecciona una imagen
                                        </span> o arrastra y suelta aquí
                                    </p>
                                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </div>
                            {editImagePreview && (
                                <div className="mt-4">
                                    <div className="relative">
                                        <img src={editImagePreview} alt="Preview" className="max-w-xs rounded-lg shadow-md mx-auto" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditSelectedImage(null);
                                                setEditImagePreview(null);
                                                setEditingPost({ ...editingPost, imageUrl: undefined });
                                            }}
                                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingPost({
                                        id: null,
                                        isReply: false,
                                        title: '',
                                        content: '',
                                        imageUrl: undefined
                                    });
                                    setEditImagePreview(null);
                                    setEditSelectedImage(null);
                                }}
                                className="py-3 px-6 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                )}

                {selectedTopic ? (
                    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 mt-10 border rounded-lg shadow-lg`}>
                        <button
                            onClick={handleBackToList}
                            className={`mb-4 py-2 px-4 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'
                                } text-white`}
                        >
                            Regresar a los temas
                        </button>
                        <h2 className="text-3xl font-bold mb-2">{selectedTopic.title}</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Por {selectedTopic.author}</p>
                        <p className="mb-6">{selectedTopic.content}</p>

                        {selectedTopic.imageUrl && (
                            <div className="mb-6">
                                <Image
                                    src={selectedTopic.imageUrl}
                                    alt="Imagen del tema"
                                    width={200}
                                    height={200}
                                    className="cursor-pointer rounded-md shadow-md"
                                    onClick={() => selectedTopic.imageUrl && setEnlargedImage(selectedTopic.imageUrl)}
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectedTopic.userHasLiked ? handleRemoveLike(selectedTopic.id) : handleAddLike(selectedTopic.id);
                                }}
                                className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
                            >
                                <ThumbsUp className={selectedTopic.userHasLiked ? "fill-blue-500" : ""} size={16} /> {selectedTopic.likes}
                            </button>
                            {selectedTopic.userId === currentUserId && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingPost(selectedTopic);
                                        }}
                                        className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
                                    >
                                        <Edit size={16} /> Editar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePost(selectedTopic.id);
                                        }}
                                        className="text-red-500 hover:text-red-400 flex items-center gap-1"
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Respuestas</h3>
                        {renderReplies(selectedTopic.replies)}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Temas</h2>
                        {topics.length === 0 ? (
                            <div className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <p className="text-xl">Aún no hay ninguna publicación</p>
                                <p className="mt-2">Sé el primero en crear un tema de discusión</p>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {topics.map((topic) => {
                                    return (
                                        <li
                                            key={topic.id}
                                            onClick={() => handleTopicSelect(topic)}
                                            className={`p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                                                } border`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-1">{topic.title}</h3>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Por {topic.author} - {topic.replies.length} respuestas
                                                    </p>
                                                    <p>{topic.content}</p>
                                                </div>
                                                {topic.imageUrl && (
                                                    <Image
                                                        src={topic.imageUrl}
                                                        alt="Vista previa"
                                                        width={100}
                                                        height={100}
                                                        className="object-cover rounded-md cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            topic.imageUrl && setEnlargedImage(topic.imageUrl);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        topic.userHasLiked ? handleRemoveLike(topic.id) : handleAddLike(topic.id);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-400 flex items-center gap-1"
                                                >
                                                    <ThumbsUp className={topic.userHasLiked ? "fill-blue-500" : ""} size={16} /> {topic.likes}
                                                </button>
                                                {topic.userId === currentUserId && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                startEditingPost(topic);
                                                            }}
                                                            className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
                                                        >
                                                            <Edit size={16} /> Editar
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePost(topic.id);
                                                            }}
                                                            className="text-red-500 hover:text-red-400 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={16} /> Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {enlargedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-full max-h-full">
                        <Image
                            src={enlargedImage}
                            alt="Imagen ampliada"
                            width={800}
                            height={600}
                            className="max-w-full max-h-full"
                        />
                        <button
                            onClick={() => setEnlargedImage(null)}
                            className="absolute top-0 right-0 -mt-2 -mr-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Foro;