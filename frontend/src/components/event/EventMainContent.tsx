import {Box, Checkbox, Chip, ListItemText, MenuItem as SelectItem, Stack, TextField, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import React from "react";
import {Event} from "../../interfaces/Event.ts";
import {MenuCategoryEnum, MenuEvent, MenuItem} from "../../interfaces/Menu.ts";
import {menuNormalMock} from "../../mocks/Menu.ts";
import MultipleSelectGeneric from "../generics/MultipleSelectGeneric.tsx";
import EventMenuList from "./EventMenuList.tsx";

interface EventMainContentProps {
    event: Event;
    edit?: boolean;
    setEvent: React.Dispatch<React.SetStateAction<Event>>;
    changeIsMenuEditing?: (value: boolean) => void;
}

const getMenuBeverages = () => {
    return menuNormalMock.filter(menu => menu.category === MenuCategoryEnum.BEVERAGE);
};

export default function EventMainContent({
    event,
    edit,
    setEvent,
    changeIsMenuEditing = () => {}
}: Readonly<EventMainContentProps>) {
    const changeName = (name: string) => setEvent({...event, name});

    const changeDate = (date: Date) => setEvent({...event, date});

    const onClickBeverage = (beverage: MenuItem) => {
        if (event.beverages.includes(beverage)) {
            setEvent({...event, beverages: event.beverages.filter(b => b.id !== beverage.id)});
        } else {
            setEvent({...event, beverages: [...event.beverages, beverage]});
        }
    };

    const changeMenus = (menus: MenuEvent[]) => setEvent({...event, menus});

    const concatBeverages = () => {
        return event.beverages.map(beverage => beverage.fullName).join(", ");
    };

    const renderBeverage = (beverage: MenuItem) => (
        <SelectItem key={beverage.id} value={beverage.id} onClick={() => onClickBeverage(beverage)}>
            <Checkbox checked={event.beverages.includes(beverage)}/>
            <ListItemText primary={beverage.fullName}/>
        </SelectItem>
    );

    const renderValues = (selectedItems: MenuItem[]) => (
        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
            {selectedItems.map(item => (
                <Chip key={item.id} label={item.shortName}/>
            ))}
        </Box>
    );

    const editTopContent = () => (<>
        <TextField label={"Nom de l'événement"} value={event.name} sx={{width: "35%"}}
                   onChange={(event) => changeName(event.target.value)}/>
        <DatePicker label={"Date"} format={"DD/MM/YYYY"} value={moment(event.date)} sx={{width: "35%"}}
                    onChange={(date) => date && changeDate(date.toDate())}
                    minDate={moment(new Date())}/>
        <MultipleSelectGeneric
            label={"Boissons"}
            items={getMenuBeverages() ?? []}
            selectedValues={event.beverages}
            renderItem={renderBeverage}
            renderValues={renderValues}
            formControlSx={{width: "35%"}}
        />
    </>);

    const staticTopContent = () => (<>
        <Typography maxWidth={"50%"}>Nom de l'événement : {event.name}</Typography>
        <Typography>Date : {moment(event.date).format("DD/MM/YYYY")}</Typography>
        <Typography maxWidth={"50%"}>Boissons : {concatBeverages()}</Typography>
    </>);

    return (
        <Stack spacing={3} alignItems={"flex-start"} padding={2}>
            {edit ? editTopContent() : staticTopContent()}
            <EventMenuList menus={event.menus} editEvent={edit} changeMenus={changeMenus}
                           changeIsMenuEditing={changeIsMenuEditing}/>
        </Stack>
    );
}