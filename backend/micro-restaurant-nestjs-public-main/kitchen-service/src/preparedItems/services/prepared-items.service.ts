import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PreparedItem, PreparedItemDocument } from '../schemas/prepared-item.schema';
import { PostEnum } from '../../shared/schemas/post-enum.schema';

import { KitchenFacadeService } from '../../kitchenFacade/services/kitchen-facade.service';

import { PreparedItemIdNotFoundException } from '../exceptions/prepared-item-id-not-found.exception';
import { ItemAlreadyStartedToBeCookedException } from '../exceptions/item-already-started-to-be-cooked.exception';
import { ItemNotStartedToBeCookedException } from '../exceptions/item-not-started-to-be-cooked.exception';
import { ItemAlreadyFinishedToBeCookedException } from '../exceptions/item-already-finished-to-be-cooked.exception';

@Injectable()
export class PreparedItemsService {
  constructor(
    @InjectModel(PreparedItem.name) private preparedItemModel: Model<PreparedItemDocument>,
    private readonly kitchenFacadeService: KitchenFacadeService,
  ){}

  async findPreparedItemById(preparedItemId: string, withRecipe: boolean = true): Promise<PreparedItem> {
    let foundPreparedItemRequest = this.preparedItemModel.findOne({ _id: preparedItemId }, { recipe: 0 });
    if (withRecipe) {
      foundPreparedItemRequest = this.preparedItemModel.findOne({ _id: preparedItemId }).populate('recipe');
    }

    const foundPreparedItem = await foundPreparedItemRequest.lean();

    if (foundPreparedItem === null) {
      throw new PreparedItemIdNotFoundException(preparedItemId);
    }

    return foundPreparedItem;
  }

  async getAllItemsToStartCookingNow(post: PostEnum): Promise<PreparedItem[]> {
    const now: Date = new Date();

    const preparedItems: PreparedItem[] = await this.preparedItemModel
      .find({ 'startedAt': { $eq: null }, 'shouldStartAt': { $lte: now.toISOString() } })
      .sort({ shouldStartAt: 1, _id: 1 })
      .populate('recipe')
      .lean();

    return preparedItems.filter((preparedItem) => (preparedItem.recipe.post === post));
  }

  async startCookingItem(preparedItemId: string): Promise<PreparedItem> {
    const preparedItem = await this.findPreparedItemById(preparedItemId);

    if (preparedItem.startedAt !== null) {
      throw new ItemAlreadyStartedToBeCookedException(preparedItem);
    }

    preparedItem.startedAt = new Date();

    return this.preparedItemModel.findByIdAndUpdate(preparedItem._id, preparedItem, { returnDocument: 'after' }).populate('recipe');
  }

  async finishCookingItem(preparedItemId: string): Promise<PreparedItem> {
    const preparedItem = await this.findPreparedItemById(preparedItemId, false);

    if (preparedItem.startedAt === null) {
      throw new ItemNotStartedToBeCookedException(preparedItem);
    }

    if (preparedItem.finishedAt !== null) {
      throw new ItemAlreadyFinishedToBeCookedException(preparedItem);
    }

    const updatedPreparedItem: PreparedItem = await this.preparedItemModel.findByIdAndUpdate(preparedItem._id, { finishedAt: new Date() }, { returnDocument: 'after', select: { recipe: 0 } }).lean();

    await this.kitchenFacadeService.checkAndUpdatePreparation(updatedPreparedItem);

    return updatedPreparedItem;
  }
}
