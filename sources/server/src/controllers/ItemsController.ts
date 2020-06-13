import { Request, Response } from 'express';
import knex from '../database/connection';
class ItemsController {
   async index(request: Request, response: Response)  {
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title, //exp://192.168.0.52:19000
        image_url: `http://192.168.0.52:3333/uploads/${item.image}`,
        //image_url: `http://localhost:3333/uploads/${item.image}`,
      };
    });
    return response.json(serializedItems);
}
}

export default ItemsController;