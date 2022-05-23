import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPost(postId: string | string[], myId: string | undefined) {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        select: {
            comments: {
                where: {
                    isTopLevel: true
                },
                select: {
                    id: true,
                    parentId: true,
                    childComments: {
                        select: {
                            id: true,
                            parentId: true,
                            content: true,
                            createdAt: true,
                            createdBy: true,
                            post_id: true
                        }
                    },
                    content: true,
                    createdAt: true,
                    createdBy: true,
                    post_id: true,
                    commentLikes: {
                        select: {
                            userId: true,
                            commentId: true
                        }
                    }
                }
            },
            postOverview: {
                select: {
                    id: true,
                    createdBy: true,
                    postId: true,
                    createdAt: true,
                    post_title: true,
                    post_emoji: true,
                }
            },
            id: true
        }
    });
    await Promise.all(
        post.comments.map(async (comment: { childComments: any[]; id: any; commentLikes: any; isLiked: boolean; }) => {
            await Promise.all(
                comment.childComments.map(async (childComment: any) => {
                    const likes = await prisma.commentLike.aggregate({
                        where: {
                            commentId: childComment.id
                        },
                        _count: true
                    });
                    childComment.commentLikes = likes._count;
                    const isLiked = await prisma.commentLike.aggregate({
                        where: {
                            userId: myId || "",
                            commentId: childComment.id
                        },
                        _count: true
                    });
                    childComment.isLiked = isLiked._count > 0 ? true : false;
                })
            );
            const likes = await prisma.commentLike.aggregate({
                where: {
                    commentId: comment.id
                },
                _count: true
            });
            comment.commentLikes = likes._count;
            const isLiked = await prisma.commentLike.aggregate({
                where: {
                    userId: myId || '',
                    commentId: comment.id
                },
                _count: true
            });
            comment.isLiked = isLiked._count > 0 ? true : false;
        })
    );
    return post;
}

export async function createPost(userId: string | undefined, post_title: string | string[], post_emoji: string | string[]) {
    if (userId === undefined) return null;
    const post = await prisma.post.create({ data: {} });

    const postOverview = await prisma.postOverview.create({
        data: {
            userId: userId,
            postId: post.id,
            post_title: post_title,
            post_emoji: post_emoji,
        },
        include: {
            createdBy: true,
            post: true,
        }
    });
    return postOverview;
};


export async function getLatestPosts() {
    const postOverviews = await prisma.postOverview.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 20,
        select: {
            postId: true,
            createdBy: {
                select: {
                    username: true,
                    profile_emoji: true
                }
            },
            post_title: true,
            post_emoji: true,
            createdAt: true,
        }
    });
    await Promise.all(
        postOverviews.map(async (post: any) => {

            const comments = await prisma.comment.aggregate({
                where: {
                    post_id: post.postId
                },
                _count: true
            });
            post.comments = comments._count;
        })
    );
    return postOverviews;
}

export async function getPostsFromFollowing(userId: string | undefined) {
    if (userId === undefined) return null;
    const followingsData = await prisma.follows.findMany({
        where: {
            followerId: userId
        },
        select: {
            followingId: true
        }
    });
    const followings = followingsData.map((data: { followingId: any; }) => data.followingId);
    const postOverviews = await prisma.postOverview.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 20,
        where: {
            userId: {
                in: followings
            }
        },
        select: {
            postId: true,
            createdBy: {
                select: {
                    username: true,
                    profile_emoji: true
                }
            },
            post_title: true,
            post_emoji: true,
            createdAt: true,
        }
    });
    await Promise.all(
        postOverviews.map(async (post: any) => {

            const comments = await prisma.comment.aggregate({
                where: {
                    post_id: post.postId
                },
                _count: true
            });
            post.comments = comments._count;
        })
    );
    return postOverviews;
}