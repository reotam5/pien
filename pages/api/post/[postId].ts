import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { CommentData, UserData } from '../../../constants/types'

const prisma = new PrismaClient()

type Data = {
    status: 'ok' | 'error',
    message?: string,
    data?: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const session = await getSession({ req });
    if (req.method === "POST") {
        const { postId } = req.query;
        const { parentId, content } = req.body;

        //TODO: check if current user is allowed to post comment

        const comment: CommentData = JSON.parse(JSON.stringify(await prisma.comment.create({
            data: {
                content,
                post: {
                    connect: {
                        id: postId
                    }
                },
                createdBy: {
                    connect: {
                        id: session?.user.id
                    }
                },
                parentComment: parentId ? {
                    connect: {
                        id: parentId
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
        })));

        if (comment) {
            res.status(201).json({
                status: 'ok',
                data: comment
            })
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong'
            })
        }
        return res;
    }
}