export interface IReply {
  _id: string;
  review: string;
  user_id: string;
}

export interface IReview extends IReply {
  replies?: IReply[];
}
