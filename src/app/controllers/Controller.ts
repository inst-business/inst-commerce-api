import { RequestHandler } from 'express'
import { GV } from '@/config/global/const'
import ERR from '@/config/global/error'


abstract class Controller {

  protected abstract storeOne (): RequestHandler

  protected storeMany? (): RequestHandler
  
  protected abstract getOne (): RequestHandler

  protected abstract getMany (): RequestHandler

  protected abstract updateOne (): RequestHandler

  protected updateMany? (): RequestHandler

  protected getOneDeleted? (): RequestHandler

  protected getManyDeleted? (): RequestHandler

  protected deleteOne? (): RequestHandler

  protected deleteMany? (): RequestHandler

  protected deleteOneOrMany? (): RequestHandler

  protected restoreOne? (): RequestHandler

  protected restoreMany? (): RequestHandler

  protected restoreOneOrMany? (): RequestHandler

  protected destroyOne? (): RequestHandler

  protected destroyMany? (): RequestHandler

  protected destroyOneOrMany? (): RequestHandler

}

export default Controller