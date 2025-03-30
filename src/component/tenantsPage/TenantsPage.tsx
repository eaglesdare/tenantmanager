import {useState} from "react";
import {Tenant} from "../../model/Tenant.ts";
import {Room} from "../../model/Room.ts";
import "./TenantsPage.css";

interface TenantsPageParams {
    rooms: Room[];
    tenants: Tenant[];
    addTenant: (tenant: Tenant) => void;
    removeTenantAt: (index: number) => void;
}

function TenantsPage({rooms, tenants, addTenant, removeTenantAt}: TenantsPageParams) {
    const [newTenantName, setNewTenantName] = useState<string>("");
    const [newTenantFaculty, setNewTenantFaculty] = useState<string>("");
    const [newTenantGender, setNewTenantGender] = useState<'male' | 'female' | ''>('');
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [checkInDate, setCheckInDate] = useState<string>("");
    const [checkOutDate, setCheckOutDate] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const hasOppositeGender = (roomNumber: number, gender: 'male' | 'female' | '') => {
        const existingTenants = tenants.filter(tenant => tenant.room === roomNumber);
        return existingTenants.some(tenant => tenant.gender !== gender);
    };

    const availableRooms = rooms.filter(room => {
        const roomOccupants = tenants.filter(tenant => tenant.room === room.number);
        return roomOccupants.length < room.capacity && !hasOppositeGender(room.number, newTenantGender);
    });

    availableRooms.sort((a, b) => {
        const aTenantCount = tenants.filter(tenant => tenant.room === a.number).length;
        const bTenantCount = tenants.filter(tenant => tenant.room === b.number).length;

        if (aTenantCount !== bTenantCount) {
            return aTenantCount - bTenantCount;
        }

        return 0;
    });

    const faculties = Array.from(new Set(tenants.map(tenant => tenant.faculty)));

    const formatDate = (date: string) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0];
    };

    const handleAddTenant = () => {
        if (!newTenantName.trim() || !newTenantFaculty.trim() || !newTenantGender || selectedRoom === null) {
            setError("Будь ласка, заповніть всі поля та оберіть кімнату.");
            return;
        }

        const formattedCheckInDate = formatDate(checkInDate);
        if (!formattedCheckInDate) {
            setError("Будь ласка, введіть правильну дату заселення у форматі YYYY-MM-DD.");
            return;
        }

        const formattedCheckOutDate = checkOutDate ? formatDate(checkOutDate) : null;
        if (!formattedCheckOutDate) {
            setError("Будь ласка, введіть правильну дату виселення у форматі YYYY-MM-DD.");
            return;
        }

        if (formattedCheckOutDate && formattedCheckInDate > formattedCheckOutDate) {
            setError("Дата виселення не може бути раніше дати заселення.");
            return;
        }

        const newTenant: Tenant = {
            name: newTenantName,
            room: selectedRoom,
            faculty: newTenantFaculty,
            gender: newTenantGender,
            checkInDate: formattedCheckInDate,
            checkOutDate: formattedCheckOutDate
        };

        addTenant(newTenant);
        setNewTenantName("");
        setNewTenantFaculty("");
        setNewTenantGender('');
        setSelectedRoom(null);
        setCheckInDate("");
        setCheckOutDate("");
        setError(null);
    };

    const handleRemoveTenant = (index: number) => {
        removeTenantAt(index);
    };

    return (
        <div>
            <h2>Таблиця мешканців</h2>
            <table className="tenantsTable">
                <thead>
                <tr>
                    <th>Ім'я</th>
                    <th>Кімната</th>
                    <th>Факультет</th>
                    <th>Стать</th>
                    <th>Дата заселення</th>
                    <th>Дата виселення</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {tenants.map((tenant, index) => (
                    <tr key={index}>
                        <td>{tenant.name}</td>
                        <td>{tenant.room}</td>
                        <td>{tenant.faculty}</td>
                        <td>{tenant.gender === 'male' ? 'Чоловік' : 'Жінка'}</td>
                        <td>{tenant.checkInDate}</td>
                        <td>{tenant.checkOutDate}</td>
                        <td>
                            <button onClick={() => handleRemoveTenant(index)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {error && <div style={{color: "red", marginTop: "10px"}}>{error}</div>}

            <div>
                <h3>Додати нового мешканця</h3>
                <input
                    type="text"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    placeholder="Ім'я мешканця"
                />
                <input
                    list="faculty-options"
                    value={newTenantFaculty}
                    onChange={(e) => setNewTenantFaculty(e.target.value)}
                    placeholder="Факультет"
                />
                <datalist id="faculty-options">
                    {faculties.map((faculty, index) => (
                        <option key={index} value={faculty}/>
                    ))}
                </datalist>
                <select
                    value={newTenantGender}
                    onChange={(e) => setNewTenantGender(e.target.value as 'male' | 'female')}
                >
                    <option value="">Оберіть стать</option>
                    <option value="male">Чоловік</option>
                    <option value="female">Жінка</option>
                </select>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    placeholder="Дата заселення"
                />
                <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    placeholder="Дата виселення"
                />
                <input
                    list="room-options"
                    value={selectedRoom || ""}
                    onChange={(e) => setSelectedRoom(Number(e.target.value))}
                    placeholder="Оберіть або введіть номер кімнати"
                />
                <datalist id="room-options">
                    {availableRooms.map((room) => (
                        <option key={room.number} value={room.number}>
                            Кімната {room.number} (Вільно
                            місць: {room.capacity - tenants.filter(tenant => tenant.room === room.number).length})
                        </option>
                    ))}
                </datalist>
                <button onClick={handleAddTenant}>Додати мешканця</button>
            </div>
        </div>
    );
}

export default TenantsPage;
