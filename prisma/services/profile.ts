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

    await Promise.all(
        user.postOverviews.map(async (post: any) => {

            const comments = await prisma.comment.aggregate({
                where: {
                    post_id: post.postId
                },
                _count: true
            });
            post.comments = comments._count;
        })
    );
    return user;
}



export async function editProfile(userId: string | undefined, newUsername: string | string[], newBio: string, newProfileEmoji: string) {
    if (userId === undefined) return null;
    const targetUser = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });

    // if username is unchanged, only update bio and emoji
    if (targetUser.username === newUsername) {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                bio: newBio,
                profile_emoji: newProfileEmoji
            }
        });
        return updatedUser;
    } else {
        const user = await prisma.user.findUnique({
            where: {
                username: newUsername
            }
        });
        if (user) return null;
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: newUsername,
                bio: newBio,
                profile_emoji: newProfileEmoji
            }
        });
        return updatedUser;
    }
}

