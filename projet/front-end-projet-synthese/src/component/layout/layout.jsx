import Header from '../parties/header';
import Footer from '../parties/footer';
import { Outlet } from 'react-router-dom';

// css fiiles--------------------
import '../../css/pin.css'

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