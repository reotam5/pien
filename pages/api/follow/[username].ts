import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserInfo } from 'os'
import { UserData } from '../../../constants/types'

const prisma = new PrismaClient()

type Data = {
    status: 'ok' | 'error',
    message?: string,
    data?: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { username } = req.query;
    const session = await getSession({ req });

    if (req.method === 'DELETE') {
        if (session) {
            const following = await prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (!following) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }
            const follow = await prisma.follows.deleteMany({
                where: {
                    followerId: session.user.id,
                    followingId: following.id
                }
            })
            console.log(follow);
            return res.status(200).json({
                status: 'ok',
                message: 'Successfully unfollowed user',
                data: follow
            })
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'You must be logged in to follow users.'
            })
        }
    } else if (req.method === 'POST') {
        if (session) {
            if (session.user.username === username) {
                return res.status(400).json({
                    status: 'error',
                    message: 'You cannot follow yourself.'
                });
            } else {
                const following = await prisma.user.findUnique({
                    where: {
                        username: username
                    }
                });
                if (!following) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'User not found'
                    });
                }
                const follow = await prisma.follows.findFirst({
                    where: {
                        followerId: session.user.id,
                        followingId: following.id
                    }
                });
                if (follow) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'You are already following this user.'
                    });
                } else {
                    const newFollow = await prisma.follows.create({
                        data: {
                            follower: {
                                connect: {
                                    id: session.user.id
                                }
                            },
                            following: {
                                connect: {
                                    id: following.id
                                }
                            }
                        }
                    });
                    return res.status(201).json({
                        status: 'ok',
                        data: newFollow
                    });
                }
            }
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    } else if (req.method === 'GET') {
        const following = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!following) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        const follows = await prisma.follows.aggregate({
            where: {
                followingId: following.id
            },
            _count: {
                followingId: true,
            },
        });
        const followers = follows._count.followingId;

        if (session) {
            const followingUser = await prisma.follows.findFirst({
                where: {
                    followerId: session.user.id,
                    followingId: following.id
                }
            });
            if (followingUser) {
                return res.status(200).json({
                    status: 'ok',
                    data: {
                        following: true,
                        followers: followers
                    }
                });
            } else {
                return res.status(200).json({
                    status: 'ok',
                    data: {
                        following: false,
                        followers: followers
                    }
                });
            }
            
        } else {
            return res.status(200).json({
                status: 'ok',
                data: {
                    followers: followers
                }
            });
        }
    }
}