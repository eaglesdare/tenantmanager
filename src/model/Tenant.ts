export interface Tenant {
    name: string;
    room: number;
    faculty: string;
    gender: 'male' | 'female';
    checkInDate: string;
    checkOutDate: string;
}