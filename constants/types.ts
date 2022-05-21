export interface PostOverview {
    id: string | string[];
    title: string;
    emoji: string;
    likes: number;
    comments: number;
    views: number;
    edited: string;
    created: string;
    createdby: {
        username: string;
        profile_emoji: string;
    }
}

export interface UserData {
    username: string | string[] | undefined;
    profile_emoji: string;
    bio: string;
    followers: number;
    likes: number;
    github: string | null;
    posts: PostOverview[];
};

export interface CommentData extends childComment {
    comments: childComment[];
    parent_comment_id: null;
}

export interface childComment {
    id: string | string[];
    post_id: string | string[];
    parent_comment_id: string | string[] | null;
    content: string;
    created: string;
    createdby: {
        username: string | string[];
        profile_emoji: string;
    };
}

export interface PostData {
    id: string | string[];
    postOverview: PostOverview;
    comments: CommentData[];
}