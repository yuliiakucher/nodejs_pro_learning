
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class OrdersFilterInput {
    status?: Nullable<string>;
    dateFrom?: Nullable<string>;
    dateTo?: Nullable<string>;
}

export class OrdersPaginationInput {
    limit?: Nullable<number>;
    offset?: Nullable<number>;
}

export class Order {
    id: string;
    deliveryAddress: string;
    user: User;
    orderItems: Nullable<OrderItems>[];
    orderStatus: OrderStatus;
    createdAt: DateTime;
}

export class OrdersPagination {
    limit?: Nullable<number>;
    offset?: Nullable<number>;
}

export class OrdersResponse {
    nodes?: Nullable<Nullable<Order>[]>;
    pageInfo?: Nullable<OrdersPagination>;
    totalCount?: Nullable<number>;
}

export abstract class IQuery {
    abstract order(id: string): Nullable<Order> | Promise<Nullable<Order>>;

    abstract orders(filter?: Nullable<OrdersFilterInput>, pagination?: Nullable<OrdersPaginationInput>): Nullable<OrdersResponse> | Promise<Nullable<OrdersResponse>>;
}

export class OrderItems {
    id: string;
    order: Order;
    product: Product;
    priceAtPurchase: number;
    quantity: number;
}

export class OrderStatus {
    id: string;
    name: string;
    orders?: Nullable<Nullable<Order>[]>;
}

export class Product {
    id: string;
    title: string;
    description?: Nullable<string>;
    price: number;
    quantityInStock: number;
    orderItems?: Nullable<Nullable<OrderItems>[]>;
}

export class User {
    id: string;
    email: string;
    orders?: Nullable<Nullable<Order>[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
