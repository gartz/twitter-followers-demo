import Backbone from 'backbone';
import {TWITTER_API} from '../constants';

export const Settings = Backbone.Model.extend({
  url: `${TWITTER_API}/account/settings`
});

export default Settings;