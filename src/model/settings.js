import Backbone from 'backbone';
import {TWITTER_API} from '../constants';

export const Settings = Backbone.Model.extend({
  url: `${TWITTER_API}/account/settings`,
  parse: response => {
    if (response.errors) {
      console.error(...response.errors);
    }
    return response;
  }
});

export default Settings;