import { Link } from 'react-router-dom';
import '../../css/parties.css';
import { ReactComponent as PinLogo } from '../../svg/img.svg';
import { ReactComponent as AccountLogo } from '../../svg/account.svg';
import { ReactComponent as SettingLogo } from '../../svg/setting.svg';
import { ReactComponent as NotificationLogo } from '../../svg/notifications.svg';
import { ReactComponent as Search } from '../../svg/search.svg';
import { useContext } from 'react';
import { UserContext } from '../../provider/userContext';

export default function Header() {
    const { storedUser } = useContext(UserContext);

    return (
        <header>
            <div className="header_container">
                <div className="header_title">
                    <h2> Olivar-art </h2>
                </div>
            </div>
            <nav>

                <Link to={'/pin'}>
                    <PinLogo />
                </Link>
                
                <Link to={storedUser?.id ? `/user/show/${storedUser.id}` : `/user/login`}>
                    <AccountLogo />
                </Link>

                <Link to={'/search'}>
                    <Search />
                </Link>

                {storedUser?.id && (
                    <Link to={`/notification/${storedUser.id}`} >
                        <NotificationLogo />
                    </Link>
                )}

                <Link to={'/setting'}>
                    <SettingLogo className='setting_svg' />
                </Link>

            </nav>
        </header>
    )
}