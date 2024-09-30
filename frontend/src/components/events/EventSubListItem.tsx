import {Visibility} from "@mui/icons-material";
import {Divider, IconButton, ListItem, Stack, Typography} from "@mui/material";
import moment from "moment";
import {generatePath, useNavigate} from "react-router-dom";
import {Event} from "../../interfaces/Event.ts";
import {privateRoutes} from "../../utils/Routes.ts";

interface EventSubListItemProps {
    event: Event;
}

export default function EventSubListItem({event}: Readonly<EventSubListItemProps>) {
    const navigate = useNavigate();

    const handleSeeDetails = () => {
        navigate(generatePath(privateRoutes.event, {event: event.name}));
    };

    return (<>
        <ListItem><Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
            <Typography flex={2.5} fontWeight={"bold"}>{event.name}</Typography>
            <Typography flex={1}>{event.menus.length} menus</Typography>
            <Typography flex={1}>{moment(event.date).format("DD/MM/YYYY")}</Typography>
            <IconButton onClick={handleSeeDetails} color={"primary"} edge={"end"}><Visibility/></IconButton>
        </Stack></ListItem>
        <Divider/>
    </>);
}