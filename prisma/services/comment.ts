import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function postComment(myId: string | null, content: string, postId: string | string[], parentId?: string) {
    if (myId == null) return null;
    const comment = await prisma.comment.create({
        data: {
            content,
            post: {
                connect: {
                    id: postId as string
                }
            },
            createdBy: {
                connect: {
                    id: myId as string
                }
            },
            parentComment: parentId != null ? {
                connect: {
                    id: parentId as string
                }
            } : undefined,
            isTopLevel: !parentId
        },
        include: {
            createdBy: true,
            childComments: {
                include: {
                    createdBy: true
                }
            }
        }
    });
    return comment;
}

export async function likeComment(myId: string | undefined, commentId: string | string[]) {
    if (myId === undefined) return null;
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId as string
        },
        select: {
            id: true,
            createdBy: {
                select: {
                    id: true
                }
            }
        }
    });
    if (!comment) return null;

    const exists = await prisma.commentLike.findMany({
        where: {
            commentId: comment.id,
            userId: myId
        }
    });
    if (exists.length > 0) return null;

    const like = await prisma.commentLike.create({
        data: {
            comment: {
                connect: {
                    id: comment.id as string
                }
            },
            createdBy: {
                connect: {
                    id: myId as string
                }
            },
            likedUser: {
                connect: {
                    id: comment.createdBy!.id as string
                }
            }
        }
    });
    return like;
}


export async function unlikeComment(myId: string | undefined, commentId: string | string[]) {
    if (myId === undefined) return null;
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId as string
        }
    });
    if (!comment) return null;

    const deleted = await prisma.commentLike.deleteMany({
        where: {
            commentId: comment.id,
            userId: myId
        }
    });
    return deleted;
}