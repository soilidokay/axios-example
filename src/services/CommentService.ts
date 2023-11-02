import { IComment } from '../Models'
import ServiceBase from './Base'
import { CreateHttpService } from './Http'
import { FetchDelay } from './Http/helper'

class CommentService extends ServiceBase {
  constructor() {
    super(CreateHttpService('https://65434ce301b5e279de202673.mockapi.io/api/v1/comments'))
  }
  All = () => {
    return FetchDelay(() => this.TryGet<IComment[]>('/'), 300)
  }
  Create = () => {
    return FetchDelay(
      () => this.Post<IComment>('/post', { dateCreated: new Date().toISOString(), message: 'Hello' } as IComment),
      300
    )
  }
}

export const commentService = new CommentService()
