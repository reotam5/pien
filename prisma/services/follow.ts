import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function follow(myId: string|string[], targetUserId: string|string[]) {
    const exists = await prisma.follows.findMany({
        where: {
            followerId: myId as string,
            followingId: targetUserId as string
        }
    });
    if (exists.length > 0) {
        return exists[0];
    }
    const follow = await prisma.follows.create({
        data: {
            follower: {
                connect: {
                    id: myId as string
                }
            },
            following: {
                connect: {
                    id: targetUserId as string
                }
            },
        }
    });
    return follow;
}

export async function unfollow(myId: string|string[], targetUserId: string|string[]) {
    const deleted = await prisma.follows.deleteMany({
        where: {
            followerId: myId as string,
            followingId: targetUserId as string
        }
    });
    return deleted;
}