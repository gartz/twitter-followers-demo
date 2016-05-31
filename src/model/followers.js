import Backbone from 'backbone';
import User from './user';
import {TWITTER_API} from '../constants';

export const Followers = Backbone.Collection.extend({
  url: `${TWITTER_API}/followers/list`,
  model: User,
  parse: (response) => {
    if (response.errors) {
      console.error(...response.errors);
    }
    return response.users;
  }
});

export default Followers;