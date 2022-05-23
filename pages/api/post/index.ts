import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserInfo } from 'os'
import { createPost } from '../../../prisma/services/post'
import { UserData } from '../../../types/types'

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
            const postOverview = await createPost(session?.user.id, post_title, post_emoji);
            if (postOverview) {
                return res.status(200).json({
                    status: 'ok',
                    data: postOverview
                });
            } else {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error creating post'
                });
            }
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
        return res;
    }
}