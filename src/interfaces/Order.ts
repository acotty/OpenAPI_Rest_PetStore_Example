interface IOrder {
    id: number;
    petId: number;
    quantity: number;
    shipDate: Date;
    status: string;
    complete: Boolean;
}

export default IOrder;
