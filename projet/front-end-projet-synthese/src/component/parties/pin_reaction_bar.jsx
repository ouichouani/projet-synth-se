
import { useContext } from 'react'

import { UserContext } from '../../provider/userContext'
import PinDelete from "../pin/pin_delete";

import { ReactComponent as Like } from '../../svg/heart.svg'
import { ReactComponent as More } from '../../svg/more1.svg'
import { ReactComponent as Share } from '../../svg/share.svg'
import { ReactComponent as Update } from '../../svg/update.svg'
import { ReactComponent as Download } from '../../svg/download-photo.svg'
import { Link } from 'react-router-dom';



export default function PinReactionBar(props) {

    const { storedUser, setStoredUserfunction } = useContext(UserContext);

    return (
        <div className="pin_like">

            <Like fill={props.pin?.liked_by_me ? '#134B70' : 'white'} />
            <More title="more" />
            <Download title="download" />

            {storedUser.id == props.pin?.user_id && (
                <>
                    <Link to={`/pin/update/${props.pin?.user_id}`}>
                        <Update title="update" />
                    </Link>
                    <PinDelete />
                </>
            )}
        </div>
    )
}