// import { ClientModel } from "../models/client.model";
// import BaseService from "./base.service";
// import { HTTP404Error } from "../errorHandlers/HTTPErrors/HTTPClientError";

// class ClientService extends BaseService {
//   constructor() {
//     super(ClientModel);
//   }

//   //   async allOrders() {
//   //     const orders = await this.findAll();

//   //     return orders;
//   //   }

//   async fetchClient(id: string) {
//     const order = await this.findById(id);

//     if (!order) {
//       throw new HTTP404Error(`No such order: ${id}`);
//     }

//     return order;
//   }

//   //   async createOrder(data: IOrder) {
//   //     return await this.create(data);
//   //   }

//   //   async deleteOrder(id: string) {
//   //     const o = await this.findById(id);

//   //     if (!o) {
//   //       throw new HTTP404Error("No order with id: " + id);
//   //     }

//   //     const order = await this.delete(id);

//   //     return order;
//   //   }

//   //   async updateOrder(id: string, data: object) {
//   //     const u = await this.findById(id);

//   //     if (!u) {
//   //       throw new HTTP404Error("No order with id: " + id);
//   //     }

//   //     const r = await this.update(id, data);
//   //     return r;
//   //   }
// }

// export const clientService = new ClientService();
