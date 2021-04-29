interface IOrder {
    id: number;
    petId: number;
    quantity: number;
    shipDate: Date;
    status: string;
    complete: boolean;
}

export default IOrder;
