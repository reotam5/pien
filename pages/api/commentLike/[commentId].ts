import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { UserInfo } from 'os'
import { likeComment, unlikeComment } from '../../../prisma/services/comment'
import { UserData } from '../../../types/types'

const prisma = new PrismaClient()

type Data = {
  status: 'ok' | 'error',
  message?: string,
  data?: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { commentId } = req.query;
  const session = await getSession({ req });

  if (req.method === 'POST') {
    if (session) {
      const like = await likeComment(session?.user.id, commentId);
      if (like) {
        return res.status(200).json({
          status: 'ok',
          data: like
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Error liking comment'
        });
      }
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'You must be logged in to like a comment.'
      })
    }
  } else if (req.method === 'DELETE') {
    if (session) {
      const like = await unlikeComment(session?.user.id, commentId);
      if (like) {
        return res.status(200).json({
          status: 'ok',
          data: like
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Error unliking comment'
        });
      }
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'You must be logged in to like a comment.'
      })
    }
  }
}