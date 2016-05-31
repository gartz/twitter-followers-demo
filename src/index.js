import './index.css';
import Backbone from 'backbone';
import UserListView from './view/user-list/user-list';
import UsersTiles from './view/users-tiles/users-tiles';
import UserTile from './view/user-tile/user-tile';
import SettingsModel from './model/settings';
import PushStateTree from 'push-state-tree';
import $ from 'jquery';

const settingsModel = new SettingsModel();

const router = new PushStateTree({
  usePushState: true
});

const updateUrl = () => {
  let names = userListView.collection.pluck('screen_name');
  let uri = names.join('/');
  if (uri === router.uri) return;
  router.pushState(null, null, '/' + uri);
};

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
          updateUrl();
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
        updateUrl();
      });
    }
  })
});

userListView.render();
userListView.$el.appendTo('body');

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

  // Initial value
  usersNav.forEach((screen_name, index) => {
    let modelFromIndex = userListView.collection.at(index);

    if (!modelFromIndex) {
      userListView.collection.add({screen_name: screen_name});
      return;
    }

    // Skip if there were no changes
    if (modelFromIndex.get('screen_name').toLocaleLowerCase() === screen_name.toLocaleLowerCase()) return;

    let removeList = userListView.collection.slice(index + 1);
    userListView.collection.remove(removeList);
    userListView.collection.add({screen_name: screen_name});
  });

  if (userListView.collection.length > usersNav.length) {
    let unselectModel = userListView.collection.at(usersNav.length - 1);
    if (unselectModel) {
      let selectedFollower = unselectModel.get('followers').findWhere({selected: true});
      if (selectedFollower) selectedFollower.set('selected', false);
    }

    let removeList = userListView.collection.slice(usersNav.length);
    userListView.collection.remove(removeList);
  }
}).appendTo(router);