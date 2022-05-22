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

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (user) {
      res.status(200).json({
        status: 'ok',
        data: user
      })
    } else {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }
    return res;
  } else if (req.method === 'POST') {
    if (session) {
      const user = await prisma.user.findUnique({
        where: {
          username: username
        }
      });
      if (user) {
        if (user.id === session.user.id) {
          //only edit bio and emoji
          const { profile_emoji, bio } = req.body;
          const updatedUser = await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              profile_emoji,
              bio
            }
          });
          return res.status(201).json({
            status: 'ok',
            data: updatedUser
          })
        } else {
          return res.status(403).json({
            status: 'error',
            message: 'Username is already taken'
          })
        }
      } else {
        const { profile_emoji, bio } = req.body;
        const user = await prisma.user.update({
          where: {
            id: session.user.id
          },
          data: {
            username,
            profile_emoji,
            bio
          }
        })
        return res.status(201).json({
          status: 'ok',
          message: 'Congratulations! You have successfully updated your profile.',
          data: user
        })
      }
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'You must be logged in to edit a user'
      })
    }
  }
}