import './index.css';
import Backbone from 'backbone';
import UserListView from './view/user-list/user-list';
import UsersTiles from './view/users-tiles/users-tiles';
import UserTile from './view/user-tile/user-tile';
import SettingsModel from './model/settings';
import PushStateTree from 'push-state-tree';
import $ from 'jquery';

const settingsModel = new SettingsModel();

// Container with user lists
const userListView = new UserListView({
  View: Backbone.View.extend({
    className: 'user-list-item',
    render() {
      // Render the initial list
      let userTiles = new UsersTiles({
        View: UserTile,
        collection: this.model.get('followers')
      });
      userTiles.render();
      this.$el.append(userTiles.$el);

      // Add event to add new lists
      userTiles.on('select', (view) => {
        let screen_name = view.model.get('screen_name');

        let index = userListView.collection.findIndex(model => model.get('followers') === userTiles.collection);
        if (index === -1) {
          userListView.collection.add({screen_name});
          return;
        }

        let nextModel = userListView.collection.at(index + 1);
        let removeList;
        if (nextModel && nextModel.get('screen_name') === screen_name) {
          removeList = userListView.collection.slice(index + 2);
          userListView.collection.remove(removeList);
        } else {
          removeList = userListView.collection.slice(index + 1);
          userListView.collection.remove(removeList);
          userListView.collection.add({screen_name});
        }
      });
    }
  })
});

const router = new PushStateTree({
  usePushState: true
});

const route = router.createRule({
  id: 'selector',
  rule: /.*/
});

$(route).on('match', function () {
  // When no user is specified redirect to the current user
  if (!this.uri) {
    settingsModel.fetch();
    settingsModel.on('change:screen_name', () => {
      this.navigate(settingsModel.get('screen_name'));
    });
    return;
  }

  let usersNav = this.uri.split('/');
  userListView.render();
  userListView.$el.appendTo('body');

  // Initial value
  usersNav.forEach(screen_name => {
    userListView.collection.add({screen_name: screen_name});
  });
}).appendTo(router);