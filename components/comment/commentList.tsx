import { Divider } from '@mui/material';
import { CommentData } from '../../types/types';
import CommentItem from './commentItem';


interface Props {
    comments: CommentData[];
}

const CommentList: React.FC<Props> = (props) => {
    return (
        <div className="flex flex-col gap-3">
            {
                props.comments.map(post => <CommentItem comment={post} />)
            }
        </div>
    )
}

export default CommentList