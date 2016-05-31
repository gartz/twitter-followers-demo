import Followers from '../../model/followers';
import Backbone from 'backbone';

export const FollowersModel = Backbone.Model.extend({
  sync: () => {},
  initialize() {
    this.on('change:screen_name', this.updateContent);

    if (!(this.get('followers') instanceof Followers)) {
      this.initFollowers();
    }
  },

  initFollowers() {
    this.set('followers', new Followers());

    this.updateContent();
  },

  updateContent() {
    let screen_name = this.get('screen_name') || '';

    this.get('followers').fetch({
      data: {
        screen_name,
        count: 200
      }
    });
  }
});

export const FollowersCollection = Backbone.Collection.extend({
  model: FollowersModel,
  sync: () => {}
});