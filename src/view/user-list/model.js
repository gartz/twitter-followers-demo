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

    let collection = this.get('followers');
    collection.fetch({
      data: {
        screen_name,
        count: 200
      }
    });
  }
});

export const FollowersCollection = Backbone.Collection.extend({
  model: FollowersModel,
  sync: () => {},
  initialize() {
    this.on('add', model => {
      let index = this.length - 2;
      if (index < 0) return;

      let previousModel = this.at(index);
      let screen_name = model.get('screen_name').toLocaleLowerCase();
      previousModel.get('followers').on('add', selectModel => {
        if (selectModel.get('screen_name').toLocaleLowerCase() === screen_name) {
          selectModel.set('selected', true);
        }
      });
    });
  }
});