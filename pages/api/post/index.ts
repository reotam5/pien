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
    const session = await getSession({ req });
    if (req.method === "POST") {
        if (session) {
            const { post_emoji, post_title } = req.body;
            const post = await prisma.post.create({ data: {} });
            const postOverview = await prisma.postOverview.create({
                data: {
                    userId: session.user.id,
                    postId: post.id,
                    post_title: post_title,
                    post_emoji: post_emoji,
                },
                include: {
                    createdBy: true,
                    post: true,
                }
            });
            res.status(201).json({
                status: 'ok',
                data: postOverview
            })
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
        return res;
    }
}