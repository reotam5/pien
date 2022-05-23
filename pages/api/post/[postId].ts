import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { postComment } from '../../../prisma/services/comment'
import { CommentData, UserData } from '../../../types/types'

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
        const comment: CommentData = JSON.parse(JSON.stringify(
            await postComment(session?.user?.id!, content, postId, parentId)
        ));

        if (comment) {
            res.status(201).json({
                status: 'ok',
                data: comment
            })
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong. Check if you are logged in.'
            })
        }
        return res;
    }
}