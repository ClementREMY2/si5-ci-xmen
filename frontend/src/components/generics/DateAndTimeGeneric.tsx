import {Typography} from "@mui/material";
import moment from "moment";
import {useEffect, useState} from "react";

interface DateAndTimeGenericProps {
    displayDate?: boolean;
    displayDateLabel?: boolean;
    displayTime?: boolean;
    displayTimeLabel?: boolean;
}

export default function DateAndTimeGeneric({
    displayDate,
    displayDateLabel,
    displayTime,
    displayTimeLabel
}: Readonly<DateAndTimeGenericProps>) {
    const [date, setDate] = useState(moment(new Date()));

    // Update the date every second
    useEffect(() => {
        const interval = setInterval(() => {
            setDate(moment(new Date()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (<>
            {displayDate &&
                <Typography variant={"h6"}>{displayDateLabel && "Date: "}{date.format("DD/MM/YYYY")}</Typography>}
            {displayTime && <Typography variant={"h6"}>{displayTimeLabel && "Heure: "}{date.format("HH")}h{date.format(
                "mm")}</Typography>}
        </>
    );
}