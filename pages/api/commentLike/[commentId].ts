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
  const { commentId } = req.query;
  const session = await getSession({ req });

  if (req.method === 'POST') {
    if (session) {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId
        },
        select: {
          id: true,
          createdBy: {
            select: {
              id: true
            }
          }
        }
      });
      if (!comment) {
        return res.status(404).json({
          status: 'error',
          message: 'Comment not found'
        });
      }
      const exists = await prisma.commentLike.findMany({
        where: {
          commentId: comment.id,
          userId: session.user.id
        }
      });
      if (exists.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already liked this comment'
        });
      }
      const like = await prisma.commentLike.create({
        data: {
          comment: {
            connect: {
              id: comment.id
            }
          },
          createdBy: {
            connect: {
              id: session.user.id
            }
          },
          likedUser: {
            connect: {
              id: comment.createdBy.id
            }
          }
        }
      });
      if (like) {
        return res.status(201).json({
          status: 'ok',
          data: like
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Something went wrong'
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
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId
        }
      });
      if (!comment) {
        return res.status(404).json({
          status: 'error',
          message: 'Comment not found'
        });
      }
      const like = await prisma.commentLike.findMany({
        where: {
          commentId: comment.id,
          userId: session.user.id
        }
      });
      if (like.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'You have not liked this comment'
        });
      }
      const deleted = await prisma.commentLike.deleteMany({
        where: {
          commentId: comment.id,
          userId: session.user.id
        }
      });
      if (deleted) {
        return res.status(200).json({
          status: 'ok',
          data: deleted
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Something went wrong'
        });
      }
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'You must be logged in to like a comment.'
      })
    }
  } else if (req.method === 'GET') {
    if (session) {
      const user = await prisma.user.findUnique({
        where: {
          username: commentId
        }
      });
      const commentLikes = await prisma.commentLike.aggregate({
        where: {
          comment: {
            userId: user.id
          }
        },
        _count: {
          id: true
        }
      });
      const comments = await prisma.comment.findMany({
        where: {
          userId: user.id
        },
        select: {
          commentLikes: true
        },
      });
      if (comments) {
        return res.status(200).json({
          status: 'ok',
          data: {
            likes: comments.reduce((sum:number, comment:any) => sum + comment.commentLikes.length, 0)
          }
        });
      } else {
        return res.status(200).json({
          status: 'ok',
          data: {
            likes: 0
          }
        });
      }
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'You must be logged in to like a comment'
      });
    }
  }
}