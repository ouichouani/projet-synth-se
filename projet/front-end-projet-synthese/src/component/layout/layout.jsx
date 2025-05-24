import Header from '../parties/header';
import Footer from '../parties/footer';
import { Outlet } from 'react-router-dom';

// css fiiles--------------------
import '../../css/pin.css'
import '../../css/parties.css';
import '../../css/user.css';
import '../../css/app.css';
import '../../css/comment.css';
// ------------------------------


export default function Layout() {

    return (

        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />

        </>
    )

}