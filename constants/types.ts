export interface PostOverview {
    id: string | string[];
    post_title: string;
    post_emoji: string;
    likes: number;
    comments: number;
    views: number;
    createdAt: string;
    createdBy: {
        username: string;
        profile_emoji: string;
    }
    postId: string;
}

export interface UserData {
    username: string | string[] | undefined;
    profile_emoji: string;
    bio: string;
    github: string | null;
    postOverviews: PostOverview[];
};

export interface CommentData extends childComment {
    childComments: childComment[];
    parentId: null;
}

export interface childComment {
    id: string | string[];
    post_id: string | string[];
    parentId: string | string[] | null;
    content: string;
    createdAt: string;
    createdBy: {
        username: string | string[];
        profile_emoji: string;
    };
    commentLikes: CommentLike[];
}

export interface PostData {
    id: string | string[];
    postOverview: PostOverview;
    comments: CommentData[];
}

export interface Response {
    status: 'ok' | 'error'
    message?: string
    data?: any
}

export interface CommentLike {
    id: string | string[];
    userId: string | string[];
    commentId: string | string[];
}