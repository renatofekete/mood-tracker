import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function Home() {
    const authContext = useContext(AuthContext);
        
    if(!authContext) {
        return <div>Loading...</div>;
    }
    
    const {session} = authContext;
    return (
        <div>
        <h1>Home</h1>
            {session ? <div>Logged in! {session.user?.user_metadata.name}</div> : <div>Not logged in</div>}
        </div>
    );
}