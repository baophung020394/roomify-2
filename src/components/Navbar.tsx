import { Box } from "lucide-react";
import { Button } from "./ui/Button";
import { useOutletContext } from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }
            return;
        }
        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }


    }
    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className="logo" />

                        <span className="name">
                            Roomify
                        </span>
                    </div>

                    <ul className="links">
                        <a href="#">Product</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                <span className="greeting-prefix">Hi,</span>
                                <span className="greeting-name">
                                    {userName ? userName.toUpperCase() : 'SIGNED IN'}
                                </span>
                            </span>
                            <Button size="sm" variant="primary" onClick={handleAuthClick}>
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={handleAuthClick} className="login">
                                Login
                            </button>
                            <a href="#upload" className="cta">
                                Get Started
                            </a>
                        </>
                    )}



                </div>
            </nav >
        </header >
    )
}

export default Navbar;