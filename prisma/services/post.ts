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
                    const isLiked = await prisma.commentLike.findMany({
                        where: {
                            userId: myId,
                            commentId: childComment.id
                        }
                    });
                    childComment.isLiked = isLiked.length > 0 ? true : false;
                })
            );
            const likes = await prisma.commentLike.aggregate({
                where: {
                    commentId: comment.id
                },
                _count: true
            });
            comment.commentLikes = likes._count;
            const isLiked = await prisma.commentLike.findMany({
                where: {
                    userId: myId,
                    commentId: comment.id
                }
            });
            comment.isLiked = isLiked.length > 0 ? true : false;
        })
    );

    return post;
}