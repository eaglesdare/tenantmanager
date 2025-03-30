import { useState } from "react";
import { Tenant } from "../../model/Tenant.ts";
import { Room } from "../../model/Room.ts";
import "./RoomsPage.css";

interface RoomsPageParams {
    rooms: Room[];
    addRoom: (room: Room) => void;
    removeRoomAt: (index: number) => void;
    tenants: Tenant[];
}

function RoomsPage({ rooms, addRoom, removeRoomAt, tenants }: RoomsPageParams) {
    const [newRoomNumber, setNewRoomNumber] = useState<string>("");
    const [newRoomCapacity, setNewRoomCapacity] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleAddRoom = () => {
        const roomNumber = Number(newRoomNumber);
        const roomCapacity = Number(newRoomCapacity);

        if (roomNumber <= 0 || roomCapacity <= 0 || isNaN(roomNumber) || isNaN(roomCapacity)) {
            setError("Будь ласка, введіть коректні значення для номера та вмістимості кімнати.");
        } else {
            addRoom({ number: roomNumber, capacity: roomCapacity });
            setNewRoomNumber("");
            setNewRoomCapacity("");
            setError("");
        }
    };

    const handleRemoveRoom = (index: number) => {
        removeRoomAt(index);
    };

    const getTenantsInRoom = (roomNumber: number) => {
        return tenants
            .filter((tenant) => tenant.room === roomNumber)
            .map((tenant) => tenant.name)
            .join(", ");
    };

    const isRoomOccupied = (roomNumber: number) => {
        // Перевірка чи є хоча б один мешканець у кімнаті
        return tenants.some((tenant) => tenant.room === roomNumber);
    };

    return (
        <div>
            <h2>Список кімнат</h2>
            <table className="roomsTable">
                <thead>
                <tr>
                    <th>Номер кімнати</th>
                    <th>Вмістимість</th>
                    <th>Мешканці</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {rooms.map((room, index) => ({
                    room,
                    index
                })).sort(({ room: { number: a } }, { room: { number: b } }) => a - b).map(({ room, index }) => (
                    <tr key={index}>
                        <td>{room.number}</td>
                        <td>{room.capacity}</td>
                        <td>{getTenantsInRoom(room.number)}</td>
                        <td>
                            <button
                                onClick={() => handleRemoveRoom(index)}
                                disabled={isRoomOccupied(room.number)}
                            >
                                Видалити
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div>
                <input
                    type="number"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="Номер кімнати"
                />
                <input
                    type="number"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(e.target.value)}
                    placeholder="Вмістимість кімнати"
                />
                <button
                    onClick={handleAddRoom}
                    disabled={newRoomNumber.trim() === "" || newRoomCapacity.trim() === "" || isNaN(Number(newRoomNumber)) || isNaN(Number(newRoomCapacity))}
                >
                    Додати кімнату
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
}

export default RoomsPage;
