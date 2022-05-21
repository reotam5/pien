import { CommentData } from '../../constants/types';
import CommentItem from './commentItem';


interface Props {
    comments: CommentData[];
}

const CommentList: React.FC<Props> = (props) => {
    return (
        <div className="flex flex-col gap-6">
            {
                props.comments.map(post => <CommentItem comment={post}/>)
            }
        </div>
    )
}

export default CommentList