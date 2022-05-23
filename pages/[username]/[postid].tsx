import { Divider } from '@mui/material';
import { PrismaClient } from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import CommentList from '../../components/comment/commentList';
import Footer from '../../components/footer'
import Navbar from '../../components/navbar'
import { CommentData, PostData } from '../../types/types';
import { getResponse } from '../../utils/responseUtil';
import moment from 'moment';
import { getPost } from '../../prisma/services/post';
import { getSession } from 'next-auth/react';

interface Props {
    data: PostData;
}

const Post: NextPage<Props> = (props) => {
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState<CommentData[]>(props.data.comments);
    const handleSubmit = async () => {
        fetch(`/api/post/${props.data.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: comment,
                parentId: null
            })
        }).then(async (response) => {
            const { status, statusText, data } = await getResponse(response);
            if (status === 201) {
                setComment("");
                setComments([...comments, data.data]);
            } else {
                toast.error(data.message);
            }
        });
    }
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }
    const router = useRouter();
    return (
        <div className="bg-blue-100">
            <Navbar />
            <div className='min-h-screen px-4 pb-10 max-w-4xl mx-auto'>
                <div
                    className='flex flex-col py-9 w-fit'
                >
                    <h1 className='font-bold text-3xl'>{props.data.postOverview.post_title}</h1>
                    <div
                        className='flex items-end gap-1 hover:cursor-pointer'
                        onClick={() => { router.push(`/${props.data.postOverview.createdBy.username}`); }}
                    >
                        <div className='text-xl'>
                            {props.data.postOverview.createdBy.profile_emoji}
                        </div>
                        <div className='font-semibold text-lg'>
                            {props.data.postOverview.createdBy.username}
                        </div>
                        <div className='text-gray-500'>
                            {moment(props.data.postOverview.createdAt).fromNow()}
                        </div>
                    </div>
                </div>

                <div>
                    {
                        comments.length == 0
                            ?
                            (
                                <div className='w-full flex flex-col items-center gap-5 bg-white rounded-lg p-6'>
                                    <div className='text-9xl'>
                                        📭
                                    </div>
                                    <div className='font-semibold text-3xl text-center'>
                                        This post is empty...
                                    </div>
                                    <div className='rounded-xl ring-1 ring-gray-300 w-full px-5 pt-5 flex flex-col'>
                                        <div>
                                            <textarea
                                                className='w-full h-32 p-3'
                                                placeholder='Write your first comment...'
                                                onChange={handleChange}
                                                value={comment}
                                            />
                                        </div>
                                        <Divider />
                                        <div className='flex gap-3 justify-end my-3'>
                                            <button
                                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                                                onClick={handleSubmit}
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <CommentList comments={comments} />
                            )
                    }
                </div>

                {
                    comments.length > 0
                    &&
                    <div className='w-full flex flex-col items-center gap-5 bg-white rounded-xl mt-5'>
                        <div className='rounded-xl ring-1 ring-gray-300 w-full px-5 pt-5 flex flex-col'>
                            <div>
                                <textarea
                                    className='w-full h-32 p-3'
                                    placeholder='Write your comment...'
                                    onChange={handleChange}
                                    value={comment}
                                />
                            </div>
                            <Divider />
                            <div className='flex gap-3 justify-end my-3'>
                                <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                                    onClick={handleSubmit}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                }

            </div>
            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { username, postid } = context.query;
    const session = await getSession(context);
    const post: PostData = JSON.parse(JSON.stringify(await getPost(postid!, session?.user.id)));
    const response: Props = {
        data: {
            ...post,
        }
    }

    return {
        props: { ...response }
    }
}

export default Post