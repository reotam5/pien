import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserInfo } from 'os'
import { UserData } from '../../../constants/types'
import { getUserInfoForProfilePage } from '../../../prisma/services/profile'

const prisma = new PrismaClient()

type Data = {
    status: 'ok' | 'error',
    message?: string,
    data?: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { username } = req.query;
    const session = await getSession({ req });

    if (req.method === 'GET') {

    }
}