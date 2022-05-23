import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserInfo } from 'os'
import { editProfile } from '../../../prisma/services/profile'
import { UserData } from '../../../types/types'

const prisma = new PrismaClient()

type Data = {
  status: 'ok' | 'error',
  message?: string,
  data?: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { username } = req.query;
  const session = await getSession({ req });

  if (req.method === 'POST') {
    const updatedUser = await editProfile(session?.user.id, username, req.body.bio, req.body.profile_emoji);
    if (updatedUser) {
      return res.status(200).json({
        status: 'ok',
        data: updatedUser
      })
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Username is taken'
      })
    }
  }
}