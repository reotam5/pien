import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserInfoForProfilePage(where: any, myId: string | undefined) {
    const user = await prisma.user.findUnique({
        where: where,
        select: {
            id: true,
            username: true,
            profile_emoji: true,
            postOverviews: {
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
            },
        }
    });
    if (!user) return null;

    const likes = await prisma.commentLike.aggregate({
        where: {
            likedUserId: user.id
        },
        _count: true
    });
    user.commentLiked = likes._count;

    const following = await prisma.follows.aggregate({
        where: {
            followingId: user.id
        },
        _count: true
    });
    user.followers = following._count;

    const amIFollowing = await prisma.follows.findMany({
        where: {
            followerId: myId,
            followingId: user.id
        }
    });
    user.amIFollowing = amIFollowing.length > 0 ? true : false;
    return user;
}