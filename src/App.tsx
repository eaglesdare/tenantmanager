import './App.css'
import kaiLogo from './assets/kai.png';
import {useState} from "react";
import RoomsPage from "./component/roomsPage/RoomsPage.tsx";
import {Tenant} from "./model/Tenant.ts";
import {Room} from "./model/Room.ts";
import TenantsPage from "./component/tenantsPage/TenantsPage.tsx";
import { useLocalStorage } from "@uidotdev/usehooks";

enum Tab {
    TENANTS,
    ROOMS,
}

const initialRooms: Room[] = [
    { number: 201, capacity: 4 },
    { number: 202, capacity: 4 },
    { number: 203, capacity: 4 },
    { number: 204, capacity: 4 },
    { number: 205, capacity: 4 },
    { number: 206, capacity: 4 },
    { number: 207, capacity: 4 },
    { number: 208, capacity: 4 },
    { number: 209, capacity: 4 },
    { number: 210, capacity: 4 },
    { number: 301, capacity: 4 },
    { number: 302, capacity: 4 },
    { number: 303, capacity: 4 },
    { number: 304, capacity: 4 },
    { number: 305, capacity: 4 },
    { number: 306, capacity: 4 },
    { number: 307, capacity: 4 },
    { number: 308, capacity: 4 },
    { number: 309, capacity: 4 },
    { number: 310, capacity: 4 },
];

const initialTenants: Tenant[] = [
    { name: "Пивоваров Артем Ігорович", room: 201, faculty: "ФКНТ", checkInDate: "2024-02-09", checkOutDate: "2025-06-01", gender: "male" },
    { name: "Софія Михайлівна Ротару", room: 202, faculty: "ФКНТ", checkInDate: "2024-02-09", checkOutDate: "2025-06-01", gender: "female" },
    { name: "Лобода Світлана Сергіївна", room: 202, faculty: "ФЕБА", checkInDate: "2024-02-09", checkOutDate: "2025-06-01", gender: "female" },
    { name: "Скрябін Андрій Валерійович", room: 305, faculty: "ФЛСК", checkInDate: "2024-02-09", checkOutDate: "2025-06-01", gender: "male" },
    { name: "Вакарчук Святослав Вікторович", room: 305, faculty: "ФЛСК", checkInDate: "2024-02-09", checkOutDate: "2025-06-01", gender: "male" },
];

function App() {
    const [currentTab, setCurrentTab] = useState(Tab.TENANTS);

    const [rooms, setRooms] = useLocalStorage<Room[]>("rooms", initialRooms);
    const [tenants, setTenants] = useLocalStorage<Tenant[]>("tenants", initialTenants);

    function renderContent() {
        switch (currentTab) {
            case Tab.ROOMS:
                return <RoomsPage rooms={rooms} addRoom={(room: Room) => setRooms([...rooms, room])} removeRoomAt={(index: number) => setRooms(rooms.filter((_, i) => i !== index))} tenants={tenants}></RoomsPage>
            case Tab.TENANTS:
                return <TenantsPage rooms={rooms} addTenant={(tenant: Tenant) => setTenants([...tenants, tenant])} removeTenantAt={(index: number) => setTenants(tenants.filter((_, i) => i !== index))} tenants={tenants}></TenantsPage>
        }
    }

    return (
        <>
            <div className="headerBlock">
                <img src={kaiLogo} width={200}></img>
                <h1>Управління Гуртожитком №3 УЖС КАІ</h1>
                <button onClick={() => setCurrentTab(Tab.TENANTS)} disabled={currentTab === Tab.TENANTS}
                        className={`tabButton ${currentTab === Tab.TENANTS ? "tabButtonActive" : ""}`}>Мешканці
                </button>
                <button onClick={() => setCurrentTab(Tab.ROOMS)} disabled={currentTab === Tab.ROOMS}
                        className={`tabButton ${currentTab === Tab.ROOMS ? "tabButtonActive" : ""}`}>Кімнати
                </button>
            </div>
            <div className="contentBlock">
                {renderContent()}
            </div>
        </>
    )
}

export default App
