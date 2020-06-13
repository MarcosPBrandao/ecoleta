import knex from '../database/connection';
import { Request, Response } from 'express';
import Knex from 'knex';
class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));
      const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')     
      const serializedPoints = points.map(point => {
        return {
          ...points,
          image_url: `http://localhost:3333/uploads/${point.image}`,
        };
      });
    return response.json(points);
  }  
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex('points').where('id', id).first();
    if (!point) {
        return response.status(400).json({ message: 'Point not found' });
    }
    const serializedPoint = {
      ...point,
      image_url: `http://localhost:3333/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');
    return response.json({ point: serializedPoint, items });
  }  
  async create(request: Request, response: Response) {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body;
    //console.log(items);
    const trx = await knex.transaction();
    const point = {
        image: '7dae8bfb3206-photo-1477763858572-cda7deaa9bc5.jpg',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
   }
    const insertedIds = await trx('points').insert(point);
    const point_id = insertedIds[0];
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
            item_id,
            point_id,
        };
    })
    await trx('point_items').insert(pointItems);
    await trx.commit();
    return response.json({
        id: point_id, 
        ...point,
     });
   }      
};

export default PointsController;