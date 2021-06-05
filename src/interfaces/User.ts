interface IUser {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
    userStatus: number;
}

export default IUser;
