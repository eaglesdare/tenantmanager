import './App.css'
import kaiLogo from './assets/kai.png';
import {useState} from "react";
import {useList} from "@uidotdev/usehooks";
import RoomsPage from "./component/roomsPage/RoomsPage.tsx";
import {Tenant} from "./model/Tenant.ts";
import {Room} from "./model/Room.ts";
import TenantsPage from "./component/tenantsPage/TenantsPage.tsx";

enum Tab {
    TENANTS,
    ROOMS,
}

function App() {
    const [currentTab, setCurrentTab] = useState(Tab.TENANTS);
    const [rooms, { push: addRoom, removeAt: removeRoomAt }] = useList([] as Room[]);
    const [tenants, { push: addTenant, removeAt: removeTenantAt }] = useList([] as Tenant[]);

    function renderContent() {
        switch (currentTab) {
            case Tab.ROOMS:
                return <RoomsPage rooms={rooms} addRoom={addRoom} removeRoomAt={removeRoomAt} tenants={tenants}></RoomsPage>
            case Tab.TENANTS:
                return <TenantsPage rooms={rooms} addTenant={addTenant} removeTenantAt={removeTenantAt} tenants={tenants}></TenantsPage>
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
