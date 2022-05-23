import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserInfo } from 'os'
import { UserData } from '../../../types/types'
import { follow, unfollow } from '../../../prisma/services/follow'

const prisma = new PrismaClient()

type Data = {
    status: 'ok' | 'error',
    message?: string,
    data?: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { username } = req.query;
    const session = await getSession({ req });
    const myId = session?.user?.id;
    const targetUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (!targetUser) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }
    if (req.method === 'DELETE') {
        const deleted = unfollow(myId!, targetUser.id);
        if (!deleted) {
            return res.status(400).json({
                status: 'error',
                message: 'Unfollow failed'
            });
        }
        return res.status(200).json({
            status: 'ok',
            data: deleted
        });
    } else if (req.method === 'POST') {
        const newFollow = follow(myId!, targetUser.id);
        if (!newFollow) {
            return res.status(400).json({
                status: 'error',
                message: 'Follow failed'
            });
        }
        return res.status(200).json({
            status: 'ok',
            data: newFollow
        });
    }
}