import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { Game, GameDocument } from './Schemas/game.schema';
import { Publisher, PublisherDocument } from './Schemas/publisher.schema';
import { v4 as uuidv4 } from 'uuid';

export class FetchGameById {
  id: String
}

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

@Injectable()
export class AppService {

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Publisher.name) private publisherModel: Model<PublisherDocument>) { 
      // SET DISCOUNT AND REMOVE OLD GAMES EVERY 10 minutes
      setInterval(async ()=>{
        const data = await this.gameModel.find({})
        
        data.forEach(async e=> {
          const months = monthDiff(e.releaseDate, new Date())
         
          // set discount
          if(months >= 12 && months <=18) {
            if(!e.discounted) {
              let discountedPrice = e.price - (e.price * 10 / 100)
              await this.gameModel.findOneAndUpdate({id: e.id}, {$set : {price: discountedPrice, discounted: true}})
            }
          }

          // remove old games
          if(months > 18) {
            await this.gameModel.deleteOne({id: e.id})
          }
        })
        
      }, 600000)
    }

  async get(body: FetchGameById, response: Response): Promise<any> {
    try {
      const query = await this.gameModel.findOne({id: body.id})

      const checkPublisher = await this.publisherModel.findOne({id: query.publisher})

      if(!checkPublisher) return response.status(HttpStatus.BAD_REQUEST).send({
       message: 'Publisher does not exist, register publisher first',
       data: {}
      });

      const sendBack = {
        title: query.title,
        price: query.price,
        id: query.id,
        tags: query.tags,
        releaseDate: query.releaseDate,
        publisher: checkPublisher
      }

      return response.status(HttpStatus.OK).send({data: sendBack, message: ''})

    } catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: "error", data: {}})
    }
  }

  async create(body: GameDocument, response: Response): Promise<any> {
    const id = uuidv4()
    const title = body.title
    const price = body.price
    const tags = body.tags
    const releaseDate = body.releaseDate
    const publisher = body.publisher

    if (!title || !price || !tags || !releaseDate || !publisher)
      return response.status(HttpStatus.BAD_REQUEST).send({
        message: 'Bad data provided',
        data: {}
       });

    const checkPublisher = await this.publisherModel.findOne({id: publisher})

    if(!checkPublisher) return response.status(HttpStatus.BAD_REQUEST).send({
      message: 'Publisher does not exist, register publisher first',
      data: {}
     });

    try {
      const query: any = await new this.gameModel({
        id, title, price, tags, releaseDate, publisher
      }).save()
      return response.status(HttpStatus.CREATED).send({message: "Created", data: {}})
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: "error", data: {}})
    }
  }

  async createPublisher(body: PublisherDocument, response: Response): Promise<any> {
    const id = uuidv4()
    const name = body.name
    const siret = body.siret
    const phone = body.phone

    if (!name || !siret || !phone) return response.status(HttpStatus.BAD_REQUEST).send({message: "Bad data", data: {}});

    try {
      const query: any = await new this.publisherModel({
        id, name, siret, phone
      }).save()
      return response.status(HttpStatus.CREATED).send({data: query, message: ""})
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: "error", data: {}})
    }
  }

  async update(body: GameDocument, response: Response): Promise<any> {

    const checkExist = await this.gameModel.findOne({id: body.id})

    if(!checkExist) return response.status(HttpStatus.NOT_FOUND).send({message: "Not found", data: {}})

    try {
      const query: any = await this.gameModel.findOneAndUpdate({id: checkExist.id}, {
        title: body?.title ?? checkExist.title,
        price: body?.price ?? checkExist.price,
        releaseDate: body?.releaseDate ?? checkExist.releaseDate,
        tags: body?.tags ?? checkExist.tags
      })
      return response.status(HttpStatus.CREATED).send({message: "Updated", data: {}})
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: "Error", data: {}})
    }
  }

  async delete(body: FetchGameById, response: Response): Promise<any> {
    try {
      const query = await this.gameModel.deleteOne({id: body.id})
      if(query.deletedCount===0) return response.status(HttpStatus.BAD_REQUEST).send({message: "Bad data, not found", data: {}});
      return response.status(HttpStatus.OK).send({message: "Deleted", data: {}})
    } catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: "Error", data: {}})
    }
  }
}
