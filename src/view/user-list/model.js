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
    this.on('update', () => {
      this.forEach((model, index) => {
        let previousModel = this.at(index - 1);
        if (!previousModel) return;

        let screen_name = model.get('screen_name').toLocaleLowerCase();
        let followers = previousModel.get('followers');

        if (followers._oldSelectListener) followers.off('add', followers._oldSelectListener);
        followers._oldSelectListener = selectModel => {
          if (selectModel.get('screen_name').toLocaleLowerCase() === screen_name) {
            let oldSelected = followers.findWhere({selected: true});
            if (oldSelected) oldSelected.set('selected', false);
            selectModel.set('selected', true);
            return true;
          }
        };
        followers.on('add', followers._oldSelectListener);
        followers.find(followers._oldSelectListener);
      });
    });
  }
});