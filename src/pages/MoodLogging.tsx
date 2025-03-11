
import { createClient } from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

interface MoodEntry {
    note_date: string;
    note: string;
    user_id: string;
    mood: number;
}

const supabase = createClient<unknown, never, GenericSchema>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function MoodLogging() {
    const authContext = useContext(AuthContext);
    if(!authContext) {
        return <div>Loading...</div>;
    }
    const {session} = authContext;

    const [date, setDate] = useState(new Date());

    const [d, setD] = useState<MoodEntry>({
        note_date: "string",
        note: "",
        user_id: "",
        mood: 0
    });

    const today = useMemo(() => new Date(), []);

    const handlePrevDay = () => {
        setDate(new Date(date.setDate(date.getDate() - 1)));
    }

    const handleNextDay = () => {
        setDate(new Date(date.setDate(date.getDate() + 1)));
    }

    async function handleAddData(e) {
        e.preventDefault();
        const { data, error } = await supabase.from('mood_entry').upsert(d, {onConflict: ['note_date', 'user_id']});
        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
    }

    function handleChange(e) {
        const val = e.target.value
        setD({
            ...d,
            [e.target.type === "number" ? "mood" : "note"]: val})
    }

    useEffect(() => {
        async function getData() {
            if(session?.user.id) {
                const { data } = await supabase.from('mood_entry').select().eq('note_date', date.toISOString().split("T", 1)[0]).eq('user_id', session?.user.id as string);
                console.log(data)
                setD({
                    note: data && data[0] ? data[0].note as string: "",
                    note_date: data && data[0] ? data[0].note_date as string : date.toISOString().split("T", 1)[0],
                    user_id: data && data[0] ? data[0].user_id as string : session?.user.id as string, 
                    mood: data && data[0] ? data[0].mood as number : 0
                });
            }
        }

        getData();
    }, [date, session])
    
    return (
        <div>
            <h1>Mood Logging  {session?.user.id}</h1>
            <h2>{date.toDateString()}</h2>
            <button onClick={handlePrevDay}>Previous Day</button>
            <button onClick={handleNextDay} disabled={today.toDateString() === date.toDateString()}>Next Day</button>
            <form>
            <input onChange={handleChange} type="text" value={d.note}/>
            <input onChange={handleChange} type="number" value={d.mood}/>
            <button onClick={handleAddData}>Save</button>
            </form>
        </div>
    );
}